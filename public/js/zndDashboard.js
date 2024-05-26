let tableData, rowList, oRowList;
let bookkeepingLedgerNames;
let bookkeepingYears;

const statementMap                      = {   'NR'                   :'ID' ,
                                              'Doc'                  :'DOC',
                                              'creation Date'        :'creationDate',
                                              'creation DateStr'     :'creationDateString',
                                              //'UploadTime'           :'DONE',
                                              //'UploadCount'          :'UPL',
                                              'ACCOK'                :'ACCOK',
                                              'TRANSREF'             :'TRNREF',
                                              'CRED/DEB'             :'CREDEB',
                                              'Bankdate'             :'bankDate',
                                              'Invoice Date'         :'invoiceDate',
                                              'Gross Amount'         :'grossAmount',
                                              'Vat'                  :'VAT',
                                              //'Booked VAT'           :'bookedVAT',
                                              //'Booked Period'        :'bookingPeriod',
                                              'Type of Proof'        :'proofType',
                                              'Type payment'         :'paymentTypes',
                                              'Declarant'            :'beneficiary',
                                              'Grootboekrekening'    :'ledgerAccount',
                                              'Company'              :'compagnyID',
                                              'Invoice Number'       :'invoiceNumber',
                                              'Bill Description'     :'billDescription',
                                              'Document Name'        :'documentName',
                                              'Bookkeeping Ledger'   :'bkLedgerAccount',
                                              'acountant Reference'  :'acountantReference',
                                              'bkBookYear'           :'bkBookYear'
                                           };


const overviewMap                       = {   'Grootboekrekening'   : 'ledgerAccount',
   'Bedrijf'              : 'compagnyID',
   'Netto Inkomsten'      : 'nettoInkomsten',
   'Netto Uitgaven'       : 'nettoUitgaven',
   'Netto Resultaat'      : 'nettoResultaat',
   'BTW Inkomsten'        : 'btwInkomsten',
   'BTW uitgaven'         : 'btwUitgaven',
   'BTW Resultaat'        : 'btwResultaat',
   'Bruto Inkomsten'      : 'inkomsten',
   'Bruto Uitgaven'       : 'uitgaven',
   'Bruto Resultaat'      : 'resultaat'

};

const  ledgerMap                        = {   'Grootboekrekening'    : 'ledgerAccount' ,
                                              'Netto Inkomsten'      : 'nettoInkomsten',
                                              'Netto Uitgaven'       : 'nettoUitgaven',
                                              'Netto Resultaat'      : 'nettoResultaat',
                                              'BTW Inkomsten'        : 'btwInkomsten',
                                              'BTW uitgaven'         : 'btwUitgaven',
                                              'BTW Resultaat'        : 'btwResultaat',
                                              'Bruto Inkomsten'      : 'inkomsten' ,
                                              'Bruto Uitgaven'       : 'uitgaven' ,
                                              'Bruto Resultaat'      : 'uitgaven'
                                          };

/*

      List[0].nettoUitgaven               = List[0].uitgaven       -  List[0].btwUitgaven;
      List[0].nettoInkomsten              = List[0].inkomsten      -  List[0].btwInkomsten;
      List[0].resultaat                   = List[0].inkomsten      -  List[0].uitgaven;
      List[0].btwResultaat                = List[0].btwInkomsten   -  List[0].btwUitgaven;
      List[0].nettoResultaat              = List[0].nettoInkomsten -  List[0].nettoUitgaven;
*/

const totalMap                          = { 'Netto Inkomsten'        : 'nettoInkomsten',
                                            'Netto Uitgaven'         : 'nettoUitgaven',
                                            'Netto Resultaat'        : 'nettoResultaat',
                                            'BTW Inkomsten'          : 'btwInkomsten',
                                            'BTW uitgaven'           : 'btwUitgaven',
                                            'BTW Resultaat'          : 'btwResultaat',
                                            'Bruto Inkomsten'        : 'inkomsten',
                                            'Bruto Uitgaven'         : 'uitgaven',
                                            'Bruto Resultaat'        : 'resultaat'
                                         };



const amountElements = ['inkomsten','uitgaven' , 'resultaat', 'btwInkomsten', 'btwUitgaven','btwResultaat','nettoInkomsten', 'nettoResultaat', 'nettoUitgaven' ];



function  getTimeinMS ( date )
{
   let year, month, day, dayMs;

   year                                = Number( date.slice( 6,10 ) );
   month                               = Number( date.slice( 3,5 ) ) - 1;
   day                                 = Number( date.slice( 0,2 ) );
   dayMs                               = new Date( year, month, day );
   return dayMs;
}



