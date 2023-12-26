var idArray; 

var path=document.getElementById("pdfFile").textContent;  		 
var ideez=document.getElementById("idlist").textContent; 
 	 
var currentID=document.getElementById("_id").textContent; 
var url="http://127.0.0.1:20070/docs/"+path;
var toggle=document.getElementById("editState").checked;
var displayRawBankData=0;
var newsBarState                            = false;

if( ideez.length >0 )
{   idArray=JSON.parse(ideez)
} 
else 
{   idArray=[];
}   



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
{ var formName = "employeeEntryForm";
  
  var elements = document.forms[formName].elements;
  var permanentOff = ["beneficiaryID", "beneficiaryStatus", "FA"];
  
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
    document.getElementById("employeeEntryForm").submit();
}
 
let dropArea = document.getElementById('statementDropArea');
let filesDone = 0;
let filesToDo = 0;


['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
   dropArea.addEventListener(eventName, preventDefaults, false)
});


['dragenter', 'dragover'].forEach(eventName => {
   dropArea.addEventListener(eventName, highlight, false)
});


['dragleave', 'drop'].forEach(eventName => {
   dropArea.addEventListener(eventName, unhighlight, false)
});



function highlight(e)
{   dropArea.classList.add('highlight')
}

function unhighlight(e)
{   dropArea.classList.remove('highlight')
}


function preventDefaults (e)
{   e.preventDefault()
    e.stopPropagation()
}

dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e)
{   let dt = e.dataTransfer
    let files = dt.files
    handleFiles(files)
}

function handleFiles(files)
{   files = [...files]
    files.forEach(uploadFile)
}


async function uploadFile(file)
{   try
    {   var  url, dbID, postURL,formData, response; 

        url                              = '/zndMngEmployees'; 
        dbID                             = document.getElementById("_id").value; 
        postURL                          = url + '/' + dbID;
        formData                         = new FormData(employeeEntryForm); 
        formData.append('docScan', file); 
        if( dbID.length > 0)
        {   formData.set('actie',"updateRecord")
        }
        else
        {   formData.set('actie',"create")
        }    
        response                            = await fetch(postURL, {   method: 'POST',
                                                                       body: formData
                                                                   });    
        window.location.href = response.url;
    } 
    catch(ex) 
    {   console.log(':statementDrop:uploadFile:An Exception occurred [' + ex + '].')
    }
}

function toggleNewsBar()
{   try
    {   var visibleBar, invisibleBar, Nbelement, Mainelement, NBB, PFB, BBB, docSwitch , invisibleBar2, ToggleBar
      
        visibleBar                      = "18vw";
        ToggleBar                      = "76vw";
        invisibleBar                    = "96vw";
        invisibleBar2                   = "82.9vw"; 
        
        
        if ( newsBarState == false ) 
        {   newsBarState                = true;
        }
        else
        {   newsBarState                = false; 
        } 
        
        if ( newsBarState == false ) 
        {   Nbelement                   = document.getElementsByClassName("newsbar");
            Nbelement[0].style.width    = visibleBar;
            Nbelement[0].style.padding  = "20px";
            
            Mainelement                 = document.getElementsByClassName("main");
            Mainelement[0].style.width  = "63vw";
            
            NBB                         = document.getElementsByClassName("newsButtonBar");
            NBB[0].style.left           = ToggleBar;
            
            PFB                         = document.getElementsByClassName("pageFlipper");       
            PFB[0].style.left           = ToggleBar;
            
            BBB                         = document.getElementsByClassName("buttonbar");
            BBB[0].style.left           = ToggleBar;
            
            docSwitch                   = document.getElementsByClassName("showdata");           
            docSwitch[0].style.display  = 'block';
            docSwitch[0].style.visibility         = 'visible';              
        }
        else
        {   Nbelement                   = document.getElementsByClassName("newsbar");
            Nbelement[0].style.width    = "0%";
            Nbelement[0].style.padding  = "0px";
            
            Mainelement                 = document.getElementsByClassName("main");
            Mainelement[0].style.width  = "63vw";
            Mainelement[0].style.width  = invisibleBar2;
            
            NBB                         = document.getElementsByClassName("newsButtonBar");
            NBB[0].style.left           = invisibleBar;
            
            PFB                         = document.getElementsByClassName("pageFlipper");
            PFB[0].style.left           = invisibleBar;
            
            BBB                         = document.getElementsByClassName("buttonbar");
            BBB[0].style.left           = invisibleBar;
            
            docSwitch                   = document.getElementsByClassName("showdata");           
            docSwitch[0].style.display  = 'none';
            docSwitch[0].style.visibility         = 'hidden';                        
        } 
    } 
    catch(ex) 
    {   console.log("An exception Occurred[" +ex + "]")   
    }
}