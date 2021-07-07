const tiendaBtnNavToggle = document.querySelector('.carritoNav')
const tiendaDiv = document.querySelector('.carritoDiv')

$( ".carritoNav" ).click(function() {
    $( ".carritoDiv" ).toggle( "slow", function() {
      // Animation complete.
    });
});