function filterOnDate ()
{
   let dashStartDate, dashEndDate,dashStartDatems, dashEndDatems, dashEndDateTestResult;

   const dateStringTest2 = /(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})/;

   dashStartDate                       = document.getElementById( 'dashStartDate' ).value;
   dashStartDatems                     = 0;
   dashEndDatems                       = 1999999999999;

   if ( dashStartDate.length != 0 )
   {
      if ( dateStringTest2.test( dashStartDate ) )
      {
         document.getElementById( 'dashStartDate' ).style.backgroundColor  = '#e6ffe6';
         dashStartDatems = getTimeinMS( dashStartDate );
      }
      else
      {
         document.getElementById( 'dashStartDate' ).style.backgroundColor  = '#ffd9cc';
      }
   }
   else
   {
      document.getElementById( 'dashStartDate' ).style.backgroundColor  = '';
   }

   dashEndDate                           = document.getElementById( 'dashEndDate' ).value;

   if ( dashEndDate.length != 0 )
   {
      dashEndDateTestResult = dateStringTest2.test( dashEndDate );
      if ( dashEndDateTestResult )
      {
         dashEndDatems = getTimeinMS( dashEndDate );
         if (  dashEndDatems >= dashStartDatems )
         {
            document.getElementById( 'dashEndDate' ).style.backgroundColor  = '#e6ffe6';
         }
         else
         {
            document.getElementById( 'dashEndDate' ).style.backgroundColor  = '#ffd9cc';
         }
      }
      else
      {
         document.getElementById( 'dashEndDate' ).style.backgroundColor  = '#ffd9cc';
      }
   }
   else
   {
      document.getElementById( 'dashEndDate' ).style.backgroundColor  =  '';
   }

   const dashledgerAccounts            = document.getElementById( 'dashledgerAccounts' ).value;
   const companies                     = document.getElementById( 'companies' ).value;
   const dashBookYear                  = document.getElementById( 'dashBookYear' ).value;


   manageDashBoard( dashStartDatems,dashEndDatems, dashledgerAccounts,companies, dashBookYear );
}



function getNumber ( stringNUm )
{
   let temp;
   if ( typeof stringNUm !== 'undefined' )
   {
      temp                                = stringNUm.replace( ',', '.' );
      return  Number( temp );
   }
   return  9999999999;
}



function updateTotalList ( dataRecord, List )
{
   try
   {
      let oRecord;
      


      oRecord                             = {};

      if ( List.length == 0 )
      {
         if ( dataRecord.CREDEB.includes( 'Debit' ) )
         {
            oRecord.nettoInkomsten      = 0;
            oRecord.nettoUitgaven       = 0;
            oRecord.nettoResultaat      = 0;
            oRecord.btwInkomsten        = 0;
            oRecord.btwUitgaven         = getNumber( dataRecord.VAT );
            oRecord.btwResultaat        = oRecord.btwUitgaven;
            oRecord.inkomsten           = 0;
            oRecord.uitgaven            = getNumber( dataRecord.grossAmount );
            oRecord.resultaat           = oRecord.uitgaven;
         }
         if ( dataRecord.CREDEB.includes( 'Credit' ) )
         {
            oRecord.nettoInkomsten       = 0;
            oRecord.nettoUitgaven        = 0;
            oRecord.nettoResultaat       = 0;
            oRecord.btwInkomsten         = getNumber( dataRecord.VAT );
            oRecord.btwUitgaven          = 0;
            oRecord.btwResultaat         = oRecord.btwUitgaven;
            oRecord.inkomsten            = getNumber( dataRecord.grossAmount );
            oRecord.uitgaven             = 0;
            oRecord.resultaat            = oRecord.inkomsten;
         }
         List.push( oRecord );
      }
      else
      {
         if ( dataRecord.CREDEB.includes( 'Debit' ) )
         {
            List[0].uitgaven            += getNumber( dataRecord.grossAmount );
            List[0].btwUitgaven         += getNumber( dataRecord.VAT );
         }
         if ( dataRecord.CREDEB.includes( 'Credit' ) )
         {
            List[0].inkomsten    += getNumber( dataRecord.grossAmount );
            List[0].btwInkomsten += getNumber( dataRecord.VAT );
         }
      }

      List[0].nettoUitgaven               = List[0].uitgaven       -  List[0].btwUitgaven;
      List[0].nettoInkomsten              = List[0].inkomsten      -  List[0].btwInkomsten;
      List[0].resultaat                   = List[0].inkomsten      -  List[0].uitgaven;
      List[0].btwResultaat                = List[0].btwInkomsten   -  List[0].btwUitgaven;
      List[0].nettoResultaat              = List[0].nettoInkomsten -  List[0].nettoUitgaven;
   }
   catch ( ex )
   {
      console.log( 'zndDashboard:updateTotalList: An exception occurred:[' + ex + '].' );
   }
}



