/* File             : zndEmployeesList.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/
const {logger,applicationName}         = require( '../services/generic' );




const zndCompanies                      = require('../models/zndCompanies')



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

module.exports.main                     = main


/* LOG:

*/