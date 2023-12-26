var ideez=document.getElementById("idlist").textContent;
var currentID=document.getElementById("_id").textContent;
var toggle=document.getElementById("editState").checked;

var idArray=JSON.parse(ideez)

function loadpage(direction)
{    var i=0;

     for (i=0;i<idArray.length;i++)
        { if (idArray[i].includes(currentID))
          { console.log("Direction is:[" + direction + "]: iterator is [" + i + "] arrayelement is:[" + idArray[i] + "].")
            if (direction == -1)
            {  if( i==0)
               {   window.location.href = idArray[idArray.length-1];
               }
               else
               {  window.location.href = idArray[i-1]
               }
            }
            else
            { if( i == (idArray.length-1))
              {   window.location.href = idArray[0];
              }
              else
              {   window.location.href = idArray[i+1];
              }
            }
          }
        }
}


function enableForm(state)
{ var formName = "manageEmailAddresses";

  var elements = document.forms[formName].elements;
  var permanentOff = ["FA"];

  //for(let i=0; i < elements.length; i++)       console.log(elements[i])
  try {
  //console.log("State of form enablement: ["+ state+"]; toggle is [" +toggle+"].");
  if (state.includes('off'))
  { toggle=true;
    //console.log("Executed:["+ state+"]: toggle is [" +toggle+"].");

  }
  else
  { if (state.includes('on'))
    { toggle=false;
      //console.log("Executed:["+ state+"]: toggle is [" +toggle+"].");

    }
    else
    {  if (state.includes('init'))
       {  toggle=document.getElementById("editState").checked;
          //console.log("Executed:["+ state+"]: toggle is [" +toggle+"].");
       }
       else
       {  //console.log("Current:["+ state+"]: toggle is [" +toggle+"].");
          toggle = !toggle
          //console.log("Executed:["+ state+"]: toggle is [" +toggle+"].");
       }
    }
  }

  document.getElementById("editState").checked=toggle;
  for(let i=0;i<elements.length;i++)
  { //console.log(elements[i].id)
    if( !permanentOff.includes(elements[i].id))
    { elements[i].readOnly=toggle;
      if (toggle == true)
      { if (elements[i].type.includes('button')) elements[i].style.display="none"
        else elements[i].style.backgroundColor="#F8F6F3"
      }
      else
      {  if (!elements[i].type.includes('button')) elements[i].style.backgroundColor="white"
      }
    }
  }
  if (!state.includes('init')){  formulierActie("updateRecord") }
  }
  catch(ex)
  { console.log("An exception Occurred[" +ex + "]")
  }
}


function formulierActie(action)
{   var  docActie=document.getElementById("actie").textContent;
    console.log(action);
    document.getElementById("actie").textContent=action;
    document.getElementById("manageEmailAddresses").submit();
}

      