function updateOverviewList ( dataRecord, List )
{
   let skip, oRecord;

   skip                                = false;
   oRecord                             = {};
   

   for ( let i = 0; i < List.length;i++ )
   {
      if ( List[i].compagnyID.includes( dataRecord.compagnyID ) && List[i].ledgerAccount.includes( dataRecord.ledgerAccount ) )
      {
         skip                          = true;
         if ( dataRecord.CREDEB.includes( 'Debit' ) )
         {
            List[i].uitgaven        += getNumber( dataRecord.grossAmount );
            List[i].btwUitgaven     += getNumber( dataRecord.VAT );
         }
         if ( dataRecord.CREDEB.includes( 'Credit' ) )
         {
            List[i].inkomsten       += getNumber( dataRecord.grossAmount );
            List[i].btwInkomsten    += getNumber( dataRecord.VAT );
         }
         break;
      }
   }

   if ( !skip )
   {
      oRecord.ledgerAccount           = dataRecord.ledgerAccount;
      oRecord.compagnyID              = dataRecord.compagnyID;

      oRecord.nettoInkomsten         = 0;
      oRecord.nettoUitgaven          = 0;
      oRecord.nettoResultaat         = 0;

      if ( dataRecord.CREDEB.includes( 'Debit' ) )
      {
         oRecord.btwInkomsten        = 0;
         oRecord.btwUitgaven         = getNumber( dataRecord.VAT );
         oRecord.btwResultaat        = oRecord.btwUitgaven;
         oRecord.inkomsten           = 0;
         oRecord.uitgaven            = getNumber( dataRecord.grossAmount );
         oRecord.resultaat           =  oRecord.uitgaven;
      }
      if ( dataRecord.CREDEB.includes( 'Credit' ) )
      {
         oRecord.btwInkomsten         = getNumber( dataRecord.VAT );
         oRecord.btwUitgaven          = 0;
         oRecord.btwResultaat         = oRecord.btwInkomsten;
         oRecord.inkomsten            = getNumber( dataRecord.grossAmount );
         oRecord.uitgaven             = 0;
         oRecord.resultaat            = oRecord.inkomsten;
      }

      List.push( oRecord );
   }

   for ( let i = 0; i < List.length;i++ )
   {
      List[i].resultaat               = List[i].inkomsten    - List[i].uitgaven;
      List[i].btwResultaat            = List[i].btwInkomsten + List[i].btwUitgaven;

      List[i].nettoUitgaven           = List[i].uitgaven     - List[i].btwUitgaven;
      List[i].nettoInkomsten          = List[i].inkomsten    + List[i].btwInkomsten;
      List[i].nettoResultaat          = List[i].nettoInkomsten -  List[i].nettoUitgaven;
   }

   sortArray( List, {by: 'ledgerAccount', order: 'asc' } );
}



function updateLedgerOverviewList ( dataRecord, List )
{
   try
   {
      let skip, oRecord;

      skip                                = false;
      oRecord                             = {};
      

      for ( let i = 0; i < List.length;i++ )
      {
         if ( List[i].ledgerAccount.includes( dataRecord.ledgerAccount ) )
         {
            skip                          = true;
            if ( dataRecord.CREDEB.includes( 'Debit' ) )
            {
               List[i].uitgaven        += getNumber( dataRecord.grossAmount );
               List[i].btwUitgaven     += getNumber( dataRecord.VAT );

            }
            if ( dataRecord.CREDEB.includes( 'Credit' ) )
            {
               List[i].inkomsten       += getNumber( dataRecord.grossAmount );
               List[i].btwInkomsten    += getNumber( dataRecord.VAT );
            }
            break;
         }
      }
      if ( !skip )
      {
         oRecord.ledgerAccount           = dataRecord.ledgerAccount;

         oRecord.nettoInkomsten         = 0;
         oRecord.nettoUitgaven          = 0;
         oRecord.nettoResultaat         = 0;


         if ( dataRecord.CREDEB.includes( 'Debit' ) )
         {
            oRecord.btwInkomsten        = 0;
            oRecord.btwUitgaven         = getNumber( dataRecord.VAT );
            oRecord.btwResultaat        = oRecord.btwUitgaven;
            oRecord.inkomsten           = 0;
            oRecord.uitgaven            = getNumber( dataRecord.grossAmount );
            oRecord.resultaat           =  oRecord.uitgaven;
         }
         if ( dataRecord.CREDEB.includes( 'Credit' ) )
         {
            oRecord.btwInkomsten         = getNumber( dataRecord.VAT );
            oRecord.btwUitgaven          = 0;
            oRecord.btwResultaat         = oRecord.btwInkomsten;
            oRecord.inkomsten            = getNumber( dataRecord.grossAmount );
            oRecord.uitgaven             = 0;
            oRecord.resultaat            = oRecord.inkomsten;
         }
         List.push( oRecord );
      }

      for ( let i = 0; i < List.length;i++ )
      {
         List[i].resultaat               = List[i].inkomsten - List[i].uitgaven;
         List[i].btwResultaat            = List[i].btwInkomsten - List[i].btwUitgaven;

         List[i].nettoUitgaven           = List[i].uitgaven     - List[i].btwUitgaven;
         List[i].nettoInkomsten          = List[i].inkomsten    - List[i].btwInkomsten;
         List[i].nettoResultaat          = List[i].nettoInkomsten -  List[i].nettoUitgaven;
      }

      sortArray( List, {by: 'ledgerAccount', order: 'asc' } );
   }
   catch ( ex )
   {
      console.log( 'zndDashboard:updateLedgerOverviewList: An exception occurred:[' + ex + '].' );
   }
}



function updateStatementList ( dataRecord, List )
{
   try
   {
      List.push( dataRecord );
   }
   catch ( ex )
   {
      console.log( 'zndDashboard:updateStatementList: An exception occurred:[' + ex + '].' );
   }
}



