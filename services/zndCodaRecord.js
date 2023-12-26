/* File             : zndCodaRecord.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/

/* ------------------     External Application Libraries      ----------------*/
const winston                           = require('winston')
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
const zndMsg                            = require('../services/zndMsg');
/* -------------------------------- End Services -----------------------------*/

/* ------------------------------------- Models ------------------------------*/
const zanddLedger                       = require('../models/zanddLedger.js')
const codaRecordModel                   = require('../models/codaRecord')
/* -------------------------------- End Models -------------------------------*/

/* ---------------------------------  Application constants    ----------------*/
const logFileName                       = config.get('application:logFileName')
const applicationName                   = config.get('application:applicationName')
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization  -------------*/
const logger                            = new Logger(logFileName)
/* ----------- End Internal Application Libraries Initialization  -------------*/

/* ------------------------------------- Application Variables ----------------*/
var codaRecords, RECORDSCOUNT, transactions;
var ledgerEntryCodaRecords=[]
/* ---------------------------------End Application Variables  ----------------*/

/* ------------------------------------- Functions   --------------------------*/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



function chunk(str, size)
{    return str.match(new RegExp('.{1,' + size + '}', 'g'));
}



async function createLedgerEntry(ledgerEntryCodaRecords)
{   try
    {   var ledgerEntry, bankReferentie, zndAccountNumber, bankDate, bankTime, teken, Bedrag, mededeling, compagny, tegenrekening, bewegingsDatum, Type, valutaDatum, uitrekselnummer, transactienummer, info, adresTegenpartij, i, billSpecification;
        var Quater;

        logger.trace(applicationName + ':zndCodaRecord:createLedgerEntry:Started');

        ledgerEntry                     = {};
        bankReferentie                  = " - ";
        zndAccountNumber                = " - ";
        bankDate                        = " - ";
        bankTime                        = " - ";
        teken                           = " - ";
        Bedrag                          = " - ";
        mededeling                      = " - ";
        compagny                        = " - ";
        tegenrekening                   = " - ";
        bewegingsDatum                  = " - ";
        Type                            = " - ";
        valutaDatum                     = " - ";
        uitrekselnummer                 = " - ";
        transactienummer                = " - ";
        info                            = " - ";
        adresTegenpartij                = " - ";
        ID                              = "";
        i                               = 0;

        billSpecification               = [];


       for( i=0; i < ledgerEntryCodaRecords.length;i++)
       {    if (( typeof record.articleCode !== 'undefined' ) &&     ( typeof record.recordID !== 'undefined' ) )
            {   if( ledgerEntryCodaRecords[i].recordID.includes('1') )
                {   zndAccountNumber        = ledgerEntryCodaRecords[i].accountNRCC;
                }
                if( ledgerEntryCodaRecords[i].recordID.includes('2') &&  ledgerEntryCodaRecords[i]. articleCode.includes('1') )
                {   bankDate                = (ledgerEntryCodaRecords[i].valueDate !='' ? ledgerEntryCodaRecords[i].valueDate:' ')
                    bankTime                = (' - ');
                    teken                   = (ledgerEntryCodaRecords[i].movementSign != ''?ledgerEntryCodaRecords[i].movementSign: ' - ');
                    amount                  = (ledgerEntryCodaRecords[i].amount!= ''? ledgerEntryCodaRecords[i].amount: ' - ');
                    bankReferentie          = (ledgerEntryCodaRecords[i].transactionID!= ''? ledgerEntryCodaRecords[i].transactionID: ' - ');
                    ID                      = ledgerEntryCodaRecords[i].ID;
                }

                if( ledgerEntryCodaRecords[i].recordID.includes('2') &&  ledgerEntryCodaRecords[i]. articleCode.includes('3'))
                {   compagny                = ((ledgerEntryCodaRecords[i].counterpartName != '') || (ledgerEntryCodaRecords[i].counterpartName != undefined) ? ledgerEntryCodaRecords[i].counterpartName: ' - ');
                    tegenrekening           = ((ledgerEntryCodaRecords[i].counterpartAccountNR!= '') || (ledgerEntryCodaRecords[i].counterpartAccountNR != undefined)?ledgerEntryCodaRecords[i].counterpartAccountNR: ' - ');
                    valueDate               = (ledgerEntryCodaRecords[i].valueDate != ''?ledgerEntryCodaRecords[i].valueDate: ' - ');
                    entryDate               = (ledgerEntryCodaRecords[i].entryDate != ''?ledgerEntryCodaRecords[i].entryDate : ' - ');
                    statementSequenceNumber = (ledgerEntryCodaRecords[i].statementSequenceNumber != ''?ledgerEntryCodaRecords[i].statementSequenceNumber: ' - ');
                    BankReferenceNumber     = (ledgerEntryCodaRecords[i].BankReferenceNumber != ''?ledgerEntryCodaRecords[i].BankReferenceNumber: ' - ');
                    Communicationzone       = (ledgerEntryCodaRecords[i].Communicationzone != ''?ledgerEntryCodaRecords[i].Communicationzone: ' - ');
                    Communicationzone2      = (ledgerEntryCodaRecords[i].Communicationzone != ''?ledgerEntryCodaRecords[i].Communicationzone: ' - ');
                }
            }
            else
            {   logger.debug(applicationName + ':zndCodaRecord:createLedgerEntry:Record not pushed:', record);
            }
       }

       let chunks                      = chunk(bankDate,2);
       ledgerEntry.bankDate            = chunks[0]+'-'+chunks[1]+'-20'+chunks[2];
       ledgerEntry.invoiceDate         = ledgerEntry.bankDate;
       grossAmount                     = String((parseFloat(amount)+1)/1000).replace(".", ",");
       ledgerEntry.grossAmount         = grossAmount.substring(0, grossAmount.length - 1);
       ledgerEntry.VAT                 = '999999999999,99';
       ledgerEntry.ledgerAccount       ='--------------------------------------------';
       Quater                          = (Math.trunc(parseFloat(chunks[1])/4)+1);
       ledgerEntry.bookingPeriod       = 'Q'+String(Quater);
       ledgerEntry.proofType           = '---';
       ledgerEntry.paymentTypes        = 'BANK';
       ledgerEntry.compagnyID          = 'UNKNOWN';
       ledgerEntry.billSpecification   = String(bankDate)+String(",")+String(bankTime)+String(",")+String(compagny)+String(",")+String(tegenrekening)+String(",")+String(teken)+String(",")+String(Bedrag)+String(",")+String( mededeling)+String(",")+String( Type)+String(",")+String( bewegingsDatum )+String(",")+String(valutaDatum)+String(",")+String(uitrekselnummer)+String(",")+String(transactienummer)+String(",")+String(info)+String(",")+String(adresTegenpartij);
       ledgerEntry.billDescription     = '----';
       ledgerEntry.invoiceNumber       = '-----';
       ledgerEntry.bankAccountNumber   = tegenrekening;
       ledgerEntry.VATNumber           = 'BEnnnnnnnnnnnn';
       ledgerEntry.zndAccountNumber    = zndAccountNumber.substring(0,  zndAccountNumber.length - 21);
       ledgerEntry.beneficiary         = '------' ;
       ledgerEntry.notes               = '--------';
       ledgerEntry.docScan             = '___NO BILL.pdf';
       ledgerEntry.bankRecord          = JSON.stringify(ledgerEntryCodaRecords);
       ledgerEntry.bankstatementID     = bankReferentie;       
       logger.trace(applicationName + ':zndCodaRecord:createLedgerEntry:ledgerEntry',ledgerEntry);       
       recordCreation                  = await zndManageStatements.createRecord(ledgerEntry);
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndCodaRecord:createLedgerEntry:An exception occured:[' + ex + '].');
    }
}



