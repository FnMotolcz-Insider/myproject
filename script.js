// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in the UI
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
}

// Add item to cart
function addToCart(productName, price) {
    cart.push({
        name: productName,
        price: price,
        quantity: 1
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show feedback to user
    alert(`${productName} added to cart!`);
}

// Set up event listeners for all "Add to Cart" buttons
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.parentElement;
            const productName = product.querySelector('h3').textContent;
            const price = product.querySelector('p').textContent;
            
            addToCart(productName, price);
        });
    });
});