function updateList ( startDate,endDate,ledgerAccounts, companies, rowNR, rowData, rows, updateFunction, dashBookYear )
{
   try
   {
      let  j,ledgerswitch,companySwitch,  msg;

      msg                             = tableData;
      ledgerswitch                    = ledgerAccounts.includes( '--------------------------------------------' ) ? false : true;
      companySwitch                   = companies.includes( '---' ) ? false : true;

      const bookYear = findBookyear ( dashBookYear );

      if ( bookYear === '---' || bookYear.length === 0 )
      {   if ( ( msg[rowNR].invoiceDateEpoch >= startDate ) && ( msg[rowNR].invoiceDateEpoch <= endDate ) )
          {
             if ( !ledgerswitch && !companySwitch )
             {
                updateFunction( rowData, rows );
             }
             if ( ledgerswitch && !companySwitch )
             {
                if ( msg[rowNR].ledgerAccount.includes( ledgerAccounts ) )
                {
                   updateFunction( rowData, rows );
                }
             }

             if ( !ledgerswitch &&  companySwitch )
             {
                if ( msg[rowNR].compagnyID.includes( companies ) )
                {
                   updateFunction( rowData, rows );
                }
             }

             if ( ledgerswitch &&  companySwitch )
             {
                if ( msg[rowNR].ledgerAccount.includes( ledgerAccounts )  &&  msg[rowNR].compagnyID.includes( companies ) )
                {
                   updateFunction( rowData, rows );
                }
             }
          }
      }
      else
      {  if ( ( msg[rowNR].invoiceDateEpoch >= startDate ) && ( msg[rowNR].invoiceDateEpoch <= endDate ) && ( msg[rowNR].bkBookYear === dashBookYear ) )
         {
            if ( !ledgerswitch && !companySwitch )
            {
               updateFunction( rowData, rows );
            }
            if ( ledgerswitch && !companySwitch )
            {
               if ( msg[rowNR].ledgerAccount.includes( ledgerAccounts ) )
               {
                  updateFunction( rowData, rows );
               }
            }

            if ( !ledgerswitch &&  companySwitch )
            {
               if ( msg[rowNR].compagnyID.includes( companies ) )
               {
                  updateFunction( rowData, rows );
               }
            }

            if ( ledgerswitch &&  companySwitch )
            {
               if ( msg[rowNR].ledgerAccount.includes( ledgerAccounts )  &&  msg[rowNR].compagnyID.includes( companies ) )
               {
                  updateFunction( rowData, rows );
               }
            }
         }

      }
      return rows;
   }
   catch ( ex )
   {
      console.log( 'zndDashboard:updateList: An exception occurred:[' + ex + '].' );
   }
}



function mapTotals ( startDate,endDate,ledgerAccounts, companies , filterData )
{   try
    {   const expenses                 = ['3001 _Verkopen','1001_ZakelijkeInvestering', '1002_Kantinekosten', '1003_Vakliteratuur', '1004_Bankkosten','1005_Accountantkosten', '1006_Zakelijke Huur','1007_Loonkosten','1008_Kantoor','1010_Restaurantkosten','1011_Reiskosten','1012_Relatiegeschenken','1100_CARCOSTS','2000_Auteurrechten uitkering','5000_BTW','5004_AuteursrechtenTAX','5005_Douane kosten','6000_BeheerOntvangsten'  ];
        const msg                      = [];
        const rows                     = [];

        filterData.forEach( ( filterObj ) => {  const  result = tableData.filter( obj => { return obj._id === filterObj.ID;      } );
                                              msg.push( result[0] );
                                             } );

         msg.forEach( ( element ) => {   const tRowData         = {};
                                         tRowData.CREDEB        = typeof element.movementSign !== 'undefined' ? ( Number( element.movementSign ) === 1 ? 'Debit' :  ( Number( element.movementSign ) === 0 ? 'Credit' :  'Unknown'  ) ) : 'Unknown' ;
                                         tRowData.grossAmount   = element.grossAmount;
                                         tRowData.grossAmount   = element.grossAmount;
                                         tRowData.VAT           = element.VAT;
                                         if ( expenses.includes( element.ledgerAccount ) )
                                         {   updateTotalList( tRowData, rows );
                                         }
                                     } );
      return rows;
   }
   catch ( ex )
   {
      console.log( 'zndDashboard:mapTotals: An exception occurred:[' + ex + '].' );
   }
}



function mapledgers ( startDate,endDate,ledgerAccounts, companies , filterData )
{   try
    {   const msg                      = [];
        const oRowData                 = {};
        const rows                     = [];

        filterData.forEach( ( filterObj ) => {  const  result = tableData.filter( obj => { return obj._id === filterObj.ID;      } );
                                                msg.push( result[0] );
                                             } );

        msg.forEach( ( element ) => {   oRowData.ledgerAccount      = element.ledgerAccount;
                                        oRowData.CREDEB             = typeof element.movementSign !== 'undefined' ? ( Number( element.movementSign ) === 1 ? 'Debit' :  ( Number( element.movementSign ) === 0 ? 'Credit' :  'Unknown'  ) ) : 'Unknown' ;
                                        oRowData.grossAmount        = element.grossAmount;
                                        oRowData.VAT                = element.VAT;
                                        updateLedgerOverviewList( oRowData, rows );
                                     } );
        return rows;
   }
   catch ( ex )
   {   console.log( 'zndDashboard:mapledgers: An exception occurred:[' + ex + '].' );
   }
}



function mapOverview ( startDate,endDate,ledgerAccounts, companies, filterData )
{   try
    {   const msg                      = [];
        const oRowData                 = {};
        const rows                     = [];

        filterData.forEach( ( filterObj ) => {  const  result = tableData.filter( obj => { return obj._id === filterObj.ID;      } );
                                             msg.push( result[0] );
                                          } );

        msg.forEach( ( element ) => {   oRowData.compagnyID         = element.compagnyID;
                                        oRowData.ledgerAccount      = element.ledgerAccount;
                                        oRowData.CREDEB             = typeof element.movementSign !== 'undefined' ? ( Number( element.movementSign ) === 1 ? 'Debit' :  ( Number( element.movementSign ) === 0 ? 'Credit' :  'Unknown'  ) ) : 'Unknown' ;
                                        oRowData.grossAmount        = element.grossAmount;
                                        oRowData.VAT                = element.VAT;
                                        updateOverviewList( oRowData, rows );
                                     } );
        return rows;
   }
   catch ( ex )
   {   console.log( 'zndDashboard:mapOverview: An exception occurred:[' + ex + '].' );
   }
}



