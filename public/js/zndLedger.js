var filterState,filterCrit;

function filterData()
{   if (filterCrit.includes('ALL') ) 
    {   window.location.href = "/zndLedger?filterCrit=NEW";    
    } 
    else
    {  window.location.href = "/zndLedger?filterCrit=ALL";
    }
}



function setSwitch()
{  var currentState; 
    
   currentState = (filterCrit.includes("NEW") ? true: false );
   
   console.log(currentState);
   document.getElementById("filterState").checked = currentState;
} 


filterCrit                                =  $(location).attr('href'); 
console.log(filterCrit)
setSwitch()






