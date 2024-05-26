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

const {logger,applicationName}         = require( '../services/generic' );
const zndManageData                    = require( '../services/zndManageData' );
const manageBookkeepingYears           = require( '../services/manageBookkeepingYears' );
const manageCheckBooks                 = require( '../services/manageCheckBooks' );
const manageLedger                     = require( '../services/manageLedger' );

/* -------------------------------- End Services ------------------------------*/

/* ------------------------------------- Models -------------------------------*/
/* -------------------------------- End Models --------------------------------*/

/* ---------------------------------  Application constants    ----------------*/
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization --------------*/
/* ----------- End Internal Application Libraries Initialization --------------*/

/* ----------------------------- Private Functions   --------------------------*/
async function updateAllMovements ()
{   try
    {   logger.trace( applicationName + ':generic:updateAllMovements():Started' );
        const record                   =   {};
        const recordID                 =   '';
        record.action                  =   'getData';
        const timeOuttime                =   100;

        const allRecords               = ( await manageLedger.manageLedger( record , recordID ) ).body;
        allRecords.forEach( element => {   zndManageData.handleGetMovement( element._doc._id );
                                            } );

        logger.trace( applicationName + ':generic:updateAllMovements():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:updateAllMovements():An exception occurred :[' + ex + '].' );
    }
}

async function handleLaboratoryPost ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:handleLaboratoryPost():Started' );
        switch ( req.body.action )
        {   case 'updateCreationDate' :   zndManageData.updateCreationDate();
                                          break;
            case 'deleteCreationDate' :   zndManageData.deleteCreationDate();
                                          break;
            case 'updateOneMovement'  :   await zndManageData.handleGetMovement( req.body.recordID );
                                          break;
            case 'updateAllMovements' :   updateAllMovements( );
                                          break;
            default                   :   throw 'Crap Action: [' + req.body.action  + ']';
        }

        res.render( 'laboratory'  );
        logger.trace( applicationName + ':generic:handleLaboratoryPost():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:handleLaboratoryPost():An exception occurred :[' + ex + '].' );
    }
}


async function handleLaboratoryGet ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:handleLaboratoryGet():Started' );
        res.render( 'laboratory'  );
        logger.trace( applicationName + ':generic:handleLaboratoryGet():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:handleLaboratoryGet():An exception occurred :[' + ex + '].' );
    }
}


async function laboratoryHandler ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:laboratoryHandler():Started' );

        switch ( req.method )
        {   case 'POST' :   handleLaboratoryPost( req,res );
                            break;
            case 'GET'  :   handleLaboratoryGet( req,res );
                            break;
            default     :   break;
        }


        logger.trace( applicationName + ':generic:laboratoryHandler():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:laboratoryHandler():An exception occurred :[' + ex + '].' );
    }
}


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
        console.log( params );

        if ( params.recordID != null )
        {   const record               = {} ;
            record.action              = 'getRecordData';
            const recordID             = params.recordID;

            const dataRecord           = await manageBookkeepingYears.manageBookkeepingYears( record,recordID );
            console.log( dataRecord );


            record.action = 'getData';

            const dataRecords           = await manageBookkeepingYears.manageBookkeepingYears( record,recordID );


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


async function handleBookkeepingYearsPost ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:handleBookkeepingYearsPost():Started' );
        const dataRecord               = { ... req.body } ;
        console.log( 'The P:',dataRecord );
        const params                   = req.params;
        const retVal                   = await manageBookkeepingYears.manageBookkeepingYears( dataRecord,'' );
        const responseRecord           = retVal.body.createRec;
        const tempRecord               = { action : 'getData' };
        const dataRecords              = await manageBookkeepingYears.manageBookkeepingYears( tempRecord,'' );
        res.render( 'zndBookkeepingYears' , {   params:params , dataRecord : responseRecord , dataRecords: dataRecords.body} );
        logger.trace( applicationName + ':generic:handleBookkeepingYearsPost():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:handleBookkeepingYearsPost():An exception occurred :[' + ex + '].' );
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

async function handleCheckBooksPost ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:handleCheckBooksPost():Started' );

        let responseRecord           = {};
        
        

        if ( req.body.action.includes( 'newForm' ) )
        {   console.log( 'Krakatao' );
            logger.trace( applicationName + ':generic:handleCheckBooksPost():Done' );
            responseRecord            = {};
        }
        else
        {   const dataRecord          = { ... req.body } ;
            const retVal              = await manageCheckBooks.manageCheckBooks( dataRecord,'' );
            responseRecord            = retVal.body.createRec;
        }
        const tempRecord               = { action : 'getData' };
        const dataRecords              = await manageCheckBooks.manageCheckBooks( tempRecord,'' );

        res.render( 'checkBooks' , {   dataRecord : responseRecord , dataRecords: dataRecords.body} );
        logger.trace( applicationName + ':generic:handleCheckBooksPost():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:handleCheckBooksPost():An exception occurred :[' + ex + '].' );
    }
}


async function handleCheckBooksGet ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:handleCheckBooksGet():Started' );
        const tempRecord               = { action : 'getData' };
        let DR                         = {};
        
        const params                   = req.params;
        console.log( params );

        if ( params.recordID != null )
        {   const record               = {} ;
            record.action              = 'getRecordData';
            const recordID             = params.recordID;
            const dataRecord           = await manageCheckBooks.manageCheckBooks( record,recordID );
            DR                         = {   ... dataRecord.body._doc } ;
        }
        const dataRecords              = await manageCheckBooks.manageCheckBooks( tempRecord,'' );

        res.render( 'checkBooks' , {   dataRecord : DR , dataRecords: dataRecords.body} );


        logger.trace( applicationName + ':generic:handleCheckBooksGet():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:handleCheckBooksGet():An exception occurred :[' + ex + '].' );
    }
}



async function  checkBooksHandler ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:checkBooksHandler():Started' );
        switch ( req.method )
        {   case 'POST' :   handleCheckBooksPost( req,res );
                            break;
            case 'GET'  :   handleCheckBooksGet( req,res );
                            break;
            default     :   break;
        }
        logger.trace( applicationName + ':generic:checkBooksHandler():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:checkBooksHandler():An exception occurred :[' + ex + '].' );
    }
}

/* --------------------------- End Private Functions   --------------------------*/


/* --------------------------- Public Functions   ----------------------------*/
async function main ( req, res )
{   try
    {   logger.trace( applicationName + ':generic:main():Started' );

        switch ( req.originalUrl )
        {  case '/zndBookkeepingYears'                               :   bookkeepingYearsHandler( req,res );
                                                                         break;
           case  findTerm( req.originalUrl,'zndBookkeepingYears' )   :   bookkeepingYearsHandler( req,res );
                                                                         break;
           case '/checkBooks'                                        :   checkBooksHandler( req,res );
                                                                         break;
           case  findTerm( req.originalUrl,'checkBooks' )            :   checkBooksHandler( req,res );
                                                                         break;
           case '/Laboratory'                                        :   laboratoryHandler( req,res );
                                                                         break;
           default                                                   :   unknownHandler( req,res );
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