function mapStatements ( startDate,endDate,ledgerAccounts, companies, dashBookYear )
{
   try
   {
      let msg, j,  rowData, rows;
      msg                             = tableData;
      rowData                         = {};
      rows                            = [];
      const options  = {  day: '2-digit' , month: '2-digit', year: 'numeric'};

      for ( j = 0; j < msg.length; j++ )
      {
         const creationDate            = typeof msg[j].creationDate !== 'undefined' ? msg[j].creationDate : '---';
         rowData                     = {};
         rowData.ID                  =  msg[j]._id;
         rowData.DOC                 = typeof msg[j].docPath !== 'undefined' ? ( msg[j].docPath.length > 0 ? 'D' : 'NP' ) : 'U' ;
         rowData.creationDate        = creationDate ;
         rowData.creationDateString  = ( new Date( creationDate ) ).toLocaleDateString( 'nl-NL', {options} );
         rowData.DONE                = typeof msg[j].lastTransferredAccountantTime !== 'undefined' ? msg[j].lastTransferredAccountantTime : '---' ;
         rowData.UPL                 = typeof msg[j].transferredAccountantCount !== 'undefined' ?  Number( msg[j].transferredAccountantCount ) : 0 ;
         rowData.ACCOK               = typeof msg[j].accntchk !== 'undefined' ? ( msg[j].accntchk.includes( 'on' ) ? 'X' : '-' ) : '' ;
         rowData.TRNREF              = typeof msg[j].bankstatementID !== 'undefined' ? msg[j].bankstatementID : '-' ;
         rowData.CREDEB              = typeof msg[j].movementSign !== 'undefined' ? ( Number( msg[j].movementSign ) === 1 ? 'Debit' :  ( Number( msg[j].movementSign ) === 0 ? 'Credit' :  'Unknown'  ) ) : 'Unknown' ;

         rowData.bankDate            = msg[j].bankDate;
         rowData.invoiceDate         = msg[j].invoiceDate;
         rowData.grossAmount         = msg[j].grossAmount;
         rowData.VAT                 = msg[j].VAT;
         rowData.bookedVAT           = ( typeof  msg[j].bookedVAT !== 'undefined' ) ? getNumber( msg[j].bookedVAT ) : 0;
         rowData.bookingPeriod       = msg[j].bookingPeriod;
         rowData.proofType           = msg[j].proofType;
         rowData.paymentTypes        = msg[j].paymentTypes;
         rowData.beneficiary         = msg[j].beneficiary;
         rowData.ledgerAccount       = msg[j].ledgerAccount;
         rowData.bkLedgerAccount     = ( typeof msg[j].bkLedgerAccount !== 'undefined' ) ? msg[j].bkLedgerAccount : '-------------------';
         rowData.acountantReference  = msg[j].acountantReference;
         rowData.compagnyID          = msg[j].compagnyID;
         rowData.invoiceNumber       = msg[j].invoiceNumber;
         rowData.billDescription     = msg[j].billDescription;
         rowData.documentName        = msg[j].docScan;
         rowData.invoiceDateEpoch    = msg[j].invoiceDateEpoch ;
         rowData.grossAmountNR       = msg[j].grossAmountNR ;
         rowData.VATNR               = msg[j].VATNR ;
         rowData.bkBookYear          = msg[j].bkBookYear ;
         rows                        = updateList( startDate,endDate,ledgerAccounts, companies, j, rowData, rows, updateStatementList, dashBookYear );
      }
      return rows;
   }
   catch ( ex )
   {
      console.log( 'zndDashboard:mapStatements: An exception occurred:[' + ex + '].' );
   }
}


function findBookkeeperLedgerName ( bkLedgerAccountID )
{  const pos = bookkeepingLedgerNames.map( e => e._id ).indexOf( bkLedgerAccountID );
   return pos > -1 ? bookkeepingLedgerNames[pos].bkLedgerName : '';
}



function findBookyear ( bkBookYearID )
{  const pos = bookkeepingYears.map( e => e._id ).indexOf( bkBookYearID );
   return pos > -1 ? bookkeepingYears[pos].bookkeepingYear : '';
}

