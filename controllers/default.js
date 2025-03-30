/* File             : main.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022  
   Notes            : 
   Description      : 
*/

const {logger,applicationName}         = require( '../services/generic' );



async function main(req, res)
{   try
    {   logger.trace(applicationName + ':default:main():Started ');
        logger.debug(applicationName + ':default:main():Unknown path. Hitting main. Path is:', req.params); 
        res.render('main');
    }
    catch(ex)
    {   logger.exception(applicationName + ':default:main():An exception occurred: ['+ ex +'].')
    }
} 

module.exports.main                     = main
/* ----------------------------------End External functions ------------------*/


/* LOG:

*/

