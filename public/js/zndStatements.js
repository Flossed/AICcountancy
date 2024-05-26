let path, ideez, currentID, idArray, url, toggle, displayRawBankData, newsBarState;
console.log( window );
//window.jsPDF = window.jspdf.jsPDF;
window.jsPDF = window.jspdf;
window.html2canvas = window.html2canvas;

path                                    = document.getElementById( 'pdfFile' ).textContent;
ideez                                   = document.getElementById( 'idlist' ).textContent;
currentID                               = document.getElementById( '_id' ).textContent;
let itemList;

if ( ( ideez.length > 0 ) )
{
   idArray                                 = JSON.parse( ideez );
}
else
{
   idArray                                 = [];
}
if ( path.length > 0 )
{
   url                                     = 'http://127.0.0.1:20070/docs/' + path;
}
else
{
   url                                   = '';
}
toggle                                  = document.getElementById( 'editState' ).checked;
displayRawBankData                      = 1;
newsBarState                            = true;


toggleNewsBar();

function setCompanyDetails ()
{
   let currentCompany;

   currentCompany                      = document.getElementById( 'compagnyID' ).value;

   companyList                         = JSON.parse( document.getElementById( 'companyList' ).textContent );

   for ( let i = 0;i < companyList.length;i++ )
   {
      if ( companyList[i].companyName.includes( currentCompany ) )
      {
         document.getElementById( 'VATNumber' ).textContent          = companyList[i].companyVATNumber;
         document.getElementById( 'bankAccountNumber' ).textContent  = companyList[i].companyBankAccountNumber;
      }
   }
}


function loadpage ()
{
   try
   {
      for ( let i = 0;i < idArray.length;i++ )
      {
         if ( idArray[i].includes( currentID ) )
         {
            if ( direction == -1 )
            {
               if ( i == 0 )
               {
                  window.location.href = idArray[idArray.length - 1];
               }
               else
               {
                  window.location.href = idArray[i - 1];
               }
            }
            else
            {
               if ( i == ( idArray.length - 1 ) )
               {
                  window.location.href = idArray[0];
               }
               else
               {
                  window.location.href = idArray[i + 1];
               }
            }
         }
      }
   }
   catch ( ex )
   {
      console.log( 'zndStatements:loadpage:An exception occurred:[' + ex + ']' );
   }
}



function enableForm ( state )
{
   try
   {
      let formName , elements, permanentOff;

      formName                            = 'ledgerEntryForm';
      elements                            = document.forms[formName].elements;
      permanentOff                        = ['FO', 'bankstatementID', 'billSpecification','updateRecord', 'cancel', 'FA', 'valuta', 'fiatSign', 'VATNumber','bankAccountNumber'];
      if ( state.includes( 'off' ) )
      {
         toggle                      = true;
      }
      else
      {
         if ( state.includes( 'on' ) )
         {
            toggle                    = false;
         }
         else
         {
            if ( state.includes( 'init' ) )
            {
               toggle = document.getElementById( 'editState' ).checked;
            }
            else
            {
               toggle = !toggle;
            }
         }
      }
      document.getElementById( 'editState' ).checked        = toggle;
      for ( let i = 0;i < elements.length;i++ )
      {
         if ( !permanentOff.includes( elements[i].id ) )
         {
            elements[i].readOnly = toggle;
            if ( toggle == true )
            {
               if ( elements[i].type.includes( 'button' ) )
               {
                  elements[i].style.display           = 'none';
               }
               else
               {
                  elements[i].style.backgroundColor   = '#F8F6F3';
               }
            }
            else
            {
               if ( !elements[i].type.includes( 'button' ) )
               {
                  elements[i].style.backgroundColor    = 'white';
               }
            }
         }
      }
      if ( !state.includes( 'init' ) ){  formulierActie( 'updateRecord' ); }
   }
   catch ( ex )
   {
      console.log( 'An exception Occurred[' + ex + ']' );
   }
}



function mailDocument ()
{
   formulierActie( 'mail' );
}



function sendForm ()
{   /*var txt, r;

    r                                     = confirm("This will send the PDF to the accountant, press ok to send, or cancel to abort");

    if (r == true)
    {   enableForm('off');
        document.getElementById("transferredAccountant").checked       = true;
        mailDocument()
    }*/
   mailDocument();
}


function formulierActie ( action )
{
   let  docActie;

   docActie                            = document.getElementById( 'actie' ).textContent;
   document.getElementById( 'actie' ).textContent  = action;
   document.getElementById( 'ledgerEntryForm' ).submit();
}