function populateTable ( table, dataRows, map )
{
   try
   {   const options                   =  { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'EUR'};

       let element, counter = 0;


       for ( element of dataRows )
       {   const row                   = table.insertRow();
           let ROWID                   = '';

           for ( const matrixElement in map )
           {   const key               = map[matrixElement];
               const cell              = row.insertCell();
               const content           = element[key];
               let text                = '';
               const textNode          = document.createTextNode( content );
               const aElement          = document.createElement( 'a' );
               const rowReference      = '/zndStatements/' + content;
               aElement.setAttribute( 'href',rowReference );
               aElement.setAttribute( 'target','_blank' );
               cell.setAttribute( 'style', 'padding-left:10px;padding-right:10px;' );
               switch ( key )
               {   case 'compagnyID'        :   cell.appendChild( textNode );
                                                break;
                   case 'ID'                :   text            =  document.createTextNode( counter++ );
                                                aElement.appendChild( text );
                                                cell.appendChild( aElement );
                                                ROWID = aElement;
                                                break;
                   case 'documentName'      :   {   const textNoder        =  document.createTextNode( content );
                                                     aElement.appendChild( textNoder );
                                                     aElement.setAttribute( 'href',ROWID.href );
                                                     cell.appendChild( aElement );
                                                     break;
                                                }
                   case 'bkLedgerAccount'   :   {   const ledgerText        =  document.createTextNode( findBookkeeperLedgerName( content ) );
                                                    cell.appendChild( ledgerText );
                                                    break;
                                                }
                  case 'bkBookYear'         :   {   const ledgerText        =  document.createTextNode( findBookyear( content ) );
                                                   cell.appendChild( ledgerText );
                                                   break;
                                               }
                   default                  :   if ( amountElements.includes( key ) )
                                                {   if ( typeof content !== 'undefined' )
                                                    {   const taxt = document.createTextNode( content.toLocaleString( 'nl-NL', options ) );
                                                        cell.appendChild( taxt );
                                                        cell.style.textAlign   = 'right';
                                                    }
                                                }
                                                else
                                                   cell.appendChild( textNode );
                                                break;
               }
               cell.style.maxWidth = '200px';
           }
       }
   }
   catch ( ex )
   {   console.log( 'zndDashboard:populateTable2: An exception occurred:[' + ex + '].' );
   }
}


function createTableHeader ( Table, map, tableName, rows )
{
   try
   {
      let  i, tableHeader;

      header                            = Table.createTHead();
      row                               = header.insertRow( 0 );
      tableHeader                       = Object.keys( map );

      for ( i = tableHeader.length - 1; i >= 0 ; i-- )
      {
         cell                        = row.insertCell( 0 );
         let element                 = document.createTextNode( tableHeader[i] );
         cell.appendChild( element );
         element                 = document.createElement( 'a' );
         let param               = 'javascript:sortColumn(\'' + tableHeader[i] + 'UP\',' + JSON.stringify( tableName ) + ',' + JSON.stringify( map ) + ',' + JSON.stringify( rows ) + ');';
         element.setAttribute( 'href', param  );
         temp                    = document.createTextNode( '\u25B4'	);
         element.style.textDecoration   = 'none';
         element.appendChild( temp );
         cell.appendChild( element );
         element                 = document.createElement( 'a' );
         param                   = 'javascript:sortColumn(\'' + tableHeader[i] + 'DOWN\',' + JSON.stringify( tableName ) + ',' + JSON.stringify( map ) + ',' + JSON.stringify( rows ) + ');';
         element.setAttribute( 'href', param  );
         temp                    = document.createTextNode( '\u25BE'	);
         element.style.textDecoration   = 'none';
         element.appendChild( temp );
         cell.appendChild( element );
         cell.style.backgroundColor  = '#a9becc';
         cell.style.fontWeight       = 'bold';
      }
   }
   catch ( ex )
   {
      console.log( 'zndDashboard:clearTable: An exception occurred:[' + ex + '].' );
   }
}



function clearTable ( Table )
{
   try
   {
      while ( Table.firstChild )
      {
         Table.removeChild( Table.firstChild );
      }
   }
   catch ( ex )
   {
      console.log( 'zndDashboard:clearTable: An exception occurred:[' + ex + '].' );
   }
}



function sortRows ( sortID,sortMap, rows )
{
   try
   {
      let header;
      const getTableHeader = ( header ) => sortMap[header] || 'UKNOWN';

      if ( sortID.includes( 'UP' ) )
      {
         sortArray( rows, { by: getTableHeader( sortID.split( 'UP' )[0] ), order: 'desc' } );
      }
      if ( sortID.includes( 'DOWN' ) )
      {
         sortArray( rows, { by: getTableHeader( sortID.split( 'DOWN' )[0] ), order: 'asc' } );
      }
      return rows;
   }
   catch ( ex )
   {
      console.log( 'zndDashboard:sortRows: An exception occurred:[' + ex + '].' );
   }
}



function createTable ( tableName, rows, map,ledgerAccounts, companies , dashBookYear )
{
   try
   {
      let tableAnchor, tableElement;

      tableAnchor                     = document.getElementById( tableName );
      tableElement                    = document.createElement( 'TABLE' );
      clearTable( tableAnchor );
      createTableHeader( tableElement, map, tableName, rows );
      populateTable( tableElement, rows, map, dashBookYear );
      tableAnchor.appendChild( tableElement );
      //contextualizeFilter ( rows, ledgerAccounts, companies, dashBookYear );

   }
   catch ( ex )
   {
      console.log( 'zndDashboard:createTable: An exception occurred:[' + ex + '].' );
   }
}



function sortColumn ( kolm, tableName, map, rows )
{
   try
   {
      let sortedRows;
      sortedRows                      = sortRows( kolm,map, rows );
      createTable( tableName, rows, map );
   }
   catch ( ex )
   {
      console.log( 'zndDashboard:sortColumn: An exception occurred:[' + ex + '].' );
   }
}



