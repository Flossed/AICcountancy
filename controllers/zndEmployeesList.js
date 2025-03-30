/* File             : zndEmployeesList.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/
const {logger,applicationName}         = require( '../services/generic' );

const zanddEmployees                = require( "../models/zanddEmployees" );


async function main ( req, res )
{
   try
   {
      var items;

      logger.trace( applicationName + ":zndEmployeesList:main():Started" );

      items                           = {};
        
      items                           = await zanddEmployees.find();
        
      logger.trace( applicationName + ":zndEmployeesList:main():Done" );
      res.render( "zndEmployeesList",{ items:items } );
   }
   catch ( ex )
   {
      logger.exception( applicationName + ":zndEmployeesList:main():An exception occurred: ["+ ex +"]." );
   }
}


module.exports.main                     = main;