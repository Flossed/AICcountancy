const idArray                          = [];
const documentFormName                 = 'checkBooks';
const permanentOff                     = ['CancelButton','restoreButton'];

const tableMap                         = {   'ID'                   :'_id' ,
                                             'Invoice Date'         :'invoiceDate',
                                             'PaymentTypes'         :'paymentTypes',
                                             'Amount'               :'grossAmount',
                                             'Compagny'             :'compagnyID',
                                             'Document'             :'docScan',
                                             'Description'          :'billDescription'
                                         };

function populateTable ( table, dataRows, map )
{   try
    {   let  counter = 0;

        for ( const element of dataRows )
        {   const row                   = table.insertRow();
            for ( const matrixElement in map )
            {   const key               = map[matrixElement];
                const cell              = row.insertCell();
                const content           = element[key];

                const textNode          = document.createTextNode( content );
                const aElement          = document.createElement( 'a' );
                const rowReference      = '/restoreLedgerEntry/' + content;
                aElement.setAttribute( 'href',rowReference );
                /*aElement.setAttribute( 'target','_blank' );*/
                cell.setAttribute( 'style', 'padding-left:10px;padding-right:10px;' );
                switch ( key )
                {   case '_id'              :   {   const text            =  document.createTextNode( counter++ );
                                                    aElement.appendChild( text );
                                                    cell.appendChild( aElement );
                                                }
                                                break;
                    default                 :   cell.appendChild( textNode );
                                                break;
                }
                cell.style.maxWidth = '200px';
            }
        }
    }
    catch ( ex )
    {   console.log( ':populateTable: An exception occurred:[' + ex + '].' );
    }
}



function sortRows ( sortID,sortMap, rows )
{   try
    {   const getTableHeader = ( header ) => sortMap[header] || 'UKNOWN';
        if ( sortID.includes( 'UP' ) )
        {   sortArray( rows, { by: getTableHeader( sortID.split( 'UP' )[0] ), order: 'desc' } );
        }
        if ( sortID.includes( 'DOWN' ) )
        {   sortArray( rows, { by: getTableHeader( sortID.split( 'DOWN' )[0] ), order: 'asc' } );
        }
        return rows;
   }
   catch ( ex )
   {   console.log( 'zndDashboard:sortRows: An exception occurred:[' + ex + '].' );
   }
}



function sortColumn ( kolm, tableName, map, rows )
{   try
    {   sortRows( kolm,map, rows );
        createTable( tableName, rows, map );
    }
    catch ( ex )
    {   console.log( 'zndDashboard:sortColumn: An exception occurred:[' + ex + '].' );
    }
}



function clearTable ( Table )
{   try
    {   while ( Table.firstChild )
        {   Table.removeChild( Table.firstChild );
        }
   }
   catch ( ex )
   {   console.log( 'clearTable: An exception occurred:[' + ex + '].' );
   }
}



function addAnchorElement ( cell, element, tableName, map, rows,directionText, directionChar )
{   const anchorElement                = document.createElement( 'a' );
    const temp                         = document.createTextNode( directionChar );
    const param                        = 'javascript:sortColumn(\'' + element + directionText + JSON.stringify( tableName ) + ',' + JSON.stringify( map ) + ',' + JSON.stringify( rows ) + ');';
    anchorElement.setAttribute( 'href', param  );
    anchorElement.style.textDecoration = 'none';
    anchorElement.appendChild( temp );
    cell.appendChild( anchorElement );
}



function createTableHeader ( Table, map, tableName, rows )
{   try
    {   const header                   = Table.createTHead();
        const row                      = header.insertRow( 0 );
        const tableHeader              = Object.keys( map );
        const upText                   = 'UP\',';
        const downText                 = 'DOWN\',';
        const upChar                   = '\u25B4';
        const downChar                 = '\u25BE';

        tableHeader.reverse().forEach( function ( element )
        {   const cell                 = row.insertCell( 0 );
            const textNodeElement      = document.createTextNode( element );
            cell.appendChild( textNodeElement );
            addAnchorElement ( cell, element, tableName, map, rows,upText, upChar );
            addAnchorElement ( cell, element, tableName, map, rows,downText, downChar );
            cell.style.backgroundColor  = '#a9becc';
            cell.style.fontWeight       = 'bold';
        } );
   }
   catch ( ex )
   {   console.log( 'zndDashboard:clearTable: An exception occurred:[' + ex + '].' );
   }
}



function createTable ( location, data, map )
{   const tableLocation                = document.getElementById( location );
    const tableElement                 = document.createElement( 'TABLE' );
    clearTable( tableLocation );
    createTableHeader( tableElement, map, location, data );
    populateTable( tableElement, data, map );
    tableLocation.appendChild( tableElement );
}



function initTable ( tableData, tableReference )
{   createTable( tableReference, tableData, tableMap );


}

/* End Table functionality */

function loadpage ( direction )
{   let i = 0;
    const currentID = JSON.parse( document.getElementById( 'pageDataElements' ).textContent )._id;
    console.log( 'currentID :' + currentID );

    for ( i = 0;i < idArray.length;i++ )
    {   if ( idArray[i].includes( currentID ) )
        {   if ( direction == -1 )
            {   if ( i == 0 )
                {   window.location.href = idArray[idArray.length - 1];
                }
                else
                {   window.location.href = idArray[i - 1];
                }
            }
            else
            {   if ( i == ( idArray.length - 1 ) )
                {   window.location.href = idArray[0];
                }
                else
                {   window.location.href = idArray[i + 1];
                }
            }
        }
    }
}