function manageDashBoard ( startDate,endDate,ledgerAccounts, companies, dashBookYear )
{
   try
   {  const statementRecords = mapStatements( startDate,endDate,ledgerAccounts, companies , dashBookYear );
      createTable( 'statementRecords', statementRecords, statementMap,ledgerAccounts, companies, dashBookYear );

      const overviewRecords = mapOverview( startDate,endDate,ledgerAccounts, companies, statementRecords );
      createTable( 'overviewRecords', overviewRecords, overviewMap,ledgerAccounts, companies, dashBookYear );

      const manageTotalsByLedger = mapledgers( startDate,endDate,ledgerAccounts, companies, statementRecords );
      createTable( 'manageTotalsByLedger', manageTotalsByLedger, ledgerMap,ledgerAccounts, companies, dashBookYear );

      const totalsRecords = mapTotals( startDate,endDate,ledgerAccounts, companies, statementRecords  );
      createTable( 'totalsRecords', totalsRecords, totalMap,ledgerAccounts, companies, dashBookYear );

      contextualizeFilter ( statementRecords, ledgerAccounts, companies, dashBookYear );

   }
   catch ( ex )
   {
      console.log( 'zndDashboard:manageDashBoard: An exception occurred:[' + ex + '].' );
   }
}

function contextualizeBookYears (  dashBookYear )
{  try
   {   const dashBookYearElement              =  document.getElementById( 'dashBookYear' );

      while ( dashBookYearElement.firstChild )
      {   dashBookYearElement.removeChild( dashBookYearElement.firstChild );
      }

       bookkeepingYears.forEach ( ( element ) =>
       {   const option                = document.createElement( 'option' );

           option.value                = element._id;
           option.text                 = element.bookkeepingYear;

           if ( option.value.includes( dashBookYear ) )
           {  option.selected          = true;
           }
           if (  option.text.includes( '--'  ) )
            {   if ( typeof dashBookYear === 'undefined' || dashBookYear.length === 0 )
                {   option.selected    = true;
                }
            }
           dashBookYearElement.add( option );
       } );
   }
   catch ( ex )
   { console.log( 'zndDashboard:contextualizeBookYears: An exception occurred:[' + ex + '].' );
   }
}



function contextualizeAccounts ( rows,ledgerAccounts )
{
   try
   {
      let dashledgerAccounts, option, ledgerAccountList, j;

      if ( typeof rows[rows.length - 1].CREDEB  !== 'undefined' )
      {
         dashledgerAccounts              = document.getElementById( 'dashledgerAccounts' );
         ledgerAccountList               = [];

         while ( dashledgerAccounts.firstChild )
         {
            dashledgerAccounts.removeChild( dashledgerAccounts.firstChild );
         }


         ledgerAccountList.push( '--------------------------------------------' );
         for ( j = 0; j < rows.length; j++ )
         {
            if ( !ledgerAccountList.includes( rows[j].ledgerAccount ) )
            {
               ledgerAccountList.push( rows[j].ledgerAccount );
            }
         }

         ledgerAccountList.sort();



         for ( let k = 0; k < ledgerAccountList.length;k++ )
         {
            option                      = document.createElement( 'option' );
            option.value                = ledgerAccountList[k];
            option.text                 = ledgerAccountList[k];

            dashledgerAccounts.add( option );
         }

         const dashledgerSet               = document.getElementById( 'dashledgerAccounts' );
         dashledgerSet.value             = ledgerAccounts;
      }
   }
   catch ( ex )
   {
      console.log( 'zndDashboard:contextualizeAccounts: An exception occurred:[' + ex + '].' );
   }
}



function contextualizeCompanies ( rows, companies )
{
   try
   {
      let dashcompanies, option, companyList, j, k;

      if ( typeof rows[rows.length - 1].CREDEB  !== 'undefined' )
      {
         dashcompanies                   = document.getElementById( 'companies' );
         companyList                     = [];

         while ( dashcompanies.firstChild )
         {
            dashcompanies.removeChild( dashcompanies.firstChild );
         }
         companyList.push( '---' );
         for ( j = 0; j < rows.length; j++ )
         {
            if ( !companyList.includes( rows[j].compagnyID ) )
            {
               companyList.push( rows[j].compagnyID );
            }
         }
         companyList.sort();

         for ( k = 0; k < companyList.length; k++ )
         {
            option                      = document.createElement( 'option' );
            option.value                = companyList[k];
            option.text                 = companyList[k];
            dashcompanies.add( option );
         }

         const companiesSet                = document.getElementById( 'companies' );
         companiesSet.value              = companies;
      }
   }
   catch ( ex )
   {
      console.log( 'zndDashboard:contextualizeCompanies: An exception occurred:[' + ex + '].' );
   }
}



function setupCompanies ()
{
   try
   {
      let dashcompanies, option, companyList, j, k;

      dashcompanies                   = document.getElementById( 'companies' );
      companyList                     = [];

      for ( j = 0; j < tableData.length; j++ )
      {
         if ( !companyList.includes( tableData[j].compagnyID ) )
         {
            companyList.push( tableData[j].compagnyID );
         }
      }
      companyList.sort();

      for ( k = 0; k < companyList.length; k++ )
      {
         option                      = document.createElement( 'option' );
         option.value                = companyList[k];
         option.text                 = companyList[k];
         dashcompanies.add( option );
      }
   }
   catch ( ex )
   {
      console.log( 'zndDashboard:setupCompanies: An exception occurred:[' + ex + '].' );
   }
}



