/* File             : generic.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2024
   Description      :
   Notes            :

*/
/* ------------------     External Application Libraries      -----------------*/
/* ------------------ End External Application Libraries      -----------------*/

/* --------------- External Application Libraries Initialization --------------*/
/* ----------- End External Application Libraries Initialization --------------*/

/* ------------------------------------- Controllers --------------------------*/
/* -------------------------------- End Controllers ---------------------------*/

/* ------------------------------------- Services -----------------------------*/
const {logger,applicationName}          = require( '../services/generic' );
/* -------------------------------- End Services ------------------------------*/

/* ------------------------------------- Models -------------------------------*/
/* -------------------------------- End Models --------------------------------*/

/* ---------------------------------  Application constants    ----------------*/
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization --------------*/
/* ----------- End Internal Application Libraries Initialization --------------*/

/* ----------------------------- Private Functions   --------------------------*/
async function unknownHandler ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:unknownHandler():Started' );
        logger.error( applicationName + ':generic:unknownHandler():Unknown Path:[' + req.path + '].' );
        res.render( 'unknown' );
        logger.trace( applicationName + ':generic:unknownHandler():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:unknownHandler():An exception occurred :[' + ex + '].' );
    }
}

function findTerm ( originalString, searchString )
{   try
    {   if ( originalString.includes( searchString ) )
        {   return originalString;
        }
        return null;
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:findterm():An exception occurred :[' + ex + '].' );
        return null;

    }

}

async function handleBookkeepingYearsGet ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:handleBookkeepingYearsGet():Started' );

        const params                   = req.params;

        if ( params.recordID != null )
        {   const record               = {} ;
            record.action              = 'getRecordData';
            const recordID             = params.recordID;

            const dataRecord           = await manageFuelAspect.manageFuelAspect( record,recordID );


            record.action = 'getData';

            const dataRecords           = await manageFuelAspect.manageFuelAspect( record,recordID );

            res.render( 'zndBookkeepingYears' , {   params:params , dataRecord : dataRecord.body , dataRecords: dataRecords.body} );
        }
        else
        {   res.render( 'zndBookkeepingYears' , {   params:params } );
        }


        logger.trace( applicationName + ':generic:handleBookkeepingYearsGet():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:handleBookkeepingYearsGet():An exception occurred :[' + ex + '].' );
    }
}


async function bookkeepingYearsHandler ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:bookkeepingYearsHandler():Started' );        
        switch ( req.method )
        {   case 'POST' :   handleBookkeepingYearsPost( req,res );
                            break;
            case 'GET'  :   handleBookkeepingYearsGet( req,res );
                            break;
            default     :   break;
        }
        logger.trace( applicationName + ':generic:bookkeepingYearsHandler():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:bookkeepingYearsHandler():An exception occurred :[' + ex + '].' );
    }
}



/* --------------------------- End Private Functions   --------------------------*/


/* --------------------------- Public Functions   ----------------------------*/
async function main ( req, res )
{   try
    {   logger.trace( applicationName + ':generic:main():Started' );

        switch ( req.originalUrl )
        {  case '/zndBookkeepingYears'        :   bookkeepingYearsHandler( req,res );
                                                  break;
           default                            :   unknownHandler( req,res );
                                                  break;
        }
        logger.trace( applicationName + ':generic:main():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:main():An exception occurred: [' + ex + '].' );
    }
}
/* ----------------------------- End Public Functions   ------------------------*/

/* ----------------------------------External functions ------------------------*/
module.exports.main                     = main;
/* ----------------------------------End External functions --------------------*/
/* LOG:
*/
