var tableData, rowList, oRowList;

const statementMap                      = {   "NR"                   :"ID" ,
                                              "Gross Amount"         :"grossAmountNR",
                                              "DeclarationStatement" : "declarationStatement",
                                              "CRED/DEB"             :"CREDEB",
                                              "Bankdate"             :"bankDateEpoch",
                                              "Declarant"            :"beneficiary",
                                              "Company"              :"compagnyID",
                                              "Invoice Number"       :"invoiceNumber",
                                              "Bill Description"     :"billDescription",
                                           };

const amountElements = ["inkomsten","uitgaven" , "resultaat", "btwInkomsten", "btwUitgaven","btwResultaat","nettoInkomsten", "nettoResultaat", "nettoUitgaven" ];



function  getTimeinMS(date)
{   var year, month, day, dayMs;

    year                                = Number(date.slice(6,10));
    month                               = Number(date.slice(3,5)) -1;
    day                                 = Number(date.slice(0,2))
    dayMs                               = new Date(year, month, day);
    return dayMs;
}



function filterOnDate()
{   var dashStartDate, dashEndDate,dashStartDatems, dashEndDatems, dashEndDateTestResult;

    var dateStringTest2 = /(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})/;

    dashStartDate                       = document.getElementById("dashStartDate").value;
    dashStartDatems                     = 0
    dashEndDatems                       = 1999999999999

    if(dashStartDate.length != 0)
    {   if (dateStringTest2.test(dashStartDate) )
        {   document.getElementById("dashStartDate").style.backgroundColor  = '#e6ffe6';
            dashStartDatems = getTimeinMS(dashStartDate);
        }
        else
        {   document.getElementById("dashStartDate").style.backgroundColor  = '#ffd9cc';
        }
    }
    else
    {   document.getElementById("dashStartDate").style.backgroundColor  = "";

    }

    dashEndDate                           = document.getElementById("dashEndDate").value;

    if(dashEndDate.length != 0)
    {   dashEndDateTestResult = dateStringTest2.test(dashEndDate);
        if (dashEndDateTestResult )
        {   dashEndDatems = getTimeinMS(dashEndDate);
            if (  dashEndDatems >= dashStartDatems )
            {   document.getElementById("dashEndDate").style.backgroundColor  = '#e6ffe6';

            }
            else
            {   document.getElementById("dashEndDate").style.backgroundColor  = '#ffd9cc';
            }
        }
        else
        {   document.getElementById("dashEndDate").style.backgroundColor  = '#ffd9cc';
        }
    }
    else
    {   document.getElementById("dashEndDate").style.backgroundColor  =  "";
    }

    /*dashledgerAccounts                           = document.getElementById("dashledgerAccounts").value;*/
    companies                                    = document.getElementById("companies").value;

    manageDashBoard(dashStartDatems,dashEndDatems, '',companies)
}




function updateStatementList(dataRecord, List)
{   try
    {   List.push(dataRecord);
    }
    catch(ex)
    {   console.log("zndDashboard:updateStatementList: An exception occurred:[" +ex+ "].");
    }
}



function updateList(startDate,endDate,ledgerAccounts, companies, rowNR, rowData, rows, updateFunction)
{   try
    {   var  j,ledgerswitch,companySwitch,  msg;

        msg                             = tableData;
        ledgerswitch                    = ledgerAccounts.includes('--------------------------------------------') ? false: true;
        companySwitch                   = companies.includes('---') ? false: true;

        if( ( msg[rowNR].bankDateEpoch >= startDate) && ( msg[rowNR].bankDateEpoch <= endDate )   )
        {   if ( !ledgerswitch && !companySwitch )
            {  updateFunction(rowData, rows);

            }
            if ( ledgerswitch && !companySwitch )
            {   if ( msg[rowNR].ledgerAccount.includes(ledgerAccounts) )
                {   updateFunction(rowData, rows);
                }
            }

            if ( !ledgerswitch &&  companySwitch )
            {   if ( msg[rowNR].compagnyID.includes(companies) )
                {   updateFunction(rowData, rows);
                }
            }

            if ( ledgerswitch &&  companySwitch )
            {   if ( msg[rowNR].ledgerAccount.includes(ledgerAccounts)  &&  msg[rowNR].compagnyID.includes(companies) )
                {   updateFunction(rowData, rows);
                }
            }
        }
        return rows;
    }
    catch(ex)
    {   console.log("zndDashboard:updateList: An exception occurred:[" +ex+ "].");
    }
}


