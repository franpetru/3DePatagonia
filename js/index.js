



$(document).ready(function () {
    // Realizamos la consulta AJAX para traernos todos los datos
    $.ajax({
        url: "./json/JSONProductos.json",
        method: "GET",
        dataType: "json",
        success: response => executeAPP(response),
        error: error => console.log(error)
    })
});

// Funcion para generar una card de Bootstrap 
function generateCard(item, isCenter, withoutButton) {

    
    // isCenter: para confirmar si lo queremos centrado
    // withButton: para agregarle el botón de filtro

    // Se utiliza el operador ternario condicion ? valor__verdadero : valor__falso 
    // Es Buena práctica para generar contenido dinámico :)

    const button = `<button type="button" value="${item.id}" class="filter-btn swal2-confirm swal2-styled">Ver mas</a>`
    // Es importante que el atributo value tenga configurado el ID del producto
    // Lo vamos a usar para buscar el producto y generar el popup

    

    return `<div class="card ${isCenter ? "mx-auto" : "m-3"} mb-2" style="width: 400px">
                <img class="card-img-top" src="${item.imagenIndex}" alt="${item.nombre}" style="width: 400px;height: 400px;">
                    <div class="card-body">
                        <h5 class="card-title cardNombre">${item.nombre}</h5>
                        <p class="card-text cardPrecio">${item.precio}</p>
                        <div class="botones">
                            ${withoutButton ? button : ""}
                            <button type="button" class="size-btn swal2-cancel swal2-styled addCartBtn">Agregar al carrito</a>
                        </div>
                    </div> 
            </div>`

            
}

// Función para agregar cada elemento al contenedor HTML
function appendItems(items) {
    let htmlContent = '';
    items.forEach(item => htmlContent += `<li id="product-${item.id}" class="d-flex justify-content-center productContainerCard">${generateCard(item, true, true)}</li>`);

    $("#mainContainerId").append(htmlContent);

} 

// Función para filtrar elementos, le pasamos un array para que trabaje (opcional).
function setFilterEvent(products) {

    $(".filter-btn").click(filterFunction)
    function filterFunction(event) {
        const product = products.find(item => item.id == event.target.value);

        Swal.fire({
            html: ` <div id="popUp">
                        <div class="imagenIndex">
                            <img src="${product.imagenIndex}" alt="" width="400" height="400">
                        </div>
                        <div class="imagenSecundaria">
                            <img src="${product.imagen2}" alt="" width="250" height="250">
                            <img src="${product.imagen3}" alt="" width="250" height="250">
                        </div>
                        <h2 class="nombreItem">${product.nombre}</h2>
                        <div class="descripcionItem">
                            <h4>MATERIAL IMPRESO EN PLA</h4>
                            <h5>VARIOS COLORES DISPONIBLES</h5>
                        </div>
                        <div class="botones">
                            <button type="button" class="size-btn swal2-confirm swal2-styled compra-btn">Comprar</a>
                            <button type="button" class="size-btn swal2-cancel swal2-styled addCartBtn">Agregar al carrito</a>
                        </div>
                    </div>`,
            showCancelButton: false,
            showConfirmButton: false,
            showCloseButton: true
        });
    $(".swal2-popup").css({
        "width" : "50%"
    });
    }

}

