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
{
  dropArea.classList.add('highlight')
}

function unhighlight(e) 
{
  dropArea.classList.remove('highlight')
}


function preventDefaults (e) 
{
  e.preventDefault()
  e.stopPropagation()
}

dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) 
{
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}

function handleFiles(files) 
{
  files = [...files]        
  files.forEach(uploadFile)
}



function uploadFile(file) 
{
   let url = '/manageCodaFiles'
   let formData = new FormData()

   formData.append('file', file)

   fetch(url, {
      method: 'POST',
      body: formData
   })
   .then(() => { /* Error. Inform the user */ })          
   .catch(() => { /* Error. Inform the user */ })
}