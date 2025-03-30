/* File             : zndSentStatements.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/

const {logger,applicationName}         = require( '../services/generic' );

const zanddLedgerHist                   = require('../models/zanddLedgerHist')


async function main(req, res)
{   try
    {   var sendStatementList, elementList, allRecords, idList, i;

        logger.trace(applicationName + ':zndSentStatements:main:Started');

        elementList                     = [];
        allRecords                      = [];
        idList                          = [];


        allRecords                      = await zanddLedgerHist.find({recordTime : { $gt:1628459999000}}).sort({recordTime: -1}).select(' originalRecordID recordTime -_id');

        for(i=0; i < allRecords.length; i++)
        {   if ( ! idList.includes(allRecords[i].originalRecordID) )
            {   idList.push(allRecords[i].originalRecordID)
                elementList.push(allRecords[i])
            }
        }
        sendStatementList               = JSON.stringify(elementList)

        logger.trace(applicationName + ':zndSentStatements:main:Done');
        res.render('zndSentStaments', { sendStatementList:sendStatementList });
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndSentStatements:main:An exception occured:[' + ex + '].')
    }
}


module.exports.main                     = main