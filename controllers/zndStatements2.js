/* File             : zndStatements2.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2023
   Notes            :
   Description      :
*/

/* ------------------     External Application Libraries      ----------------*/
/* ------------------ End External Application Libraries      ----------------*/

/* --------------- External Application Libraries Initialization -------------*/
/* ----------- End External Application Libraries Initialization -------------*/

/* ------------------     Internal Application Libraries      ----------------*/
const config                            = require( "../services/configuration" );
/* ------------------ End Internal Application Libraries      ----------------*/

/* ------------------------------------- Controllers -------------------------*/
/* -------------------------------- End Controllers --------------------------*/

/* ------------------------------------- Services ----------------------------*/
const Logger                            = require( "../services/zndLoggerClass" );
/* -------------------------------- End Services -----------------------------*/

/* ------------------------------------- Models ------------------------------*/
/* -------------------------------- End Models -------------------------------*/

/* ---------------------------------  Application constants    ----------------*/
const logFileName                       = config.get( "application:logFileName" );
const applicationName                   = config.get( "application:applicationName" );
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization -------------*/
const logger                            = new Logger( logFileName );
/* ----------- End Internal Application Libraries Initialization -------------*/

/* ------------------------------------- Functions   -------------------------*/



async function main ( req, res )
{
   try
   {
      logger.trace( applicationName + ":zndStatements:main:Started" );   
      res.render( "zndStatements2" );
      logger.trace( applicationName + ":zndStatements:main:Done" );
   }
   catch ( ex )
   {
      logger.trace( applicationName + "zndStatements:main:An exception occurred:[" + ex + "]" );
   }
}
/* --------------------------------- End Functions   -------------------------*/



/* ----------------------------------Module Initialization -------------------*/


/* ----------------------------------End Module Initialization ---------------*/



/* ----------------------------------External functions ----------------------*/
module.exports.main                     = main;
/* ----------------------------------End External functions ------------------*/


/* LOG:
*/