//FUNCION PARA AGREGAR PRODUCTOS AL CARRITO
function carrito(){

    const addShoppingCartButtons = document.querySelectorAll('.addCartBtn');
        addShoppingCartButtons.forEach(addToCartBtn =>{
            addToCartBtn.addEventListener('click', addToCartClicked);
    });

    const comprarButton = document.querySelector('.comprarButton');
        comprarButton.addEventListener('click', comprarButtonClicked);

    const shoppingCartItemsContainer = document.querySelector('.shoppingCartItemsContainer');


    

    function addToCartClicked(event){
        const button = event.target;
        const itemId = button.value;
        const item = button.closest('.card');
        const itemTitle = item.querySelector('.cardNombre').textContent;
        const itemPrice = item.querySelector('.cardPrecio').textContent;
        const itemImg = item.querySelector('.card-img-top').src;
        
        addItemToShoppingCart(itemTitle, itemPrice, itemImg,itemId);
    }

    function addItemToShoppingCart(itemTitle, itemPrice, itemImg, itemId){

        const elementsTitle = shoppingCartItemsContainer.getElementsByClassName('shoppingCartItemTitle');
        for (let i = 0; i < elementsTitle.length; i++) {
            if (elementsTitle[i].innerText === itemTitle) {
                let elementQuantity = elementsTitle[i].parentElement.parentElement.parentElement.querySelector('.shoppingCartItemQuantity');
                elementQuantity.value++;
                updateShoppingCartTotal();
                return;
            }
        }

        const shoppingCartRow = document.createElement('div');
        const shoppingCartContent = `
        <div class="row shoppingCartItem">
            <div class="col-6">
                <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                    <img src='${itemImg}' class="shopping-cart-image">
                    <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${itemTitle}
                    </h6>
                </div>
            </div>
            <div class="col-2">
                <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                    <p class="item-price mb-0 shoppingCartItemPrice" id="${itemId}">${itemPrice}</p>
                </div>
            </div>
            <div class="col-4">
                <div
                    class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                    <input class="shopping-cart-quantity-input shoppingCartItemQuantity inputQuantity" type="number"
                        value="1">
                    <button class="btn btn-danger buttonDelete" type="button">X</button>
                </div>
            </div>
        </div>`;

        shoppingCartRow.innerHTML = shoppingCartContent;
        shoppingCartItemsContainer.append(shoppingCartRow);
    
        shoppingCartRow.querySelector('.buttonDelete').addEventListener('click', removeShoppingCartItem);
        shoppingCartRow.querySelector('.shoppingCartItemQuantity').addEventListener('change', quantityChanged)

        updateShoppingCartTotal();
    }
    function updateShoppingCartTotal(){
        let total = 0;
        const shoppingCartTotal = document.querySelector('.shoppingCartTotal');

        const shoppingCartItems = document.querySelectorAll('.shoppingCartItem');

        shoppingCartItems.forEach((shoppingCartItem) =>{
            const shoppingCartItemPriceElement = shoppingCartItem.querySelector('.shoppingCartItemPrice');
            const shoppingCartItemQuantityElement = shoppingCartItem.querySelector('.shoppingCartItemQuantity');

            const shoppingCartItemPrice = Number(shoppingCartItemPriceElement.textContent.replace('$',''));
            const shoppingCartItemQuantity = Number(shoppingCartItemQuantityElement.value);

            total = total + shoppingCartItemPrice * shoppingCartItemQuantity;
        });
        shoppingCartTotal.innerHTML = `$${total.toFixed(2)}`;
    }
    function removeShoppingCartItem(event){
        const buttonClickedDelete = event.target;
        buttonClickedDelete.closest('.shoppingCartItem').remove();

        updateShoppingCartTotal();

    }
    function quantityChanged(event){
        const buttonInput = event.target;
        if (buttonInput.value <= 0){
            buttonInput.value = 1
        }
        updateShoppingCartTotal();
    }
    function comprarButtonClicked() {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })
        
        swalWithBootstrapButtons.fire({
            title: 'Confirmar compra',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'COMPRAR',
            cancelButtonText: 'NO, CANCELAR',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
            swalWithBootstrapButtons.fire(
                'CONFIRMADO',
                'Tu compra se ha realizado correctamente',
                'success'
            )
            } else if (
              /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
            ) {
            swalWithBootstrapButtons.fire(
                'CANCELADO',
                'Has cancelado tu compra',
                'error'
            )
            }
        })
        
    shoppingCartItemsContainer.innerHTML = '';
    updateShoppingCartTotal();
    }
}

// Función que se ejecuta si la petición AJAX se realiza correctamente
function executeAPP(data) {

    // Guardamos los datos recibidos del JSON en nuestra variable
    const products = data;

    // Renderizamos los productos
    appendItems(products);

    carrito();
    
    // Seteamos el evento para filtrar y mostrar popup
    setFilterEvent(products);

    
}
