/* File             : zndIMAPSync.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      : 1  get last file from db.
                      2. get imap config for mailbox containing files.
                      3. read all files from last stored file onwards in Database.

*/

/* ------------------     External Application Libraries      ----------------*/
const winston                           = require('winston')
var Imap                                = require('node-imap')
var inspect                             = require('util').inspect;
const fs                                = require('fs');
const { Base64Decode }                  = require('base64-stream')
/* ------------------ End External Application Libraries      ----------------*/

/* --------------- External Application Libraries Initialization -------------*/
/* ----------- End External Application Libraries Initialization -------------*/

/* ------------------     Internal Application Libraries      ----------------*/
const config                            = require('../services/configuration')
/* ------------------ End Internal Application Libraries      ----------------*/

/* ------------------------------------- Controllers -------------------------*/
const zndManageStatements               = require('../controllers/zndManageStatements')
/* -------------------------------- End Controllers --------------------------*/

/* ------------------------------------- Services ----------------------------*/
const Logger                            = require('../services/zndLoggerClass')
const zndMsg                            = require('../services/zndMsg')

/* -------------------------------- End Services -----------------------------*/

/* ------------------------------------- Models ------------------------------*/
const zndMailedStatements               = require('../models/zndMailedStatements.js')

/* -------------------------------- End Models -------------------------------*/

/* ---------------------------------  Application constants    ----------------*/
const logFileName                       = config.get('application:logFileName')
const applicationName                   = config.get('application:applicationName')
var   lastMailItem;
var   imap;
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization  -------------*/
const logger                            = new Logger(logFileName)
/* ----------- End Internal Application Libraries Initialization  -------------*/

/* ------------------------------------- Application Variables ----------------*/

/* ---------------------------------End Application Variables  ----------------*/

/* ------------------------------------- Functions   --------------------------*/
function openInbox(cb)
{   try
    {   logger.trace(applicationName + ':zndIMAPSync:openInbox:Started');
        imap.openBox('INBOX', true, cb);
        logger.trace(applicationName + ':zndIMAPSync:openInbox:Done');
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageData:openInbox:An exception occured:[' + ex + '].');
    }

}



 function getHeaderStruct(headerString,mailHeaderObject)
 {   try
     {   var headerArray;
         const  objectFields = ["from:","to:","subject:","date:"];
         
         logger.trace(applicationName + ':zndIMAPSync:getHeaderStruct:Started');

         headerArray     = [];
         headerArray     =   headerString.split('\n');

         mailHeaderObject.headerstring = headerString;
         for(let i=0 ; i< headerArray.length;i++)
         {   for(let j=0;j<objectFields.length;j++)
             {    if ( headerArray[i].includes(objectFields[j]) )
                  {   let lineArray = headerArray[i].split(objectFields[j])
                      let dataField =  lineArray[1].split('\'')

                      if (objectFields[j].includes("from:"))
                      {  mailHeaderObject.from = dataField[1];
                      }

                      if (objectFields[j].includes("to:" ))
                      {  mailHeaderObject.to = dataField[1];
                      }

                      if (objectFields[j].includes("subject:"))
                      { mailHeaderObject.subject = dataField[1];
                      }

                      if (objectFields[j].includes("date:"))
                      {  mailHeaderObject.date = dataField[1];
                      }
                  }
             }
         }
         logger.trace(applicationName + ':zndIMAPSync:getHeaderStruct:Done');
         return mailHeaderObject;
     }
     catch(ex)
     {   logger.exception(applicationName + ':zndManageData:getHeaderStruct:An exception occured:[' + ex + '].');
     }

 }



 function findAttachmentParts(struct, attachments)
 {   try
     {   logger.trace(applicationName + ':zndIMAPSync:findAttachmentParts:Started');

         attachments                    = attachments ||  [];

         for (var i = 0, len = struct.length, r; i < len; ++i)
         {   if (Array.isArray(struct[i]))
             {   findAttachmentParts(struct[i], attachments);
             }
             else
             {   if (struct[i].disposition && ['inline', 'attachment'].indexOf(struct[i].disposition.type.toLowerCase()) > -1)
                {   attachments.push(struct[i]);
                }
             }
         }

         logger.trace(applicationName + ':zndIMAPSync:findAttachmentParts:Done');
         return attachments;
     }
     catch(ex)
     {   logger.exception(applicationName + ':zndManageData:findAttachmentParts:An exception occured:[' + ex + '].');
     }
}



