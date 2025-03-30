/* File             : zndLoadCodaFilesCntrl.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/
const {logger,applicationName}         = require( '../services/generic' );


async function main(req, res)
{   try
    {   logger.trace(applicationName + ':zndLoadCodaFilesCntrl:main:Started');
        logger.trace(applicationName + ':zndLoadCodaFilesCntrl:main:Done');        
        res.render('zndLoadCodaFiles',{});
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndLoadCodaFilesCntrl:main:An exception occured:[' + ex + '].')
    }
}


module.exports.main                     = main

