var   dropArea, filesDone, filesToDo;

dropArea                                = document.getElementById('statementDropArea');
filesDone                               = 0;
filesToDo                               = 0;


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
{   var dt, files;

    dt                                  = e.dataTransfer
    files                               = dt.files

    handleFiles(files)
}



function handleFiles(files)
{   var files;

    files = [...files]
    files.forEach(uploadFile)
}



async function uploadFile(file)
{   try
    {   var url, formData, reponse;
        postURL                         = '/zndMngCodaFiles';
        formData                        = new FormData();

        formData.append('file', file);

        response                            = await fetch(postURL, {   method: 'POST',
                                                                       body: formData
                                                                   });
    }
    catch(ex)
    {   console.log(':zndLoadCodaFiles:uploadFile:An Exception occurred [' + ex + '].')
    }
}