async function getLedgerEntryCodaRecords(transactionID)
{   try
    {   var codaRecordsCount,ledgerEntryCodaRecords, zanddLedgerStatements;

        logger.trace(applicationName + ':zndCodaRecord:getLedgerEntryCodaRecords:Started');

        zanddLedgerStatements           = [];

        zanddLedgerStatements           = await zanddLedger.find().distinct('bankstatementID');

        if( !zanddLedgerStatements.includes(transactionID))
        {   ledgerEntryCodaRecords      = [];
            codaRecordsCount            = 0 ;
    	      for(let i=0; i < codaRecords.length;i++)
	          {   if (  codaRecords[i].transactionID.includes(transactionID))
	              {   record              = {}
	                  record              = JSON.parse(codaRecords[i].codaRecordJSON);
	                  ledgerEntryCodaRecords.push(record);
	                  codaRecordsCount++;
	              }
	          }
	          await createLedgerEntry(ledgerEntryCodaRecords)
	          logger.trace(applicationName + ':zndCodaRecord:getLedgerEntryCodaRecords:Done');
	      }
	      else
	      {   logger.debug(applicationName + ':zndCodaRecord:getLedgerEntryCodaRecords:Record:['+ transactionID +'], already stored, Skipping!');
	      }
	      logger.trace(applicationName + ':zndCodaRecord:getLedgerEntryCodaRecords:Done');
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndCodaRecord:getLedgerEntryCodaRecords:An exception occured:[' + ex + '].');
    }
}



