/* File             : zndEmployees.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/

const {logger,applicationName}         = require( '../services/generic' );

const zanddEmployees                = require( '../models/zanddEmployees' );

async function main ( req, res )
{   try
	  {   logger.trace( applicationName + ':zndEmployees:main:Started' );
	      if ( req.params.id != null )
	  	  {   req.params.newform          = false;
	  	  	  const employees            = await zanddEmployees.findById( req.params.id );
	  	  	  const ideez                 = await zanddEmployees.find().distinct( '_id' );
	  	  	  logger.trace( applicationName + ':zndEmployees:main:Done' );
	  	  	  res.render( 'zndEmployees',{ employees:employees, ideez:ideez } );
	  	  }
	  	  else
	  	  {   req.params.newform          = true;
	  	      logger.trace( applicationName + ':zndEmployees:main:Done' );
	  	  	  res.render( 'zndEmployees' );
	  	  }
	  }
	  catch ( ex )
	  {   logger.exception( applicationName + ':zndEmployees:main:An exception occured:[' + ex + '].' );
	  }
}


module.exports.main                     = main;