function mapStatements(startDate,endDate,ledgerAccounts, companies)
{   try
    {   var msg, j,  rowData, rows;
        msg                             = tableData;
        rowData                         = {};
        rows                            = [];

        for ( j = 0; j < msg.length; j++)
        {   rowData             = {}
            rowData.ID                            =  msg[j]._id;
            rowData.grossAmount                   = msg[j].grossAmount;
            rowData.declarationStatement          = msg[j].declarationStatement ;            
            rowData.CREDEB                        = typeof msg[j].movementSign !== 'undefined' ? ( msg[j].movementSign.includes('1') ? 'Debit': ( msg[j].movementSign.includes('0') ? 'Credit': 'Unknown')) : 'Unknown' ;
            rowData.bankDate                      = msg[j].bankDate;
            
            rowData.beneficiary                   = msg[j].beneficiary;
            rowData.compagnyID                    = msg[j].compagnyID;
            rowData.invoiceNumber                 = msg[j].invoiceNumber;
            rowData.billDescription               = msg[j].billDescription;
            rowData.grossAmountNR                 = msg[j].grossAmountNR ;
            
            rows                        = updateList(startDate,endDate,ledgerAccounts, companies, j, rowData, rows, updateStatementList)
        }
        return rows;
    }
    catch(ex)
    {   console.log("zndDashboard:mapStatements: An exception occurred:[" +ex+ "].");
    }
}



function populateTable(table, dataRows)
{   try
    {   var element, row, cell, content, text, aElement, textNode, counter;
        var options  =  { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'EUR'};

        counter                           = 0;

        for ( element of dataRows )
        {   row                         = table.insertRow();
            for (key in element)
            {   if  (!((key.includes('invoiceDateEpoch')  || key.includes('bankDateEpoch')  || key.includes('grossAmountNR') || key.includes('VATNR'))))
                {   cell                = row.insertCell();
                    content             = element[key];
                    text                = "";

                    cell.style.paddingLeft  = '10px';
                    cell.style.paddingRight = '10px';

                    if  ( key.includes('ID') && !key.includes('compagnyID') )
                    {   aElement        = document.createElement('a');
                        aElement.setAttribute("href","/zndStatements/"+content);
                        aElement.setAttribute("target","_blank");
                        text            =  document.createTextNode(counter++);
                        aElement.appendChild(text);
                        cell.appendChild(aElement);
                    }
                    else
                    if ( amountElements.includes(key) )
                    {   text = document.createTextNode(content.toLocaleString('nl-NL', options));
                        cell.appendChild(text);
                        cell.style.textAlign   = 'right';
                    }
                    else
                    {   textNode        = document.createTextNode(content);
                        cell.appendChild(textNode);
                    }

                    delete cell;
                }
            }
        }
    }
    catch(ex)
    {   console.log("zndDashboard:populateTable: An exception occurred:[" +ex+ "].");
    }
}



function createTableHeader(Table, map, tableName, rows)
{ try
  {   var  i, tableHeader;

      header                            = Table.createTHead();
      row                               = header.insertRow(0);
      tableHeader                       = Object.keys(map);

      for( i = tableHeader.length-1; i>=0 ; i--)
      {   cell                        = row.insertCell(0);
          let element                 = document.createTextNode(tableHeader[i]);
          cell.appendChild(element);
          element                 = document.createElement('a');
          let param               = "javascript:sortColumn(\'" + tableHeader[i] + "UP\',"+ JSON.stringify(tableName)+ ","+ JSON.stringify(map) + ","+ JSON.stringify(rows) + ");";
          element.setAttribute("href", param  );
          temp                    = document.createTextNode( '\u25B4'	);
          element.style.textDecoration   = 'none';
          element.appendChild(temp);
          cell.appendChild(element);
          element                 = document.createElement('a');
          param                   = "javascript:sortColumn(\'" + tableHeader[i] + "DOWN\',"+ JSON.stringify(tableName)+ ","+ JSON.stringify(map) + ","+ JSON.stringify(rows) + ");";
          element.setAttribute("href", param  );
          temp                    = document.createTextNode( '\u25BE'	);
          element.style.textDecoration   = 'none';
          element.appendChild(temp);
          cell.appendChild(element);
          cell.style.backgroundColor  = '#a9becc';
          cell.style.fontWeight       = 'bold';
      }
  }
  catch(ex)
  {   console.log("zndDashboard:clearTable: An exception occurred:[" + ex + "].");
  }

}



function clearTable(Table)
{   try
    {    while (Table.firstChild)
         {   Table.removeChild(Table.firstChild);
         }
    }
    catch(ex)
    {   console.log("zndDashboard:clearTable: An exception occurred:[" +ex+ "].");
    }
}



function sortRows(sortID,sortMap, rows)
{   try
    {   var header;
        const getTableHeader =(header) => sortMap[header] || 'UKNOWN';

        if( sortID.includes("UP") )
        {
            sortArray(rows, { by: getTableHeader(sortID.split("UP")[0]), order: 'desc' });
        }
        if( sortID.includes("DOWN") )
        {
            sortArray(rows, { by: getTableHeader(sortID.split("DOWN")[0]), order: 'asc' });
        }
        return rows;
    }
    catch(ex)
    {   console.log("zndDashboard:sortRows: An exception occurred:[" +ex+ "].");
    }
}



function createTable(tableName, rows, map,ledgerAccounts, companies)
{   try
    {   var tableAnchor, tableElement;

        tableAnchor                     = document.getElementById(tableName);
        tableElement                    = document.createElement('TABLE');
        clearTable(tableAnchor);
        createTableHeader(tableElement, map, tableName, rows);
        populateTable(tableElement, rows);
        tableAnchor.appendChild(tableElement);
        
        contextualizeCompanies(rows, companies);
    }
    catch(ex)
    {   console.log("zndDashboard:createTable: An exception occurred:[" + ex + "].");
    }
}



