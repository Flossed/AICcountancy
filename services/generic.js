/* File                                : generic.js
   Author                              : Daniel S. A. Khan
   Copywrite                           : Daniel S. A. Khan (c) 2024
   Description                         :
   Notes                               :

*/
/* ------------------     External Application Libraries      -----------------*/
/* ------------------ End External Application Libraries      -----------------*/

/* --------------- External Application Libraries Initialization --------------*/
/* ----------- End External Application Libraries Initialization --------------*/

/* ------------------------------------- Controllers --------------------------*/
/* -------------------------------- End Controllers ---------------------------*/

/* ------------------------------------- Services -----------------------------*/
const config                           = require( '../services/configuration' );
const Logger                           = require( '../services/loggerClass' );
/* -------------------------------- End Services ------------------------------*/

/* ------------------------------------- Models -------------------------------*/
/* -------------------------------- End Models --------------------------------*/

/* ---------------------------------  Application constants    ----------------*/
const logFileName                      = config.get( 'application:logFileName' );
const applicationName                  = config.get('application:applicationName');
const ApplicationPort                  = config.get( 'application:ServiceEndPointPort' );
const progStart                        = config.get( 'application:progStart' );
const outputToBrowser                  = config.get( 'application:outputToBrowser' );
const logTracelevel                    = config.get( 'application:logTracelevel' );
const consoleOutput                    = config.get( 'application:consoleOutput' );
const logPath                          = config.get( 'application:logPath' );
const dbName                           = config.get( 'application:dbName' ); 
const headless                          = config.get('application:headless');
const statementTemplate                 = config.get('application:statementTemplate'); 
const outputDir                         = config.get('application:outputDir'); 
const wordPath                          = config.get('application:wordPath'); 
const WordOptions                       = config.get('application:WordOptions'); 
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization --------------*/
const logger                           = new Logger( logFileName );
/* ----------- End Internal Application Libraries Initialization --------------*/

/* ----------------------------- Private Functions   ------------------------*/
/* ------------------------ End Private Functions   -------------------------*/
/* --------------------------- Public Functions   ---------------------------*/
/* ----------------------------- End Public Functions   ---------------------*/
/* ----------------------------------External functions ---------------------*/
module.exports.logger                  = logger;
module.exports.applicationName         = applicationName;
module.exports.ApplicationPort         = ApplicationPort;
module.exports.outputToBrowser         = outputToBrowser;
module.exports.logTracelevel           = logTracelevel;
module.exports.consoleOutput           = consoleOutput;
module.exports.logPath                 = logPath;
module.exports.dbName                  = dbName;
module.exports.progStart               = progStart;
module.exports.headless                = headless;
module.exports.statementTemplate       = statementTemplate;
module.exports.outputDir               = outputDir;
module.exports.wordPath                = wordPath;
module.exports.WordOptions             = WordOptions;
/* ----------------------------------End External functions -----------------*/
/* LOG:
*/
