// Loading animation
document.addEventListener('DOMContentLoaded', function() {
    const loading = document.querySelector('.loading');
    
    // Hide loading animation after page loads
    window.addEventListener('load', function() {
        setTimeout(function() {
            loading.classList.add('hidden');
        }, 500);
    });
});

// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in the UI
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Add item to cart
function addToCart(productName, price) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        // Increment quantity if item exists
        existingItem.quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show feedback to user
    showNotification(`${productName} added to cart!`);
}

// Show notification to user
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--accent-color);
        color: var(--dark-color);
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: bold;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Display cart items in the modal
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total-amount');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotalElement.textContent = '0.00';
        return;
    }
    
    let cartHTML = '<div class="cart-items-list">';
    let total = 0;
    
    cart.forEach(item => {
        // Extract numeric price (remove $ sign)
        const price = parseFloat(item.price.replace('$', ''));
        const itemTotal = price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Price: ${item.price}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-name="${item.name}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-name="${item.name}">+</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    <p>Total: $${itemTotal.toFixed(2)}</p>
                    <button class="remove-item" data-name="${item.name}">Remove</button>
                </div>
            </div>
        `;
    });
    
    cartHTML += '</div>';
    cartItemsContainer.innerHTML = cartHTML;
    cartTotalElement.textContent = total.toFixed(2);
    
    // Add event listeners for quantity buttons and remove buttons
    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemName = btn.getAttribute('data-name');
            updateItemQuantity(itemName, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemName = btn.getAttribute('data-name');
            updateItemQuantity(itemName, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemName = btn.getAttribute('data-name');
            removeItemFromCart(itemName);
        });
    });
}

// Update item quantity in cart
function updateItemQuantity(itemName, change) {
    const item = cart.find(item => item.name === itemName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            // Remove item if quantity is 0 or less
            cart = cart.filter(item => item.name !== itemName);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
    }
}

// Remove item from cart
function removeItemFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
    showNotification(`${itemName} removed from cart!`);
}

// Show cart modal
function showCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.remove('hidden');
        displayCartItems();
    }
}

// Hide cart modal
function hideCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.add('hidden');
    }
}

// Set up event listeners for all "Add to Cart" buttons
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = button.closest('.product');
            const productName = product.querySelector('.product-info h3').textContent;
            const price = product.querySelector('.product-info p').textContent;
            
            addToCart(productName, price);
        });
    });
    
    // Cart link in header
    const cartLink = document.querySelector('.cart a');
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            showCart();
        });
    }
    
    // Close cart modal
    const closeCartBtn = document.querySelector('.close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', hideCart);
    }
    
    // Close cart when clicking outside
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                hideCart();
            }
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length > 0) {
                // Redirect to checkout page
                window.location.href = 'checkout.html';
            } else {
                showNotification('Your cart is empty!');
            }
        });
    }
});
