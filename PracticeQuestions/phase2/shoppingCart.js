let cart = [];
function addToCart(item) {
    let product ={name: item, price: Math.floor(Math.random() * 100) + 1};
    cart.push(product);
    console.log(item + " added to cart.", "Price: $" + product.price);
}

function viewCart() {
    if (cart.length === 0) {
        console.log("Your cart is empty.");
    } else {
        console.log("Your cart contains:");
        cart.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - $${product.price}`);
        });
    }
}

function getTotal() {
    let total = cart.reduce((sum, product) => sum + product.price, 0);
    console.log("Total price: $" + total);
}

addToCart("Laptop");
addToCart("Phone");
viewCart();
getTotal();