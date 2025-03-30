function selectID( )
{   const recorIDToSelect              =   document.getElementById("recorIDToSelect").value;
    console.log('ID Length' + recorIDToSelect.length);
    if (recorIDToSelect.length == 24 ) 
    {   const recordIDForm             =   document.getElementById("selectAnID");
        console.log('Subnmitting');
        recordIDForm.submit();
    }
}