function filterFunction ( value )
{
   let includeDataItems;

   includeDataItems                    = ['BankReferenceNumber'];
   return includeDataItems.includes( value );
}



function showRawData ()
{
   displayRawBankData                  = ( displayRawBankData == 1 ? 0 : 1 );
   document.getElementById( 'showRawData' ).style.display = ( displayRawBankData == 1 ? 'block' : 'none' );
}



function setCreditSign ( signVal )
{
   console.log( 'Setting movementSign:[' + signVal + ']' );
   document.getElementById( 'movementSign' ).value = signVal;
}



function lockForm ()
{
   enableForm( 'off' );
   document.getElementById( 'locked' ).checked     = 'true ';
   formulierActie( 'updateRecord' );
}



function setAccntChk ()
{
   enableForm( 'off' );
   document.getElementById( 'accntchk' ).checked   = 'true';
   formulierActie( 'updateRecord' );
}



function toggleNewsBar ()
{
   try
   {
      let visibleBar, invisibleBar, Nbelement, Mainelement, NBB, PFB, BBB, docSwitch , invisibleBar2, ToggleBar;

      visibleBar                      = '18vw';
      ToggleBar                      =  '76vw';
      invisibleBar                    = '96vw';
      invisibleBar2                   = '82.9vw';


      if ( newsBarState == false )
      {
         newsBarState                = true;
      }
      else
      {
         newsBarState                = false;
      }

      if ( newsBarState == false )
      {
         Nbelement                   = document.getElementsByClassName( 'newsbar' );
         console.log( Nbelement[0].style );
         Nbelement[0].style.width    = visibleBar;
         Nbelement[0].style.padding  = '20px';

         Mainelement                 = document.getElementsByClassName( 'main' );
         Mainelement[0].style.width  = '63vw';

         NBB                         = document.getElementsByClassName( 'newsButtonBar' );
         NBB[0].style.left           = ToggleBar;

         PFB                         = document.getElementsByClassName( 'pageFlipper' );
         PFB[0].style.left           = ToggleBar;

         BBB                         = document.getElementsByClassName( 'buttonbar' );
         BBB[0].style.left           = ToggleBar;

         docSwitch                   = document.getElementsByClassName( 'showdata' );
         docSwitch[0].style.display  = 'block';
         docSwitch[0].style.visibility         = 'visible';
      }
      else
      {
         Nbelement                   = document.getElementsByClassName( 'newsbar' );
         Nbelement[0].style.width    = '0%';
         Nbelement[0].style.padding  = '0px';

         Mainelement                 = document.getElementsByClassName( 'main' );
         Mainelement[0].style.width  = '63vw';
         Mainelement[0].style.width  = invisibleBar2;

         NBB                         = document.getElementsByClassName( 'newsButtonBar' );
         NBB[0].style.left           = invisibleBar;

         PFB                         = document.getElementsByClassName( 'pageFlipper' );
         PFB[0].style.left           = invisibleBar;

         BBB                         = document.getElementsByClassName( 'buttonbar' );
         BBB[0].style.left           = invisibleBar;

         docSwitch                   = document.getElementsByClassName( 'showdata' );
         docSwitch[0].style.display  = 'none';
         docSwitch[0].style.visibility         = 'hidden';
      }
   }
   catch ( ex )
   {
      console.log( 'An exception Occurred[' + ex + ']' );
   }
}

