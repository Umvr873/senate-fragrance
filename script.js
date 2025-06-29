// Senate Fragrance - Backend-Defined Images Only
let selectedSizes = {};

const products = [
    {
        id: 1,
        name: "Royal Essence",
        description: "A majestic blend of bergamot, rose, and sandalwood",
        price: 89.99,
        image: "assets/pics/perf.jpeg",
        category: "luxury",
        sizes: {
            "30ml": { price: 89.99, inStock: true },
            "50ml": { price: 129.99, inStock: true },
            "100ml": { price: 169.99, inStock: true }
       }
    },

    {
        id: 2,
        name: "Midnight Mystery",
        description: "Deep notes of oud, vanilla, and amber",
        price: 95.99,
        image: "assets/pics/perf 2.jpeg",
        category: "oriental",
        sizes: {
            "30ml": { price: 89.99, inStock: true },
            "50ml": { price: 129.99, inStock: true },
            "100ml": { price: 169.99, inStock: false }
        }
        
    },

    {
        id: 3,
        name: "Ocean Breeze",
        description: "Fresh marine accord with citrus and cedar",
        price: 79.99,
        image: "assets/pics/perf 3.jpeg",
        category: "fresh",
        sizes: {
            "30ml": { price: 89.99, inStock: true },
            "50ml": { price: 129.99, inStock: true },
            "100ml": { price: 169.99, inStock: false }
       }
    },

    {
        id: 4,
        name: "Golden Hour",
        description: "Warm blend of jasmine, honey, and musk",
        price: 87.99,
        image: "assets/pics/perf 3.jpeg",
        category: "floral",
        sizes: {
            "30ml": { price: 89.99, inStock: true },
            "50ml": { price: 129.99, inStock: true },
            "100ml": { price: 169.99, inStock: false }
       }
    },

    {
        id: 5,
        name: "Urban Legends",
        description: "Modern fusion of leather, spices, and woods",
        price: 92.99,
        image: "assets/pics/perf 4.jpeg",
        category: "woody",
        sizes: {
            "30ml": { price: 89.99, inStock: true },
            "50ml": { price: 129.99, inStock: true },
            "100ml": { price: 169.99, inStock: false }
       }
    },
    {
        id: 6,
        name: "Garden Paradise",
        description: "Floral bouquet of peony, lily, and green tea",
        price: 84.99,
        image: "assets/pics/perf 5.jpeg",
        category: "floral",
        sizes: {
            "30ml": { price: 89.99, inStock: true },
            "50ml": { price: 129.99, inStock: true },
            "100ml": { price: 169.99, inStock: false }
       }
    }
];

let cart = [];
let favorites = [];
let currentFilter = 'all';

function formatPrice(price) {
    return `₦${price.toFixed(2)}`;
}
function updateSelectedSize(productId, size) {
    selectedSizes[productId] = size;
    const btn = document.getElementById(`add-to-cart-${productId}`);
    if (btn) btn.disabled = false;
}

function renderProducts(productsToRender = products) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" />
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>

            <div class="product-sizes">
                ${Object.entries(product.sizes).map(([size, info]) => `
                    <div class="size-option">
                        <label>
                            <input type="radio" name="size-${product.id}" value="${size}" 
                                ${info.inStock ? '' : 'disabled'} 
                                onchange="updateSelectedSize(${product.id}, '${size}')">
                            ${size} - ${formatPrice(info.price)} ${info.inStock ? '' : '(Out of stock)'}
                        </label>
                    </div>
                `).join('')}
            </div>

            <div class="product-actions">
                <button id="add-to-cart-${product.id}" class="add-to-cart" onclick="addToCart(${product.id})" disabled>
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}


function filterProducts(category) {
    currentFilter = category;
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    renderProducts(filteredProducts);
    updateFilterButtons();
}

function updateFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === currentFilter);
    });
}

function searchProducts(query) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) {
        renderProducts();
        return;
    }

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    renderProducts(filteredProducts);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const selectedSize = document.querySelector(`input[name="size-${productId}"]:checked`);
    if (!selectedSize) {
        showNotification('Please select a size first!', 'error');
        return;
    }

    const size = selectedSize.value;
    const sizeInfo = product.sizes[size];

    if (!sizeInfo.inStock) {
        showNotification(`${size} of ${product.name} is out of stock!`, 'error');
        return;
    }

    const existingItem = cart.find(item => item.id === productId && item.size === size);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, size: size, price: sizeInfo.price, quantity: 1 });
    }

    updateCartUI();
    showNotification(`${product.name} (${size}) added to cart!`, 'success');
    animateCartButton();
}


function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    updateCartUI();
    showNotification('Item removed from cart', 'info');
}


function updateQuantity(productId, size, newQuantity) {
    const item = cart.find(item => item.id === productId && item.size === size);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId, size);
        } else {
            item.quantity = newQuantity;
            updateCartUI();
        }
    }
}


function clearCart() {
    cart = [];
    updateCartUI();
    showNotification('Cart cleared', 'info');
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toFixed(2);
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    cartItems.innerHTML = cart.length === 0 ? 
        '<div class="empty-cart"><p style="color: #ccc; text-align: center; padding: 2rem;">Your cart is empty</p></div>' :
        cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
                    <div>
                        <h4>${item.name} - ${item.size}</h4>
                        <p style="color: var(--leather-brown); font-weight: 600;">${formatPrice(item.price)}</p>
                    </div>
                </div>
                <div class="cart-item-controls">
                  <button onclick="updateQuantity(${item.id}, '${item.size}', ${item.quantity - 1})" class="quantity-btn minus">-</button>
                  <span class="quantity">${item.quantity}</span>
                  <button onclick="updateQuantity(${item.id}, '${item.size}', ${item.quantity + 1})" class="quantity-btn plus">+</button>
                  <button onclick="removeFromCart(${item.id}, '${item.size}')" class="remove-btn">🗑️</button>
                </div>

            </div>
        `).join('');
}

function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
    document.body.style.overflow = cartModal.style.display === 'block' ? 'hidden' : 'auto';
}

function animateCartButton() {
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.1)';
    setTimeout(() => cartIcon.style.transform = 'scale(1)', 200);
}

function toggleFavorite(productId) {
    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
        showNotification('Removed from favorites', 'info');
    } else {
        favorites.push(productId);
        showNotification('Added to favorites', 'success');
    }
    renderProducts();
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    toggleCart();       // Close cart
    toggleCheckout();   // Show checkout modal
}


function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">×</button>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Simulate order placement
    showNotification('Order placed! 🎉', 'success');
    cart = [];
    updateCartUI();
    toggleCheckout();
});


});
function toggleCheckout() {
  const modal = document.getElementById('checkout-modal');
  modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
  document.body.style.overflow = modal.style.display === 'block' ? 'hidden' : 'auto';

  // Show order summary
  const summary = document.getElementById('order-summary');
  if (summary && cart.length > 0) {
    const shippingSelect = document.getElementById('shipping-method');
    let shippingCost = 0;
    if (shippingSelect) {
      const method = shippingSelect.value;
      shippingCost = method === 'express' ? 4000 : method === 'standard' ? 2000 : 0;
    }

    const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = itemsTotal + shippingCost;

    summary.innerHTML = `
      <h4>Order Summary</h4>
      <ul>
        ${cart.map(item => `
          <li>${item.name} (${item.size}) x${item.quantity} - ${formatPrice(item.price * item.quantity)}</li>
        `).join('')}
      </ul>
      <p>Shipping: ${formatPrice(shippingCost)}</p>
      <strong>Total: ${formatPrice(finalTotal)}</strong>
    `;
  }
}

