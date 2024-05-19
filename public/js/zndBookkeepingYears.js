let idArray = [];


function loadpage ( direction )
{   let i = 0;
    const currentID = JSON.parse(document.getElementById( 'pageDataElements' ).textContent)._id;
    console.log( 'currentID :' + currentID );

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
{   console.log( 'enableForm :' + state );
    const editState                     = document.getElementById( 'editState' );
    const dataRecord                    = JSON.parse( document.getElementById( 'pageDataElements' ).textContent );
    const elements                            = document.forms['bookkeepingYears'].elements;
    const permanentOff                        = ['bookkeepingYearLabel','FA'];

    switch ( state )
    {   case 'init': editState.value  = (typeof dataRecord.editState =='undefined'? 'on' : dataRecord.editState); break;
        case 'on':   editState.value = 'on'; break;
        case 'off':  editState.value = 'off'; break;
        case 'toggle':   editState.value = editState.value.includes( 'on' ) ? 'off' : 'on'; break;
        default:  console.log( 'wierdness' );
                  break;
    }

    for ( let i = 0;i < elements.length;i++ )
    {   if ( !permanentOff.includes( elements[i].id ) )
        {   if ( !editState.value.includes( 'on' ) )
            {   elements[i].readOnly    = true;
                if ( elements[i].type.includes( 'button' ) )
                {   elements[i].style.display = 'none';
                }
                else
                {   elements[i].style.backgroundColor   = '#F8F6F3';
                }
            }
            else
            {   elements[i].readOnly    = false;
                if ( !elements[i].type.includes( 'button' ) )
                {   elements[i].style.backgroundColor   = 'white';
                }
            }
        }
    }

    if ( !state.includes( 'init' ) )
    {  formulierActie( 'updateData' );
    }
    console.log( 'editState :' +  editState.value );
}


function formulierActie ( action )
{   document.getElementById( 'action' ).value  = action;
    console.log(document.getElementById( 'action' ).value);
    document.getElementById( 'bookkeepingYears' ).submit();
}


function togglePageElements ()
{   const pageFlipperID                = document.getElementById( 'pageFlipperID' );
    const dataRecord                   = JSON.parse( document.getElementById( 'pageDataElements' ).textContent );
    const FA                           = document.getElementById( 'FA' );
    const FAU                          = document.getElementById( 'FAU' );
    const FAD                          = document.getElementById( 'FAD' );
    const formState                    = document.getElementById( 'formState' );
    const   editState                  = document.getElementById( 'editState' );

    if ( typeof dataRecord !== 'undefined' && typeof dataRecord.editState !== 'undefined' )
    {   formState.textContent          = dataRecord.editState.includes( 'on' ) ? '' : ' NOT ';
        formState.style.color          = dataRecord.editState.includes( 'on' ) ? '' : 'red';
        editState.value                = dataRecord.editState;
    }
    else
    {   formState.textContent          = '';
        editState.value                = 'on';
    }

    if ( typeof dataRecord !== 'undefined' && typeof dataRecord._id !== 'undefined' )
    {   pageFlipperID.style.display    = '';
        FA.style.display               = 'none';
        FAU.style.display              = '';
        FAD.style.display              = '';
    }
    else
    {   pageFlipperID.style.display    = 'none';
        FA.style.display               = '';
        FAU.style.display              = 'none';
        FAD.style.display              = 'none';
    }
}


function fillForm ()
{   const pageDataElements             = JSON.parse( document.getElementById( 'pageDataElements' ).textContent ) ;
    const label                        = document.getElementById( 'bookkeepingYearLabel' );
    label.value                        = pageDataElements.bookkeepingYearID + ' - ' + pageDataElements.bookkeepingYear;

    const elements                     = document.forms['bookkeepingYears'].elements;

    for ( let i = 0;i < elements.length;i++ )
    {   if ( typeof pageDataElements[elements[i].id] !== 'undefined' )
        {   elements[i].value          = pageDataElements[elements[i].id];
        }
    }
}

function init ()
{   enableForm( 'init' );
    fillForm();
    togglePageElements();
    const dataRecords = JSON.parse( document.getElementById( 'dataRecords' ).textContent );
    console.log( dataRecords );
    dataRecords.forEach( function ( record )
    {   console.log( record._id );
        idArray.push( record._id );
    } );
}
