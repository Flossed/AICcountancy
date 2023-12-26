/* File             : zndEmployeesList.js
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
/* -------------------------------- End Controllers --------------------------*/



/* ------------------------------------- Services ----------------------------*/
const Logger                            = require('../services/zndLoggerClass')
/* -------------------------------- End Services -----------------------------*/



/* ------------------------------------- Models ------------------------------*/
const zndCompanies                      = require('../models/zndCompanies')
/* -------------------------------- End Models -------------------------------*/



/* ---------------------------------  Application constants    ----------------*/
const logFileName                       = config.get('application:logFileName')
const applicationName                   = config.get('application:applicationName')
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization -------------*/
const logger                            = new Logger(logFileName)
/* ----------- End Internal Application Libraries Initialization -------------*/



/* ------------------------------------- Functions   -------------------------*/
/* --------------------------------- End Functions   -------------------------*/



/* ----------------------------------Module Initialization -------------------*/
async function main(req, res)
{   try
    {   var items;

        logger.trace(applicationName + ':zndEmployeesList:main():Started');

        items                           = {};
        
        items                           = await zndCompanies.find().sort({companyName :1});
        
        logger.trace(applicationName + ':zndEmployeesList:main():Done');
        res.render('zndCompanyList',{ items:items });
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndEmployeesList:main():An exception occurred: ['+ ex +'].')
    }
}

/* ----------------------------------End Module Initialization ---------------*/



/* ----------------------------------External functions ----------------------*/
module.exports.main                     = main
/* ----------------------------------End External functions ------------------*/


/* LOG:

*/