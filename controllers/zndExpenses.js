/* File             : zndExpenses.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2021   
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
const zanddLedger                       = require('../models/zanddLedger')
const zndCompanies                      = require('../models/zndCompanies')
/* -------------------------------- End Models -------------------------------*/

/* ---------------------------------  Application constants    ----------------*/
const logFileName                       = config.get('application:logFileName')
const applicationName                   = config.get('application:applicationName')
/* --------------------------------- End Application constants ----------------*/


/* --------------- Internal Variables Initialization -------------------------*/
const logger                            = new Logger(logFileName)
/* ----------- End Internal Variables Initialization -------------------------*/



/* ------------------------------------- Functions   -------------------------*/
async function main(req, res)
{   try
    {   var items,resultSet;
      
        logger.trace(applicationName + ":zndExpenses::main:Starting")
        
        items                           = {}
        resultSet                       = {}
        
        items                           = await zanddLedger.find({ paymentTypes : "KAS"}).sort({bankDateEpoch :1})
        for (let i=0;i < items.length; i++)
        {  resultSet                    = {}
           resultSet                    = await zndCompanies.find({ companyName : items[i].compagnyID}, {companyName : 1}) 
           //items[i].compagnyName        = "DUCKKY"
          
          if(( typeof resultSet[0] !== 'undefined') &&( typeof resultSet[0].companyName !== 'undefined'))
          {  items[i].compagnyName      = resultSet[0].companyName           
          } 
          else 
          {  items[i].compagnyName      = "---"         
          }
        }
        logger.trace(applicationName + ":zndExpenses::main:Done")
        res.render('zndExpenses',{ items:items}); 	
    }
	  catch(ex)
	  {   logger.exception(applicationName + ':zndExpenses:main:An exception occured:[' + ex + '].')
	  }
}
/* --------------------------------- End Functions   -------------------------*/

/* ----------------------------------Module Initialization -------------------*/
/* ----------------------------------End Module Initialization ---------------*/

/* ----------------------------------External functions ----------------------*/
module.exports.main                     = main
/* ----------------------------------End External functions ------------------*/


/* LOG:
*/