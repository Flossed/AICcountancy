/* File             : zndEmployees.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/



const {logger,applicationName}         = require( '../services/generic' );
const zndCompanies                     = require( '../models/zndCompanies' );


async function main ( req, res )
{   try
	  {   let items, ideez;

	      logger.trace( applicationName + ':zndCompagny:main:Started' );

	      if ( req.params.id != null )
	      {   req.params.newform          = false;
			      items                       = await zndCompanies.findById( req.params.id );
			      ideez                       = await zndCompanies.find().distinct( '_id' );
			      logger.trace( applicationName + ':zndCompagny:main:Done' );
			      res.render( 'zndCompagny',{ items:items, ideez:ideez } );
		    }
		    else
		    {   req.params.newform          = true;
		        logger.trace( applicationName + ':zndCompagny:main:Done' );
		    	  res.render( 'zndCompagny' );
		    }
	  }
	  catch ( ex )
	  {   logger.exception( applicationName + ':zndEmployees:main:An exception occured:[' + ex + '].' );
	  }
}

module.exports.main                     = main;



/* LOG:
*/
