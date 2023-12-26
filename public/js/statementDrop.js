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

        url                              = '/zndMngStatements'; 
        dbID                             = document.getElementById("_id").value; 
        postURL                          = url + '/' + dbID;
        formData                         = new FormData(ledgerEntryForm); 
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