//67e7996c992743359c3010a5

const documentFormName                 = 'checkBooks';

const tableMap                         = {   'ID'                   :   '_id' ,
                                             'Invoice Date'         :   'invoiceDate',
                                             'Amount'               :   'grossAmount',
                                             'VAT'                  :   'VAT',
                                             'Compagny'             :   'compagnyID',
                                             'Invoice Number'       :   'invoiceNumber',
                                             'Catagory'             :   'ledgerAccount',
                                             'Description'          :   'billDescription',
                                             'Document'             :   'docScan',
                                         };





function selectID ( )
{   const recorIDToSelect              =   document.getElementById( 'recorIDToSelect' ).value;    
    if ( recorIDToSelect.length == 24 )
    {   const recordIDForm             =   document.getElementById( 'selectAnID' );        
        recordIDForm.submit();
    }
}



function fillTable ()
{
   const originalRecordID        =   document.getElementById( 'originalRecordID' ).value;
   if ( originalRecordID.length == 24 )
   {   document.getElementById( 'recorIDToSelect' ).value = originalRecordID;
       const historicalRecords         =   document.getElementById( 'dataRecords' ).value;
       const historicalRecordsArray = JSON.parse( historicalRecords );

       document.getElementById( 'nrHistoricalRecordsFound' ).innerHTML = 'Number of records found for [' + originalRecordID + '] is: [' + historicalRecordsArray.length + ']';
       if ( historicalRecordsArray.length > 0 )
       {   historicalRecordsArray.sort( ( a, b ) => ( historicalRecordsArray.recordTime > b.recordTime ) ? 1 : ( ( b.recordTime > a.recordTime ) ? -1 : 0 ) );           
       }
   }
}

function fillRecord ()
{   const dataRecord                   =   document.getElementById( 'dataRecord' ).value;
    const dataRecords                  =   document.getElementById( 'dataRecords' ).value;
    const dataRecordsObj               =   JSON.parse( dataRecords );

    if (dataRecord.length > 0 )
    {   const dataRecordObj           =   JSON.parse( dataRecord );
        const elements                     = document.forms[documentFormName].elements;
        for ( let i = 0;i < elements.length;i++ )
        {   const elementID            =   elements[i].id;
            const elementValue         =   dataRecordObj[elementID];
            switch (elementID) 
            {   case '_id'      :   elements[i].value = dataRecordObj['originalRecordID'];
                                    break;
                case '__v'      :   elements[i].value = dataRecordsObj.length;
                                    break;
                case 'action'   :   elements[i].value = 'updateData';
                                    break;   
                default         :   elements[i].value = elementValue;
                                    break;
            }
        }
    }
}



function fillForm ()
{   fillTable();
    fillRecord();
}


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
                const rowReference      = '/restoreHistRecord/' + content;
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



function init ()
{   fillForm();
    const dataRecords                  =   JSON.parse( document.getElementById( 'dataRecords' ).textContent );
    initTable( dataRecords, 'tableOfValues' );
}

function formulierActie(action)
{   const form                     = document.forms[documentFormName];
    form.submit();
}