function sortColumn(kolm, tableName, map, rows )
{   try
    {   var sortedRows;
        sortedRows                      = sortRows(kolm,map, rows)
        createTable(tableName, rows, map)
    }
    catch(ex)
    {   console.log("zndDashboard:sortColumn: An exception occurred:[" +ex+ "].");
    }
}



function manageDashBoard(startDate,endDate,ledgerAccounts, companies)
{   try
    {   console.log("ledgerAccounts:["+ledgerAccounts+"];companies :["+companies+"]");
        createTable("statementRecords", mapStatements(startDate,endDate,ledgerAccounts, companies), statementMap,ledgerAccounts, companies);
    }
    catch(ex)
    {   console.log("zndDashboard:manageDashBoard: An exception occurred:[" +ex+ "].");
    }
}

function contextualizeCompanies(rows, companies)
{   try
    {   var dashcompanies, option, companyList, j, k;

        console.log(rows[rows.length-1])
        if ( typeof rows[rows.length-1].CREDEB  !== 'undefined')
        {   dashcompanies                   = document.getElementById("companies");
            companyList                     = [];

            while (dashcompanies.firstChild)
            {   dashcompanies.removeChild(dashcompanies.firstChild);
            }
            companyList.push('---');
            for ( j = 0; j < rows.length; j++)
            {   if( !companyList.includes(rows[j].compagnyID ))
                {   companyList.push(rows[j].compagnyID );
                }
            }
            companyList.sort();

            for ( k = 0; k < companyList.length; k++)
            {   option                      = document.createElement("option");
                option.value                = companyList[k];
                option.text                 = companyList[k];
                dashcompanies.add(option)
            }

            let companiesSet                = document.getElementById("companies");
            companiesSet.value              = companies;
      }
    }
    catch(ex)
    {   console.log("zndDashboard:contextualizeCompanies: An exception occurred:[" +ex+ "].");
    }
}



function setupCompanies()
{   try
    {   var dashcompanies, option, companyList, j, k;

        dashcompanies                   = document.getElementById("companies");
        companyList                     = [];

        for ( j = 0; j < tableData.length; j++)
        {   if( !companyList.includes(tableData[j].compagnyID ))
            {   companyList.push(tableData[j].compagnyID );
            }
        }
        companyList.sort();

        for ( k = 0; k < companyList.length; k++)
        {   option                      = document.createElement("option");
            option.value                = companyList[k];
            option.text                 = companyList[k];
            dashcompanies.add(option)
        }
    }
    catch(ex)
    {   console.log("zndDashboard:setupCompanies: An exception occurred:[" +ex+ "].");
    }
}



function initTable(msg,queryObj)
{   try
    {   tableData                       = msg;
        
        setupCompanies();
        manageDashBoard(0,1999999999999,'--------------------------------------------','---');
        let dashStartDate               = document.getElementById("dashStartDate");
        dashStartDate.value             = typeof queryObj.startDate !=='undefined'? queryObj.startDate :"";

        let dashEndDate                 = document.getElementById("dashEndDate");
        dashEndDate.value               = typeof queryObj.endDate !=='undefined'? queryObj.endDate :"";
        
        let companies                   = document.getElementById("companies");
        companies.value                 = typeof queryObj.companies !=='undefined'? queryObj.companies :"";
        filterOnDate(0,1999999999999);
    }
    catch(ex)
    {   console.log("zndDashboard:initTable: An exception occurred:[" +ex+ "].");
    }
}



function refreshPage()
{
   var startDate                        = document.getElementById("dashStartDate").value;
   var endDate                          = document.getElementById("dashEndDate").value;
   
   var companies                        = document.getElementById("companies").value;
   var pageString                       = window.location.href;

   var url                              = new URL(pageString);
   var urlOringin                       = new URL(url.pathname,pageString);




    startDate.length == 0 ? '' : urlOringin.searchParams.append('startDate', startDate);
    endDate.length == 0 ? '' : urlOringin.searchParams.append('endDate', endDate);    
    companies.includes('---')   ? '' : urlOringin.searchParams.append('companies', companies);
    location.href = urlOringin
}



function augmentPage()
{   var startDate                       = document.getElementById("dashStartDate").value;
    var endDate                         = document.getElementById("dashEndDate").value;    
    var companies                       = document.getElementById("companies").value;
    var pageString                      = window.location.href;
    var url                             = new URL(pageString);
    var urlOringin                      = new URL(url.pathname,pageString);

    startDate.length == 0                                                        ? '' : urlOringin.searchParams.append('startDate', startDate);
    endDate.length == 0                                                          ? '' : urlOringin.searchParams.append('endDate', endDate);    
    companies.includes('---')                                                    ? '' : urlOringin.searchParams.append('companies', companies);
    urlOringin.searchParams.append('augment', 'true');
    location.href                       = urlOringin;
}