/* File             : index.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Description      : Main file for ZANDDBOOKS
   Notes            :
*/



/* ------------------     External Application Libraries      ----------------*/
const winston                          = require( 'winston' );
const mongoose                         = require( 'mongoose' );
const express                          = require( 'express' );
const ejs                              = require( 'ejs' );
const bodyParser                       = require( 'body-parser' );
const fileUpload                       = require( 'express-fileupload' );
const { exec }                         = require( 'child_process' );
const favicon                          = require( 'serve-favicon' );
const path                             = require( 'path' );
const cors                             = require( 'cors' );

/* ------------------ End External Application Libraries      ----------------*/

/* ------------------     Internal Application Libraries      ----------------*/
const Logger                           = require( './services/zndLoggerClass' );
const config                           = require( './services/configuration' );
const zndCodaRecordService             = require( './services/zndCodaRecord' );
const zndManageDataService             = require( './services/zndManageData' );
const zndIMAPSync                      = require( './services/zndIMAPSync' );
/* ------------------ End Internal Application Libraries      ----------------*/


/* --------------- External Application Libraries Initialization -------------*/
const db                               = mongoose.connection;
const app                              = express();
const http                             = require( 'http' ).Server( app );


app.set( 'view engine','ejs' );
mongoose.connect( config.get( 'application:DB' ), {useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true} );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {extended:true} ) );
app.use( express.static( 'public' ) );
app.use( fileUpload() );
app.use( favicon( path.join( __dirname, 'public\\img', 'zandd.ico' ) ) );
app.use( cors() );

app.use( function ( req, res, next ) {
  res.header( 'Access-Control-Allow-Origin', '*' );
  res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
  next();
} );

/* ----------- End External Application Libraries Initialization -------------*/

/* ------------------------------------- Cntrls -------------------------*/
const mainCntrl                         = require( './controllers/main' );
const defaultCntrl                      = require( './controllers/default' );
const zndLedgerCntrl                    = require( './controllers/zndLedger' );
const zndStatementsCntrl                = require( './controllers/zndStatements' );
const zndStatements2Cntrl               = require( './controllers/zndStatements2' );

const zndMngStatementsCntrl             = require( './controllers/zndManageStatements' );
const zndEmployeesCntrl                 = require( './controllers/zndEmployees' );
const zndMngEmployeesCntrl              = require( './controllers/zndManageEmployees' );
const zndEmployeesListCntrl             = require( './controllers/zndEmployeesList' );
const zndcompagnyListCntrl              = require( './controllers/zndcompagnyList' );
const zndCompagnyCntrl                  = require( './controllers/zndCompagny' );
const zndMngCompagnyCntrl               = require( './controllers/zndManageCompagny' );
const zndExpensesCntrl                  = require( './controllers/zndExpenses' );
const zndExpenses2Cntrl                  = require( './controllers/zndExpenses2' );

const zndLedgerAccountCategoriesCntrl   = require( './controllers/zndLedgerAccountCategories' );
const zndLedgerAccountCategoryCntrl     = require( './controllers/zndLedgerAccountCategory' );
const zndMngledgerAccountCategoryCntrl  = require( './controllers/zndMngledgerAccountCategory' );
const zndBookKeepersLedgersCntrl        = require( './controllers/zndBookKeepersLedgers' );
const zndBookKeepersLedgerCntrl         = require( './controllers/zndBookKeepersLedger' );
const zndMngBookKeepersLedgerCntrl      = require( './controllers/zndMngBookKeepersLedger' );
const zndPaymentCategoriesCntrl         = require( './controllers/zndPaymentCategories' );
const zndPaymentCategoryCntrl           = require( './controllers/zndPaymentCategory' );
const zndMngPaymentCategoriesCntrl      = require( './controllers/zndMngPaymentCategories' );
const zndEmailAddressesCntrl            = require( './controllers/zndEmailAddresses' );
const zndEmailAddressCntrl              = require( './controllers/zndEmailAddress' );
const zndMngEmailAddressCntrl           = require( './controllers/zndMngEmailAddress' );
const zndSentStatementsCntrl            = require( './controllers/zndSentStatements' );
const zndLoadCodaFilesCntrl             = require( './controllers/zndLoadCodaFiles' );
const zndMngCodaFilesCntrl              = require( './controllers/zndMngCodaFiles' );
const zndDashboardCntrl                 = require( './controllers/zndDashboard' );
const zndPrintStatementCntrl            = require( './controllers/zndPrintStatement' );
const genericCntrl                      = require( './controllers/generic' );


/* -------------------------------- End Cntrls --------------------------*/

/* ------------------------------------- Services    -------------------------*/
/* -------------------------------- End Services    --------------------------*/

/* --------------- Internal Variables Initialization -------------------------*/
/* ----------- End Internal Variables Initialization -------------------------*/

/* ------------------------------------- Application constants ----------------*/
const ApplicationPort                   = config.get( 'application:ServiceEndPointPort' );
const progStart                         = config.get( 'application:progStart' );
const outputToBrowser                   = config.get( 'application:outputToBrowser' );
const logFileName                       = config.get( 'application:logFileName' );
const applicationName                   = config.get( 'application:applicationName' );
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization -------------*/
const logger                            = new Logger( logFileName );
/* ----------- End Internal Application Libraries Initialization -------------*/