function setupLegderAccounts ()
{
   try
   {
      let dashledgerAccounts, option, ledgerAccountList, j;

      dashledgerAccounts              = document.getElementById( 'dashledgerAccounts' );
      ledgerAccountList               = [];

      for ( j = 0; j < tableData.length; j++ )
      {
         if ( !ledgerAccountList.includes( tableData[j].ledgerAccount ) )
         {
            ledgerAccountList.push( tableData[j].ledgerAccount );
         }
      }
      ledgerAccountList.sort();
      option                          = document.createElement( 'option' );
      option.value                    = '--------------------------------------------';
      option.text                     = '--------------------------------------------';

      dashledgerAccounts.add( option );
      for ( let k = 0; k < ledgerAccountList.length;k++ )
      {
         option                      = document.createElement( 'option' );
         option.value                = ledgerAccountList[k];
         option.text                 = ledgerAccountList[k];
         dashledgerAccounts.add( option );
      }
   }
   catch ( ex )
   {
      console.log( 'zndDashboard:setupLegderAccounts: An exception occurred:[' + ex + '].' );
   }
}



function initTable ( msg,queryObj )
{
   try
   {
      tableData                       = msg;
      setupLegderAccounts();
      setupCompanies();


      contextualizeBookYears ( typeof queryObj.bookYear !== 'undefined' ? queryObj.bookYear : '' );

      const dashStartDate               = document.getElementById( 'dashStartDate' );
      dashStartDate.value             = typeof queryObj.startDate !== 'undefined' ? queryObj.startDate : '';

      const dashEndDate                 = document.getElementById( 'dashEndDate' );
      dashEndDate.value               = typeof queryObj.endDate !== 'undefined' ? queryObj.endDate : '';

      const dashledgerAccounts          = document.getElementById( 'dashledgerAccounts' );
      dashledgerAccounts.value        = typeof queryObj.dashledgerAccounts !== 'undefined' ? queryObj.dashledgerAccounts : '';

      const companies                   = document.getElementById( 'companies' );
      companies.value                 = typeof queryObj.companies !== 'undefined' ? queryObj.companies : '';
      filterOnDate( 0,1999999999999 );
   }
   catch ( ex )
   {
      console.log( 'zndDashboard:initTable: An exception occurred:[' + ex + '].' );
   }
}
//<body onload="init(<%=JSON.stringify(items) %>, <%=JSON.stringify(queryObj) %>);">

function contextualizeFilter ( rows, ledgerAccounts, companies, dashBookYear )
{   contextualizeAccounts( rows,ledgerAccounts );
    contextualizeCompanies( rows, companies );
    contextualizeBookYears( dashBookYear );
}


function init ()
{   const msg = JSON.parse( document.getElementById( 'items' ).value );
    const queryObj = JSON.parse( document.getElementById( 'queryObj' ).value );
    bookkeepingLedgerNames = JSON.parse( document.getElementById( 'bookkeepingLedgerNames' ).textContent );
    bookkeepingYears =   JSON.parse( document.getElementById( 'bookkeepingYears' ).textContent ) ;
    initTable ( msg,queryObj );
}


function refreshPage ()
{
   const startDate                        = document.getElementById( 'dashStartDate' ).value;
   const endDate                          = document.getElementById( 'dashEndDate' ).value;
   const dashledgerAccounts               = document.getElementById( 'dashledgerAccounts' ).value;
   const companies                        = document.getElementById( 'companies' ).value;
   const bookYear                        = document.getElementById( 'dashBookYear' ).value;
   const pageString                       = window.location.href;

   const url                             = new URL( pageString );
   const urlOringin                      = new URL( url.pathname,pageString );



   startDate.length == 0 ? '' : urlOringin.searchParams.append( 'startDate', startDate );
   endDate.length == 0 ? '' : urlOringin.searchParams.append( 'endDate', endDate );
   dashledgerAccounts.includes( '--------------------------------------------' )  ? '' : urlOringin.searchParams.append( 'dashledgerAccounts', dashledgerAccounts );
   companies.includes( '---' )   ? '' : urlOringin.searchParams.append( 'companies', companies );
   bookYear.includes( '---' )   ? '' : urlOringin.searchParams.append( 'bookYear', bookYear );

   location.href = urlOringin;
}



function augmentPage ()
{
   const startDate                       = document.getElementById( 'dashStartDate' ).value;
   const endDate                         = document.getElementById( 'dashEndDate' ).value;
   const dashledgerAccounts              = document.getElementById( 'dashledgerAccounts' ).value;
   const companies                       = document.getElementById( 'companies' ).value;
   const pageString                      = window.location.href;
   const url                             = new URL( pageString );
   const urlOringin                      = new URL( url.pathname,pageString );

   startDate.length == 0                                                        ? '' : urlOringin.searchParams.append( 'startDate', startDate );
   endDate.length == 0                                                          ? '' : urlOringin.searchParams.append( 'endDate', endDate );
   dashledgerAccounts.includes( '--------------------------------------------' )  ? '' : urlOringin.searchParams.append( 'dashledgerAccounts', dashledgerAccounts );
   companies.includes( '---' )                                                    ? '' : urlOringin.searchParams.append( 'companies', companies );
   urlOringin.searchParams.append( 'augment', 'true' );

   location.href                       = urlOringin;
}
