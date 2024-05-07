let ideez, currentID, toggle, idArray;

ideez                                   = document.getElementById( 'idlist' ).textContent;
currentID                               = document.getElementById( '_id' ).textContent;
toggle                                  = document.getElementById( 'editState' ).checked;
idArray                                 = JSON.parse( ideez );

function loadpage ( direction )
{   let i = 0;

    for ( i = 0;i < idArray.length;i++ )
    {   if ( idArray[i].includes( currentID ) )
        {   if ( direction == -1 )
            {   if ( i == 0 )
                {   window.location.href = idArray[idArray.length - 1];
                }
                else
                {   window.location.href = idArray[i - 1];
                }
            }
            else
            {   if ( i == ( idArray.length - 1 ) )
                {   window.location.href = idArray[0];
                }
                else
                {   window.location.href = idArray[i + 1];
                }
            }
        }
    }
}



function enableForm ( state )
{   let formName, elements, permanentOff;

    formName                            = 'entreeForm';
    elements                            = document.forms[formName].elements;
    permanentOff                        = ['ledgerLabel','FA'];

    try
    {   if ( state.includes( 'off' ) )
        {   toggle                      = true;
        }
        else
        {   if ( state.includes( 'on' ) )
            {   toggle                  = false;
            }
            else
            {   if ( state.includes( 'init' ) )
                {   toggle                = document.getElementById( 'editState' ).checked;
                }
                else
                {   toggle               = !toggle;
                }
            }
        }
        document.getElementById( 'editState' ).checked = toggle;
        for ( let i = 0;i < elements.length;i++ )
        {   if ( !permanentOff.includes( elements[i].id ) )
            {   elements[i].readOnly    = toggle;
                if ( toggle == true )
                {   if ( elements[i].type.includes( 'button' ) )
                    {   elements[i].style.display = 'none';
                    }
                    else
                    {   elements[i].style.backgroundColor   = '#F8F6F3';
                    }
                }
                else
                {   if ( !elements[i].type.includes( 'button' ) )
                    {   elements[i].style.backgroundColor   = 'white';
                    }
                }
            }
        }
        if ( !state.includes( 'init' ) )
        {  formulierActie( 'updateRecord' );
        }
    }
    catch ( ex )
    { console.log( 'An exception Occurred[' + ex + ']' );
    }
}



function formulierActie ( action )
{   document.getElementById( 'action' ).textContent  = action;
    document.getElementById( 'bookkeepingYears' ).submit();
}