/* ------------------------------------- Functions   -------------------------*/
function setRouting ()
{   try
     {   logger.trace( applicationName + ':index:setRouting:Started ' );

         app.get( '/',mainCntrl.main );
         app.get( '/zndLedger',zndLedgerCntrl.main );
         app.get( '/zndStatements',zndStatementsCntrl.main );
         app.get( '/zndStatements/:id',zndStatementsCntrl.main );
         app.post( '/zndMngStatements',zndMngStatementsCntrl.main );
         app.post( '/zndMngStatements/:id',zndMngStatementsCntrl.main );

          app.get( '/zndStatements2',zndStatements2Cntrl.main );

         app.get( '/zndEmployees',zndEmployeesCntrl.main );
         app.get( '/zndEmployees/:id',zndEmployeesCntrl.main );
         app.get( '/employeesList',zndEmployeesListCntrl.main );
         app.post( '/zndMngEmployees',zndMngEmployeesCntrl.main );
        app.post( '/zndMngEmployees/:id',zndMngEmployeesCntrl.main );

        app.get( '/zndCompagny',zndCompagnyCntrl.main );
        app.get( '/zndCompagny/:id',zndCompagnyCntrl.main );
        app.get( '/compagnyList',zndcompagnyListCntrl.main );
        app.post( '/zndMngCompagny',zndMngCompagnyCntrl.main );
        app.post( '/zndMngCompagny/:id',zndMngCompagnyCntrl.main );

        app.get( '/Expenses',zndExpenses2Cntrl.main );

        app.get( '/zndLedgerAccountCatagories',zndLedgerAccountCategoriesCntrl.main );
        app.get( '/zndLedgerAccountCategory',zndLedgerAccountCategoryCntrl.main );
        app.get( '/zndLedgerAccountCategory/:id',zndLedgerAccountCategoryCntrl.main );
        app.post( '/zndMngLedgerAccountCategory',zndMngledgerAccountCategoryCntrl.main );


        app.get( '/zndBookKeepersLedgers',zndBookKeepersLedgersCntrl.main );
        app.get( '/zndBookKeepersLedger',zndBookKeepersLedgerCntrl.main );
        app.get( '/zndBookKeepersLedger/:id',zndBookKeepersLedgerCntrl.main );
        app.post( '/zndMngBookKeepersLedger',zndMngBookKeepersLedgerCntrl.main );


        app.get( '/zndPaymentCategories',zndPaymentCategoriesCntrl.main );
        app.get( '/zndPaymentCategory',zndPaymentCategoryCntrl.main );
        app.get( '/zndPaymentCategory/:id',zndPaymentCategoryCntrl.main );
        app.post( '/zndMngPaymentCategories',zndMngPaymentCategoriesCntrl.main );

        app.get( '/zndEmailAddresses',zndEmailAddressesCntrl.main );
        app.get( '/zndEmailAddress',zndEmailAddressCntrl.main );
        app.get( '/zndEmailAddress/:id',zndEmailAddressCntrl.main );
        app.post( '/zndMngEmailAddress',zndMngEmailAddressCntrl.main );

        app.get( '/zndSentStatements',zndSentStatementsCntrl.main );

        app.get( '/zndLoadCodaFiles',zndLoadCodaFilesCntrl.main );
        app.post( '/zndMngCodaFiles',zndMngCodaFilesCntrl.main );

        app.get( '/zndDashboard',zndDashboardCntrl.main );

        app.get( '/zndPrintStatement/:id',zndPrintStatementCntrl.main );

        
        app.get( '/zndBookkeepingYears/:recordID',genericCntrl.main );
        app.get( '/checkbooks/:recordID',genericCntrl.main );
        app.get( '/restoreLedgerEntry/:recordID',genericCntrl.main );
        
        app.use( '*', genericCntrl.main );
       logger.trace( applicationName + ':index:setRouting:Done ' );
     }
     catch ( ex )
     {   logger.exception( applicationName + ':index:setRouting:An exception Occured:[' + ex + ']' );
     }
}



function browserOutput ()
{   try
    {   logger.trace( applicationName + ':index:browserOutput:Started ' );

        if ( outputToBrowser.includes( 'yes' ) )
        {   exec( progStart, ( error, stdout, stderr ) =>
            {   if ( error )
                {   logger.error( `error: ${error.message}` );
                    return;
                }
                if ( stderr )
                {   logger.error( `stderr: ${stderr}` );
                    return;
                }
                logger.debug( `stdout: ${stdout}` );
            } );
        }
        logger.trace( applicationName + ':index:browserOutput:Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':index:browserOutput:An exception Occured:[' + ex + ']' );
    }
}



function initializeServices ()
{   try
     {   let timeStamp, msg;

        logger.trace( applicationName + ':index:initializeServices: Starting' );

        timeStamp                       = new Date();
        msg                             = 'The time is now : ';

         logger.info( '********************************************************************************' );
         logger.info( '*                    Starting ' + applicationName + '                                         *' );
         logger.info( '*                    Time: ' + timeStamp.toLocaleTimeString( 'de-DE' ) + '                                            *' );
         logger.info( '*                    Date: ' + timeStamp.toLocaleDateString( 'de-DE' ) + '                                           *' );
         logger.info( '*                    App listening on port [' + ApplicationPort + ']                             *' );
         logger.info( '********************************************************************************' );

         db.on( 'error', console.error.bind( console, 'connection error: ' ) );
        db.once( 'open', function () { logger.info( 'Connected successfully' ); } );

        zndManageDataService.init();
         zndCodaRecordService.zndCodaRecordInit();
         zndIMAPSync.init();
         browserOutput();
        logger.trace( applicationName + ':index:initializeServices: Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':index:initializeServices:An exception occured:[' + ex + ']' );
    }
}



function main ()
{   try
     {   logger.trace( applicationName + ':index:main:Starting' );
         setRouting();
        initializeServices();
        logger.trace( applicationName + ':index:main:Done' );
     }
     catch ( ex )
     {   logger.exception( applicationName + 'index:main:An exception Occurred:[' + ex + ']' );
     }
}
/* --------------------------------- End Functions   -------------------------*/


module.exports = app.listen( ApplicationPort );
main();
/* LOG:
*/