function runFlags ( items )
{
   itemList = items;
   //console.log(items);
   if ( typeof items !== '' )
   {
      let cellID = document.getElementById( 'editStateFlag' );
      cellID.textContent = ( typeof items !== 'undefined' &&  typeof items.editState !== 'undefined' ) ? items.editState.includes( 'on' ) ? 'Locked' : 'Editable' : 'Unknown' ;
      cellID.style.backgroundColor = ( typeof items !== 'undefined' &&  typeof items.editState !== 'undefined' ) ? items.editState.includes( 'on' ) ? '#ffcccc' : '#ccffcc' : 'white';

      cellID = document.getElementById( 'sendStateFlag' );
      cellID.textContent = ( typeof items !== 'undefined' &&  typeof items.transferredAccountant !== 'undefined' ) ? items.transferredAccountant.includes( 'on' ) ?  'Sent' : 'unSent' : 'Unknown' ;
      cellID.style.backgroundColor = ( typeof items !== 'undefined' &&  typeof items.transferredAccountant !== 'undefined' ) ? items.transferredAccountant.includes( 'on' ) ?  '#ccffcc' : '#ffcccc' : 'white';

      cellID = document.getElementById( 'sendTime' );
      cellID.textContent = ( typeof items !== 'undefined' &&  typeof items.lastTransferredAccountantTime !== 'undefined' ) ? items.lastTransferredAccountantTime : 'not Sent' ;
      cellID.style.backgroundColor = ( typeof items !== 'undefined' &&  typeof items.lastTransferredAccountantTime !== 'undefined' ) ?  '#ccffcc' : '#ffcccc';

      cellID = document.getElementById( 'sendCount' );
      cellID.textContent = ( typeof items !== 'undefined' &&  typeof items.transferredAccountantCount !== 'undefined' ) ? items.transferredAccountantCount : 'unSent' ;
      cellID.style.backgroundColor = ( typeof items !== 'undefined' &&  typeof items.transferredAccountantCount !== 'undefined' ) ? items.transferredAccountantCount == 1 ?  '#ccffcc' : '#ffcccc' : 'white';
      document.getElementById( 'documentName' ).innerHTML = 'Document: [' + itemList.docScan + ']';
   }
}

function openPDF ( path )
{
   console.log( 'whooohooo',itemList.docPath );

   window.open( '/docs/' + itemList.docScan, '_blank', 'fullscreen=yes; ' );
}


function updatebkLedgerAccount ()
{  console.log( 'updatebkLedgerAccount' );
   const bookkeepingLedgerNames = JSON.parse( document.getElementById( 'bookkeepingLedgerNames' ).textContent );
   const bkLedgerAccount          =  document.getElementById( 'bkLedgerAccount' );
   bookkeepingLedgerNames.sort( function ( a, b ) { return a.bkLedgerName.localeCompare( b.bkLedgerName ); } );
   bookkeepingLedgerNames.forEach( function ( item )
   {  const option = document.createElement( 'option' );
      option.text = item.bkLedgerName;
      option.value = item._id;
      bkLedgerAccount.add( option );
      if ( typeof itemList.bkLedgerAccount !== 'undefined' )
      if ( itemList.bkLedgerAccount.includes( item._id ) )
      {   option.selected = true;
      }
   } );
}

function updatebkBookYear ()
{   const bookkeepingYears = JSON.parse( document.getElementById( 'bookkeepingYears' ).textContent );
    const bkBookYear          =  document.getElementById( 'bkBookYear' );
    bookkeepingYears.forEach( function ( item )
    {   const option = document.createElement( 'option' );
        option.text = item.bookkeepingYear;
        option.value = item._id;
        bkBookYear.add( option );
        if ( typeof itemList.bkBookYear !== 'undefined' )
        {   if ( itemList.bkBookYear.includes( item._id ) )
            {   option.selected = true;
            }
        }    
        else
        {   if ( item.bookkeepingYear.includes('--') )
            {   option.selected = true;
            }
         }
    } );
}

function updatebcStatus ()
{  console.log( 'updatebcStatus' );
   const verification                  = JSON.parse( document.getElementById( 'verification' ).textContent );
   const bcStatus                      =  document.getElementById( 'bcStatus' );
   
   verification.forEach( function ( item )
   {  /*const option = document.createElement( 'option' );
      option.text = item.bankStatementStatus;
      option.value = item._id;
      bcStatus.add( option );
      if ( typeof itemList.bcStatus !== 'undefined' )
      if ( itemList.bcStatus.includes( item._id ) )
      {   option.selected = true;
      }*/
      console.log( item );
      const option                     = document.createElement( 'option' );
      option.text                      = item.bookingType;
      option.value                     = item._id;
      bcStatus.add( option );
      if ( typeof itemList.bcStatus !== 'undefined' )
         if ( itemList.bcStatus.includes( item._id ) )
         {   option.selected = true;
         }
   } );
}

function updateFields ()
{  console.log( 'updateFields' );
   updatebkLedgerAccount();
   updatebkBookYear();

   /*if (typeof itemList.bkNotes !== 'undefined' )
   {   document.getElementById( 'bkNotes' ).value = itemList.bkNotes;
       option.text = item.bookingType;       
       option.value = item._id;
   } 
   else 
   {   document.getElementById( 'bkNotes' ).value = '1. Geen Opmerkingen'; 
   }*/

   updatebcStatus();


}
