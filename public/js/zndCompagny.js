var path                                = document.getElementById("pdfFile").textContent;
var ideez                               = document.getElementById("idlist").textContent;
var currentID                           = document.getElementById("_id").textContent;

var url                                 = "http://127.0.0.1:20070/docs/" + path;
var toggle                              = document.getElementById("editState").checked;
var displayRawBankData                  = 0;
var newsBarState; 
newsBarState                            = false;


toggleNewsBar()



function loadpage(direction)
{   var i;
    var idArray                             = JSON.parse(ideez)
    for (i=0;i<idArray.length;i++)
    {   if (idArray[i].includes(currentID))
        {   if (direction == -1)
            {   if( i==0)
                {   window.location.href = idArray[idArray.length-1];
                }
                else
                {   window.location.href = idArray[i-1]
                }
            }
            else
            {   if( i == (idArray.length-1))
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
{   try 
    {   var formName, elements,permanentOff; 
          
        formName                        = "manageAffiliatedCompagny";  
        elements                        = document.forms[formName].elements;
        permanentOff                    = ["beneficiaryID", "beneficiaryStatus", "FA"];  
        
        if (state.includes('off'))     
        {   toggle                      = true; 
        } 
        else
        {   if (state.includes('on')) 
            {   toggle                  = false;
            } 
            else
            {  if (state.includes('init'))
               {   toggle               = document.getElementById("editState").checked;          
               } 
               else
               {   toggle               = !toggle;
               } 
            }
        } 
        document.getElementById("editState").checked        = toggle;
        for(let i=0;i<elements.length;i++)
        {   if( !permanentOff.includes(elements[i].id))
            {   elements[i].readOnly    = toggle;
                if (toggle == true)
                {   if (elements[i].type.includes('button')) 
                    {   elements[i].style.display           = "none"
                    } 
                    else
                    {   elements[i].style.backgroundColor   = "#F8F6F3"
                    } 
                } 
                else 
                {  if (!elements[i].type.includes('button')) 
                   {   elements[i].style.backgroundColor    = "white"
                   } 
                } 
            } 
        } 
        if (!state.includes('init'))
        {  formulierActie("updateRecord") 
        }
  } 
  catch(ex)
  { console.log("An exception Occurred[" +ex + "]")
  }
}

/*
function printPDFFuntion()
{   var doc                             = new jsPDF();          
    var elementHandler                  = {  '#ignorePDF': function (element, renderer) {   return true;}};
    var source = window.document.getElementsByTagName("body")[0];
    
    doc.fromHTML(  source, 15, 15, { 'width': 180,'elementHandlers': elementHandler});
    doc.output("dataurlnewwindow");
}  */   


function formulierActie(action)
{   var  docActie; 
  
    docActie                            = document.getElementById("actie").textContent;
    document.getElementById("actie").textContent  = action;
    
    console.log(action)
    
    if( action.includes("printPDF") ) 
    {   console.log("Printing the PDF")
    }  
    else
    {   document.getElementById("manageAffiliatedCompagny").submit();
    } 
}

let dropArea = document.getElementById('statementDropAreaComp');
let filesDone = 0;
let filesToDo = 0;


['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
   dropArea.addEventListener(eventName, preventDefaults, false)
   console.log("Whoehjahahahah")
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

        url                              = '/zndMngCompagny'; 
        dbID                             = document.getElementById("_id").value; 
        postURL                          = url + '/' + dbID;
        formData                         = new FormData(manageAffiliatedCompagny); 
        formData.append('docScan', file); 
        console.log("Cruelwelllele")
        if( dbID.length > 0)
        {   formData.set('actie',"updateRecord")
        }
        else
        {   formData.set('actie',"create")
            console.log("Bludgening")
        }    
        response                            = await fetch(postURL, {   method: 'POST',
                                                                       body: formData
                                                                   });    
        window.location.href = response.url;
    } 
    catch(ex) 
    {   console.log(':statementDropComp:uploadFile:An Exception occurred [' + ex + '].')
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