async function storeTransactions()
{   try
    {   var  i;

        logger.trace(applicationName + ':zndCodaRecord:storeTransactions:Started');

        for(i=0; i<transactions.length;i++)
        {   await getLedgerEntryCodaRecords(transactions[i]);
        }
        logger.trace(applicationName + ':zndCodaRecord:storeTransactions:Done');
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndCodaRecord:storeTransactions:An exception occured:[' + ex + '].');
    }
}



async function manageCodaRecords()
{   try
    {   var i, record, transactionID;

        logger.trace(applicationName + ':zndCodaRecord:manageCodaRecords:Started');

        record                          = {};

        for(i=0; i < codaRecords.length;i++)
        {   record                      = JSON.parse(codaRecords[i].codaRecordJSON)
            if (( record.recordID.includes("2")) &&  ( record.articleCode.includes("1")) )
            {  transactionID = record.transactionID;
               if( !transactions.includes(transactionID))
               {   transactions.push(transactionID);
               }
            }
        }
       await storeTransactions();
       logger.trace(applicationName + ':zndCodaRecord:manageCodaRecords:Done');
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndCodaRecord:manageCodaRecords:An exception occured:[' + ex + '].');
    }
}



function createCodaRecord(codarecord)
{   try
    {   logger.trace(applicationName + ':zndCodaRecord:createCodaRecord:Started');
        codaRecords.push(codarecord)
        logger.trace(applicationName + ':zndCodaRecord:createCodaRecord:Done');
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndCodaRecord:createCodaRecord:An exception occured:[' + ex + '].');
    }
}



async function zndCodaRecordInit()
{   try
    {   logger.trace(applicationName + ':zndCodaRecord:zndCodaRecordInit:Started');
        codaRecords                     = [];
        RECORDSCOUNT                    = 0;
        transactions                    = [];
        zndMsg.eventBus.on('newCodaRecord', function NCR(eventData) { createCodaRecord(eventData);})
        zndMsg.eventBus.on('manageCodaRecords', function MCR(recordCount) { manageCodaRecords()})
        logger.trace(applicationName + ':zndCodaRecord:zndCodaRecordInit:Done');
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndCodaRecord:zndCodaRecordInit:An exception occured:[' + ex + '].');
    }
}
/* --------------------------------- End Functions   -------------------------*/

/* ----------------------------------Module Initialization -------------------*/
/* ----------------------------------End Module Initialization ---------------*/

/* ----------------------------------External functions ----------------------*/
module.exports.zndCodaRecordInit        = zndCodaRecordInit
/* ----------------------------------End External functions ------------------*/


/* LOG:
*/