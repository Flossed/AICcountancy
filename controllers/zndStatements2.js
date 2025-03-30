/* File             : zndStatements.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/
const {logger,applicationName}          = require( './generic' );

const zndManageStatements               = require( "../controllers/zndManageStatements" );


const zanddLedger                       = require( "../models/zanddLedger" );
const zanddCompanies                    = require( "../models/zndCompanies" );
const zanddEmployees                    = require( "../models/zanddEmployees" );
const ledgerAccountLabels               = require( "../models/ledgerAccountCategoryName" );
const paymentCatagories                 = require( "../models/paymentCatagories" );
const zndBookKeepersLedgers             = require( "../models/zndBookKeepersLedgers" );


function getKeyValuePairFromArrayItem ( arrayOfElements, keyValueToReturn )
{
   try
   {
      var retVal,returnKey,returnVal;

      //logger.trace(applicationName + ':zndStatements:getKeyValuePairFromArrayItem:Started ');

      returnKey                       = "";
      returnVal                       = "";

      if ( typeof arrayOfElements !== "undefined" )
      {
         retVal                      = arrayOfElements.filter( ( [key, value] ) => key.includes( keyValueToReturn ) );
      } 
      //logger.trace(applicationName + ':zndStatements:getKeyValuePairFromArrayItem:Done');
      return retVal;
   }
   catch ( ex )
   {
      logger.exception( applicationName + "zndStatements:getKeyValuePairFromArrayItem: An Exception occurred:["+ex+"]." );
   }
}



function createFilteredDataDump ( objectData )
{
   try 
   {
      var keyValueArray, filteredArray, retval, arrayOfRecords; 
  
      logger.trace( applicationName + ":zndStatements:createFilteredDataDump:Started " );    
        
      keyValueArray                   = [ "amount",
         "BankReferenceNumber",
         "BICCODE",
         "categoryPurpose",
         "communicationZoneCode",
         "communicationZone",
         "communication",
         "counterpartAccountNR",
         "counterpartName",
         "customerReference",
         "entryDate",
         "ISOReasonReturnCode",
         "movementSign",
         "purpose",
         "referenceNumber",
         "RtransactionType",
         "valueDate"
      ];   
      filteredArray                   = [];     
      returnObject                    = {}; 
      arrayOfRecords                  = JSON.parse( objectData ); 
           
      for ( let i=0;i<arrayOfRecords.length;i++ )
      {
         let arrayObjectArray        = Object.entries( arrayOfRecords[i] );                   
         for ( let k=0;k<keyValueArray.length;k++ )
         {
            let returnObject        =  getKeyValuePairFromArrayItem( arrayObjectArray,keyValueArray[k] );
            if ( returnObject.length >0 )  
            {
               filteredArray.push( returnObject );
            } 
         }
         if ( !filteredArray[filteredArray.length-1].includes( "--------------------------------------" ) ) 
         {
            filteredArray.push( "--------------------------------------" );
         } 
      }         
      logger.trace( applicationName + ":zndStatements:createFilteredDataDump:Done " );       
      return filteredArray;
   }
   catch ( ex )
   {
      logger.exception( applicationName + "zndStatements:createFilteredDataDump: An Exception occurred:["+ex+"]." );         
   } 
}


function getAndSetSign ( items )
{
   try
   {
      var keyValueArray,filteredArray, retval, returnObject, arrayOfRecords;

      logger.trace( applicationName + ":zndStatements:getAndSetSign:Started " );

      keyValueArray                   = [ "amount",
         "BankReferenceNumber",
         "BICCODE",
         "categoryPurpose",
         "communicationZoneCode",
         "communicationZone",
         "communication",
         "counterpartAccountNR",
         "counterpartName",
         "customerReference",
         "entryDate",
         "ISOReasonReturnCode",
         "movementSign",
         "purpose",
         "referenceNumber",
         "RtransactionType",
         "valueDate"
      ];
      filteredArray                  = [];
      returnObject                   = {};
            
      if ( typeof objectData !== "undefined" ) 
      {
         arrayOfRecords                 = JSON.parse( objectData );

         for ( let i=0;i<arrayOfRecords.length;i++ )
         {
            let arrayObjectArray       = Object.entries( arrayOfRecords[i] );
             
            for ( let k=0;k<keyValueArray.length;k++ )
            {
               returnObject           = getKeyValuePairFromArrayItem( arrayObjectArray,keyValueArray[k] );
               if ( returnObject.length >0 )
               {
                  filteredArray.push( returnObject );
               }
            }
            if ( !filteredArray[filteredArray.length-1].includes( "--------------------------------------" ) )
            {
               filteredArray.push( "--------------------------------------" );
            }
         }
         return filteredArray;
      } 
   }
   catch ( ex )
   {
      logger.exception( applicationName + "zndStatements:getAndSetSign: An Exception occurred:["+ex+"]." );
   }
}



function getAndSetfiat ( items )
{
   try
   {
      var ledgerRecords, recordObject;

      logger.trace( applicationName + ":zndStatements:getAndSetfiat:Started " );

      ledgerRecords                   = [];
      recordObject                    = {};

      if ( typeof items.bankRecord !== "undefined" || items.bankRecord.length !== 0 ) //in case of a petit cash record
      {
         if ( items.bankRecord.length > 0 )
         {
            ledgerRecords           = JSON.parse( items.bankRecord );
            for ( let i=0;i<ledgerRecords.length;i++ )
            {
               recordObject        = ledgerRecords[i];
               if ( recordObject.recordID.includes( "1" ) )
               {
                  items.valuta    = recordObject.accountNRCC.substr( recordObject.accountNRCC.length -3 );
               }
            }
         }
      }
      logger.trace( applicationName + ":zndStatements:getAndSetfiat:Done." );
   }
   catch ( ex )
   {
      logger.trace( applicationName + "zndStatements:getAndSetfiat:An exception occurred:[" + ex + "]" );
   }
}



async function updateSentFileStatus ( items )
{
   try
   {
      logger.trace( applicationName + ":zndStatements:updateSentFileStatus:Started " );
      zndManageStatements.setRecord( items );
      let retVal                      = zndManageStatements.findRecord();
      logger.trace( applicationName + ":zndStatements:updateSentFileStatus:Done." );
   }
   catch ( ex )
   {
      logger.trace( applicationName + "zndStatements:updateSentFileStatus:An exception occurred:[" + ex + "]" );
   }
}

async function runAugments ( items )
{
   try
   {
      logger.trace( applicationName + ":zndStatements:runAugments:Started" );

      getAndSetSign( items );
      getAndSetfiat( items );
      let retVal                      = updateSentFileStatus( items );  
      logger.trace( applicationName + ":zndStatements:runAugments:Done" );
      return retVal;
   }
   catch ( ex )
   {
      logger.trace( applicationName + "zndStatements:runAugments:An exception occurred:[" + ex + "]" );
   }
}



async function main ( req, res )
{
   try
   {
      var items, ideez, bankData, employees, companies, accountLedgerNames, paymentTypesList;
      var employees, companies, accountLedgerNames, bookkeepingLedgerNames, paymentTypesList;

      logger.trace( applicationName + ":zndStatements:main:Started" );

      if ( req.params.id != null )
      {
         req.params.newform          = false;
         items                       = await zanddLedger.findById( req.params.id );
         ideez                       = await zanddLedger.find().sort( {invoiceDate :1} ).distinct( "_id" );
         bankData                    = [];
         employees                   = await zanddEmployees.find().distinct( "employeeID",{"employeeStatus":"Active" } );
         companies                   = await zanddCompanies.find().sort( {companyName :1} );
         accountLedgerNames          = await ledgerAccountLabels.find().distinct( "ledgerLabel" );
         bookkeepingLedgerNames      = await zndBookKeepersLedgers.find().distinct( "bkLedgerLabel" );
         paymentTypesList            = await paymentCatagories.find().distinct( "paymentCatagoryName" );

             
         if ( typeof items.bankRecord !== "undefined" ||  items.bankRecord.length !== 0 )
         {    
            if ( items.bankRecord.length > 0 )
            {
               bankData            = createFilteredDataDump( items.bankRecord );                            
            }
         }
         let retVal                  = await runAugments( items );
         res.render( "zndStatements2",{ items:items ,ideez:ideez,bankData:bankData, employees:employees, companies:companies, accountLedgerNames:accountLedgerNames,  bookkeepingLedgerNames:bookkeepingLedgerNames,paymentTypesList:paymentTypesList } );
      }
      else
      {
         req.params.newform         = true;
         employees                  = await zanddEmployees.find().distinct( "employeeID",{"employeeStatus":"Active" } );
         companies                  = await zanddCompanies.find().sort( {companyName :1} );
         accountLedgerNames         = await ledgerAccountLabels.find().distinct( "ledgerLabel" );
         bookkeepingLedgerNames     = await zndBookKeepersLedgers.find().distinct( "bkLedgerLabel" );
         paymentTypesList           = await paymentCatagories.find().distinct( "paymentCatagoryName" );
         res.render( "zndStatements2",{  employees:employees, companies:companies, accountLedgerNames:accountLedgerNames, bookkeepingLedgerNames:bookkeepingLedgerNames, paymentTypesList:paymentTypesList } );
      }
      logger.trace( applicationName + ":zndStatements:main:Done" );
   }
   catch ( ex )
   {
      logger.trace( applicationName + "zndStatements:main:An exception occurred:[" + ex + "]" );
   }
}

module.exports.main                     = main;
