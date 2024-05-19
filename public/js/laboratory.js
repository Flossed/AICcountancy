function formulierActie(action) 
{   console.log( 'formulierActie():Started: Action ['  + action + ']');
    const updateCreationDateForm       = document.getElementById('updateCreationDateForm');
    document.getElementById( 'action' ).textContent  = action;
    updateCreationDateForm.submit();
    
}