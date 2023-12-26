/*
  File: ordersPage_Scripts.js
  Details: Scripts for oders.esj
  Author:   Daniel S. A. Khan (c) 2021
*/


var iteration=0
var dailyTrades={}

function showTable()
{   var itemList, jsonItems,itemListElement={}, listOfItems=[]
  
    table=document.getElementById("SendItems")
    jsonItems=document.getElementById("sendItemsList").textContent;  
    itemList=JSON.parse(jsonItems)
    
    for (let i =0 ; i < itemList.length; i++)
    { let now=new Date(itemList[i].recordTime)
      itemListElement.date=(now.toLocaleDateString('de-DE')) 
      itemListElement.time=(now.toLocaleTimeString('de-DE'))
      itemListElement.recordID=itemList[i].originalRecordID
       listOfItems.push(itemListElement)
       itemListElement={}
    }
    for (let element of listOfItems)
    {   let row = table.insertRow();
         for (key in element)
         {   if(key !='_id')
             {   let cell = row.insertCell();
                 let text = document.createTextNode(element[key]);                 
                 cell.appendChild(text);
             }
         }
    }
}







/* LOGS

*/