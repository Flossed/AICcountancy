/* File             : zndEmailAddress.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/

const {logger,applicationName}         = require( '../services/generic' );

const emailAdresses = require('../models/emailAdresses')

async function main(req, res)
{   try
    {   var items,ideez;

        logger.trace(applicationName + ':zndEmailAddress:main:Done');

        if (req.params.id != null)
        {   req.params.newform          = false;
            items                       = await emailAdresses.findById(req.params.id)
            ideez                       = await emailAdresses.find().distinct('_id')
            res.render('zndEmailAddress',{ items:items, ideez:ideez });
        }
        else
        {   req.params.newform =true
            res.render('zndEmailAddress');
        }
        logger.trace(applicationName + ':zndEmailAddress:main:Done');
    }
    catch(ex)
    {   logger.trace(applicationName + 'zndEmailAddress:main:An exception occurred:[' + ex + ']')
    }
}

module.exports.main                     = main

/* LOG:
*/