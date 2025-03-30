/* File             : main.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022  
   Notes            : 
   Description      : 
*/

const {logger,applicationName}         = require( '../services/generic' );


async function main(req, res)
{   try
    {   logger.trace(applicationName + ':main:main():Started ');
        res.render('main');
    }
    catch(ex)
    {   logger.exception(applicationName + ':main:main():An exception occurred: ['+ ex +'].')
    }
}

/* ----------------------------------End Module Initialization ---------------*/



/* ----------------------------------External functions ----------------------*/
module.exports.main                     = main
/* ----------------------------------End External functions ------------------*/


/* LOG:

*/