function buildAttMessageFunction(attachment, emailFrom, emailDate)
{   try
    {   const filename = attachment.params.name;
        const encoding = attachment.encoding;

        logger.trace(applicationName + ':zndIMAPSync:buildAttMessageFunction:Started');

        return function (msg, seqno) {
          var prefix = '(#' + seqno + ') ';
          msg.on('body', function(stream, info) {
            logger.debug(applicationName + ':zndIMAPSync:buildAttMessageFunction:Streaming this attachment to file', filename, info);
            var writeStream = fs.createWriteStream(filename);
            writeStream.on('finish', function() {
               logger.debug(applicationName + ':zndIMAPSync:buildAttMessageFunction:Done writing to file %s', filename);
            });

            //so we decode during streaming using
            if (encoding.toLowerCase() === 'base64') {
              //the stream is base64 encoded, so here the stream is decode on the fly and piped to the write stream (file)
              stream.pipe(new Base64Decode()).pipe(writeStream)
            } else  {
              //here we have none or some other decoding streamed directly to the file which renders it useless probably
              stream.pipe(writeStream);
            }
          });
          msg.once('end', function() {
            logger.debug(applicationName + ':zndIMAPSync:buildAttMessageFunction:Finished attachment %s', filename);
            logger.debug(applicationName + ':zndIMAPSync:buildAttMessageFunction:Attachment downloaded: %s', filename);
          });
        };

        logger.trace(applicationName + ':zndIMAPSync:buildAttMessageFunction:Done');
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageData:buildAttMessageFunction:An exception occured:[' + ex + '].');
    }

}

async function updateDatabase(record)
{   try
    {   var items;        
        logger.trace(applicationName + ':zndIMAPSync:updateDatabase:Started');

        items                           = await zndMailedStatements.find({mailID: record.mailID});
        if (items.length == 0)
        {   logger.debug(applicationName + ':zndIMAPSync:updateDatabase:Item:['+ record.mailID +'] not Found Adding');
            items                       = await zndMailedStatements.create(record);
        }
        else
        {  if(items.length > 1)
           {   logger.exception(applicationName + ':zndIMAPSync:updateDatabase:Multiple items Found!!!!:['+ record.mailID +']!!!!!');
           }
           else
           {   logger.debug(applicationName + ':zndIMAPSync:updateDatabase:Item:['+ record.mailID +'] already exist Not Adding');
           }
        }
        logger.trace(applicationName + ':zndIMAPSync:updateDatabase:Done');
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageData:updateDatabase:An exception occured:[' + ex + '].');
    }
}


async function handleMessage(msg, seqno)
{   try
    {   var prefix, emailDate, emailFrom, mailHeader;

        logger.trace(applicationName + ':zndIMAPSync:handleMessage:Started');

        mailHeader                          = {};
        mailHeader.mailID                   = seqno;
        prefix                              = '(#' + seqno + ') ';

        msg.on('body', function(stream, info)
        {   var buffer;

            buffer                          = '';
            stream.on('data', function(chunk)
            {   buffer                      += chunk.toString('utf8');
            });

            stream.once('end', function()
            {   mailHeader                  = getHeaderStruct(inspect(Imap.parseHeader(buffer)), mailHeader);                              
                updateDatabase(mailHeader)
            });
        });

        msg.once('attributes', function(attrs)
        {   const attachments = findAttachmentParts(attrs.struct);
            for (var i = 0, len=attachments.length ; i < len; ++i)
            {   const attachment = attachments[i];
                logger.debug(applicationName + ':zndIMAPSync:handleMessage:Fetching attachment %s', attachment.params.name);
                var f = imap.fetch(attrs.uid , {   bodies: [attachment.partID],
                                                   struct: true
                                               });
                    //console.log(prefix + 'Attachment %s', attachment);
                    //build function to process attachment message
                    //f.on('message', buildAttMessageFunction(attachment, emailFrom, emailDate));
                  }
        });

        msg.once('end', function() {
          logger.debug(applicationName + ':zndIMAPSync:handleMessage:Finished!', prefix);
        });
        logger.trace(applicationName + ':zndIMAPSync:handleMessage:Done');
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageData:handleMessage:An exception occured:[' + ex + '].');
    }
}



function openInBoxCB(err, box)
{   try
    {   var f, boxOptions, boxRange,noObj;

        logger.trace(applicationName + ':zndIMAPSync:openInBoxCB:Started');

        if (err)
        {   logger.error(applicationName + ':zndIMAPSync:openInBoxCB:Recveived error throwing exception:', err);
            throw err;
        }
        noObj                               = {};

        boxOptions                          = {   bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
                                                   struct: true
                                              };

        boxRange                            = getLastMailItem();

        logger.debug(applicationName + ':zndIMAPSync:openInBoxCB:boxRange : [' + boxRange+ '].');

        f                                   = imap.seq.fetch(boxRange,boxOptions);

        f.on('message', handleMessage);

        f.once('error', function(err)
        {   logger.error(applicationName + ':zndIMAPSync:openInBoxCB:An mailbox error occurred:', err);
        });

        f.once('end', function()
        {   logger.debug(applicationName + ':zndIMAPSync:openInBoxCB:Done fetching all messages!');
            imap.end();
            zndMsg.eventBus.sendEvent('fetchingDone', noObj)
        });
        logger.trace(applicationName + ':zndIMAPSync:openInBoxCB:Done');
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageData:openInBoxCB:An exception occured:[' + ex + '].');
    }
}