function enableForm ( state )
{   console.log( 'enableForm :' + state );
    const editState                    = document.getElementById( 'editState' );
    const elements                     = document.forms[documentFormName].elements;


    switch ( state )
    {   case 'init'     :   editState.value   = ( typeof dataRecord.editState == 'undefined' ? 'on' : dataRecord.editState );
                            break;
        case 'on'       :   editState.value   = 'on';
                            break;
        case 'off'      :   editState.value   = 'off';
                            break;
        case 'toggle'   :   editState.value   = editState.value.includes( 'on' ) ? 'off' : 'on';
                            break;
        default         :   console.log( 'wierdness' );
                            break;
    }

    for ( let i = 0;i < elements.length;i++ )
    {   if ( !permanentOff.includes( elements[i].id ) )
        {   if ( !editState.value.includes( 'on' ) )
            {   elements[i].readOnly    = true;
                if ( elements[i].type.includes( 'buttonnb ' ) )
                {   elements[i].style.display = 'none';
                }
                else
                {   elements[i].style.backgroundColor   = '#F8F6F3';
                }
            }
            else
            {   elements[i].readOnly    = false;
                if ( !elements[i].type.includes( 'button' ) )
                {   elements[i].style.backgroundColor   = 'white';
                }
            }
        }
    }
/*
    if ( !state.includes( 'init' ) )
    {  formulierActie( 'updateData' );
    }*/
    console.log( 'editState :' +  editState.value );
}


function formulierActie ( action )
{   console.log( 'action is: ',action   );
    document.getElementById( 'action' ).value       = action;
    console.log( document.getElementById( 'action' ).value );
    document.getElementById( documentFormName ).submit();
}


function togglePageElements ()
{   const pageFlipperID                = document.getElementById( 'pageFlipperID' );


    const FA                           = document.getElementById( 'restoreButton' );

    const formState                    = document.getElementById( 'formState' );
    const editState                    = document.getElementById( 'editState' );

    if ( typeof dataRecord !== 'undefined' && typeof dataRecord.editState !== 'undefined' )
    {   formState.textContent          = dataRecord.editState.includes( 'on' ) ? '' : ' NOT ';
        formState.style.color          = dataRecord.editState.includes( 'on' ) ? '' : 'red';
        editState.value                = dataRecord.editState;
    }
    else
    {   formState.textContent          = '';
        editState.value                = 'on';
    }

    if ( typeof dataRecord !== 'undefined' && typeof dataRecord._id !== 'undefined' )
    {   pageFlipperID.style.display    = '';
        FA.style.display               = '';

    }
    else
    {   pageFlipperID.style.display    = 'none';
        FA.style.display               = '';

    }
}

function  toggleCreditSign ( signToSet )
{   const creditSign                   = document.getElementById( 'creditSign' );
    const debitSign                    = document.getElementById( 'debitSign' );

    switch ( signToSet )
    {   case 'CREDIT'   :   creditSign.checked              = true; debitSign.checked = false; break;
        case 'DEBIT'    :   creditSign.checked              = false; debitSign.checked = true; break;
        default         :   console.log( 'asdasdasd' ); break;
    }
}


function manageMovementSign ( dataObject )
{   console.log( 'manageMovementSign: ',dataObject );
    console.log( 'PaymentType: ', dataObject.paymentTypes );
    console.log( 'manageMovementSign: ',typeof dataObject.movementSign );
    console.log( 'manageMovementSign: ',dataObject.movementSign );
    if ( dataObject.paymentTypes.includes( 'KAS' ) )
    {   toggleCreditSign( 'DEBIT' );
    }
    else
    {   toggleCreditSign( dataObject.movementSign.includes( '1' ) ? 'DEBIT' : toggleCreditSign( dataObject.movementSign.includes( '0' ) ? 'CREDIT' : '' ) );
    }
}

const valutaElementArray               = ['grossAmount', 'VAT'];
const options                         =  { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'EUR'};

function fillForm ()
{   const pageDataElements             = JSON.parse( document.getElementById( 'pageDataElements' ).textContent ) ;
    const elements                     = document.forms[documentFormName].elements;
    pageDataElements.editState         = 'on';

    for ( let i = 0;i < elements.length;i++ )
    {   if ( typeof pageDataElements[elements[i].id] !== 'undefined' )
        {   elements[i].value          = pageDataElements[elements[i].id];
            if ( elements[i].id.includes( 'movementSign' ) )
            {   manageMovementSign( pageDataElements );
            }
            if ( valutaElementArray.includes( elements[i].id ) )
            {   elements[i].value          = Number( pageDataElements[elements[i].id].replace( '.','' ).replace( ',', '.' ) ).toLocaleString( 'nl-NL',options );
            }
        }
    }
}

function clearForm ()
{   const elements                     = document.forms[documentFormName].elements;

    for ( let i = 0;i < elements.length;i++ )
    {   elements[i].value          = '';
    }
}


const dataRecord                         = JSON.parse( document.getElementById( 'pageDataElements' ).textContent );

function init ()
{   dataRecord.editState               = 'on';
    enableForm( 'init' );
    enableForm( 'off' );
    fillForm();
    togglePageElements();
    const dataRecords = JSON.parse( document.getElementById( 'dataRecords' ).textContent );

    dataRecords.forEach( function ( record )
    {   idArray.push( record._id );
    } );

    initTable( dataRecords, 'tableOfValues' );
}

window.onload = init;


