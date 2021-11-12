let CartBtn = document.querySelectorAll(".add-cart");
let products = [
   {
       name:"Adidas Black",
       tag:"adidas",
       price:40,
       inCart:0
   },
   {
       name:"Bascheti Star",
       tag:"bascheti",
       price:40,
       inCart:0
   },
   {
       name:"New Balance",
       tag:"newbalance",
       price:40,
       inCart:0
   },
   {
       name:"Nike",
       tag:"nike",
       price:40,
       inCart:0
   },
   {
       name:"Sneakers",
       tag:"sneakers",
       price:40,
       inCart:0
   },
   {
       name:"Vans",
       tag:"vans",
       price:40,
       inCart:0
   }

]
for (let i = 0; i < CartBtn.length; i++) {
    CartBtn[i].addEventListener('click', () =>{
        cartNumber(products[i]);
        totalCost(products[i]);
    })
    
}

function onLoadCartNumbers(){
    let productNumbers = localStorage.getItem('cartNumbers');
    
    if(productNumbers){
        document.querySelector('.cart span').textContent = productNumbers;
    }
}

function cartNumber(product){
    let productNumbers = localStorage.getItem('cartNumbers');

    productNumbers = parseInt(productNumbers);

    if(productNumbers){
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    }else{
        localStorage.setItem('cartNumbers',  1);
        document.querySelector('.cart span').textContent = 1;
    }
    
    setItems(product);
}
function setItems(product){
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems)
    if(cartItems != null){
        if(cartItems[product.tag] == undefined){
            cartItems = {
                ...cartItems,
                [product.tag]: product
            }
        }
        cartItems[product.tag].inCart += 1;
    } else{
        product.inCart = 1;
        cartItems ={
            [product.tag]: product
        }
    }
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

// Calculate price 
function totalCost(product){
    let cartCost = localStorage.getItem('totalCost');
    

    if(cartCost != null){
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost', cartCost + product.price)
    }else{
        localStorage.setItem('totalCost', product.price)
    }

    
}
function displayCart(){
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector('.products');
    let cartCost = localStorage.getItem('totalCost');


    if( cartItems && productContainer  ){
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
            <tr>
            <td class="product">
            <i class="fas fa-times"></i>
            <img class="shopimg" src="image/${item.tag}.jpg">
            <span>${item.name}</span>
            </td>
            <td class="price">$${item.price},00</td>
            <td class="quantity">
            <i class="fas fa-caret-left"></i>
            <span>${item.inCart}</span>
            <i class="fas fa-caret-right"></i>
            </td>
            <td class="total">$${item.inCart * item.price},00</td>
            </tr>

            `  
        })
        productContainer.innerHTML +=`
        <div class="TotalCostContainer">
        <h4 class="TotalCostTitle">Total Cost</4>
        <h4 class="TotalCost">
        $${cartCost},00
        </4>
        </div>
        `
    }
}


displayCart();
onLoadCartNumbers();