function handleMailBoxError(err)
{   try
    {   logger.trace(applicationName + ':zndIMAPSync:handleMailBoxError:Started');
        logger.error(applicationName + ':zndIMAPSync:handleMailBoxError:An mailbox error occurred:', err);
        logger.trace(applicationName + ':zndIMAPSync:handleMailBoxError:Done');
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageData:handleMailBoxError:An exception occured:[' + ex + '].');
    }
}



function handleMailBoxFinalization()
{    logger.trace(applicationName + ':zndIMAPSync:handleMailBoxFinalization:Started');
     logger.debug(applicationName + ':zndIMAPSync:handleMailBoxFinalization:Connection ended');
     logger.trace(applicationName + ':zndIMAPSync:handleMailBoxFinalization:Done');
}



function openMailBox()
{   try
    {   logger.trace(applicationName + ':zndIMAPSync:openMailBox:Started');
        imap.openBox('INBOX', true, openInBoxCB);
        logger.trace(applicationName + ':zndIMAPSync:openMailBox:Done');
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageData:openMailBox:An exception occured:[' + ex + '].');
    }
}


function matchSentFileStatus(items)
{   try
	  {   logger.trace(applicationName + ':zndStatements:matchSentFileStatus:Started ');
	      if ( typeof items  !== 'undefined' && typeof items.docScan  !== 'undefined')
	      {   logger.debug(applicationName + ':zndStatements:matchSentFileStatus:Matching :['+ items.docScan +']');
	          imap.connect();
	      }
		    logger.trace(applicationName + ':zndStatements:matchSentFileStatus:Done.');
	  }
	  catch(ex)
	  {   logger.trace(applicationName + 'zndStatements:matchSentFileStatus:An exception occurred:[' + ex + ']')
	  }
}



function getLastMailItem()
{   try
    {   logger.trace(applicationName + ':zndIMAPSync:getLastMailItem:Started');
        logger.trace(applicationName + ':zndIMAPSync:getLastMailItem:returning :['+ lastMailItem +']');
        return lastMailItem;
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageData:getLastMailItem:An exception occured:[' + ex + '].');
    }

}



function setLastMailItem(itemRange)
{   try
    {   logger.trace(applicationName + ':zndIMAPSync:setLastMailItem:Started');
        lastMailItem                    = itemRange;
        logger.trace(applicationName + ':zndIMAPSync:setLastMailItem:Done');
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageData:setLastMailItem:An exception occured:[' + ex + '].');
    }
}



async function findStatement(statement)
{  try
   {   var items;
       logger.trace(applicationName + ':zndIMAPSync:findStatement:Started');
       logger.debug("Looking for :["+statement+"]");

       items                            = await zndMailedStatements.find({ headerstring : {$regex :statement } } );
       logger.debug(applicationName + ':zndIMAPSync:findStatement:Found',items);
       logger.trace(applicationName + ':zndIMAPSync:findStatement:Done');
       return(items);

   }
   catch(ex)
   {   logger.exception(applicationName + ':zndManageData:findStatement:An exception occured:[' + ex + '].');
   }
}



async function runDBUpdate()
{   try
    {   var items, imapString;

        logger.trace(applicationName + ':zndIMAPSync:runDBUpdate:Started');

        items                           = await zndMailedStatements.find().sort({mailID:1});
        imapString                      = "";
        imap                              = new Imap({
                                                     user: 'statements@zandd.eu',
                                                     password: 'P!ckwick70',
                                                     host: 'mail.gandi.net',
                                                     port: 993,
                                                     tls: true
                                                   });
        imap.once('ready', openMailBox);
        imap.once('error', handleMailBoxError);
        imap.once('end', handleMailBoxFinalization);

        if (items.length == 0)
        {   logger.debug(applicationName + ':zndIMAPSync:runDBUpdate:Database is empty populate from 1');
            setLastMailItem('1:*')
        }
        else
        {   logger.debug(applicationName + ':zndIMAPSync:runDBUpdate:Database is not empty populate from ['+items[items.length -1]+']');
            imapString                  =  ''+items[items.length -1].mailID + ':*';
            setLastMailItem(imapString)
        }
        imap.connect();
        logger.trace(applicationName + ':zndIMAPSync:runDBUpdate:Done');
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageData:runDBUpdate:An exception occured:[' + ex + '].');
    }
}

async function init()
{   try
    {   logger.trace(applicationName + ':zndIMAPSync:init:Started');
        runDBUpdate();
        logger.trace(applicationName + ':zndIMAPSync:init:Done');
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageData:init:An exception occured:[' + ex + '].');
    }
}
/* --------------------------------- End Functions   -------------------------*/

/* ----------------------------------External functions ----------------------*/
module.exports.init                     = init
module.exports.runDBUpdate              = runDBUpdate
module.exports.findStatement            = findStatement
module.exports.openMailBox              = openMailBox


/* ----------------------------------End External functions ------------------*/

/* LOG:
*/

