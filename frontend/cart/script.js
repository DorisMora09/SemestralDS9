// Estado global de la aplicación
let cartItems = [
    {
        id: 1,
        name: "Smartphone Galaxy Pro",
        price: 899.99,
        quantity: 1,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmMGYwZjAiLz4KICA8cmVjdCB4PSIyNSIgeT0iMTUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI3MCIgcng9IjUiIGZpbGw9IiMzMzMiLz4KICA8cmVjdCB4PSIzMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzAwN2NmZiIvPgogIDxjaXJjbGUgY3g9IjUwIiBjeT0iNzciIHI9IjMiIGZpbGw9IiM2NjYiLz4KPC9zdmc+",
        category: "Electrónicos"
    },
    {
        id: 2,
        name: "Auriculares Bluetooth Pro",
        price: 159.99,
        quantity: 2,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmOGY5ZmEiLz4KICA8cGF0aCBkPSJNMjAgMzBDMjAgMjAgMzAgMTUgNTAgMTVTODAgMjAgODAgMzBWNjBDODAgNzUgNjUgODUgNTAgODVTMjAgNzUgMjAgNjBWMzBaIiBmaWxsPSIjMTExODI3Ii8+CiAgPGNpcmNsZSBjeD0iMzUiIGN5PSI0NSIgcj0iOCIgZmlsbD0iIzM3NDE1MSIvPgogIDxjaXJjbGUgY3g9IjY1IiBjeT0iNDUiIHI9IjgiIGZpbGw9IiMzNzQxNTEiLz4KPC9zdmc+",
        category: "Audio"
    },
    {
        id: 3,
        name: "Laptop Gaming Ultra",
        price: 1299.99,
        quantity: 1,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmMWY1ZjkiLz4KICA8cmVjdCB4PSIxMCIgeT0iMjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI1MCIgcng9IjMiIGZpbGw9IiMyNTI1MjUiLz4KICA8cmVjdCB4PSIxNSIgeT0iMjUiIHdpZHRoPSI3MCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwNWNmZiIvPgogIDxyZWN0IHg9IjEwIiB5PSI3MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgiIHJ4PSIyIiBmaWxsPSIjMzc0MTUxIi8+Cjwvc3ZnPg==",
        category: "Computadoras"
    }
];

let appliedCoupon = null;

// Elementos del DOM
const emptyCartDiv = document.getElementById('empty-cart');
const cartContentDiv = document.getElementById('cart-content');
const cartItemsDiv = document.getElementById('cart-items');
const itemsCountSpan = document.getElementById('items-count');
const appliedCouponDiv = document.getElementById('applied-coupon');
const couponInputDiv = document.getElementById('coupon-input');
const couponCodeInput = document.getElementById('coupon-code');
const applyCouponBtn = document.getElementById('apply-coupon');
const removeCouponBtn = document.getElementById('remove-coupon');

// Elementos de resumen
const subtotalSpan = document.getElementById('subtotal');
const discountRow = document.getElementById('discount-row');
const discountSpan = document.getElementById('discount');
const shippingSpan = document.getElementById('shipping');
const freeShippingLabel = document.getElementById('free-shipping-label');
const taxSpan = document.getElementById('tax');
const totalSpan = document.getElementById('total');

// Funciones principales
function updateQuantity(id, newQuantity) {
    if (newQuantity === 0) {
        removeItem(id);
        return;
    }
    
    cartItems = cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    renderCart();
}

function removeItem(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    renderCart();
}

function applyCoupon() {
    const code = couponCodeInput.value.toLowerCase().trim();
    
    if (code === 'descuento10') {
        appliedCoupon = { code: 'DESCUENTO10', discount: 0.1 };
        couponCodeInput.value = '';
        renderCart();
    } else if (code === 'enviogratis') {
        appliedCoupon = { code: 'ENVIOGRATIS', discount: 0, freeShipping: true };
        couponCodeInput.value = '';
        renderCart();
    } else {
        alert('Código de cupón inválido');
    }
}

function removeCoupon() {
    appliedCoupon = null;
    renderCart();
}

function calculateTotals() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = appliedCoupon ? subtotal * (appliedCoupon.discount || 0) : 0;
    const shipping = appliedCoupon?.freeShipping ? 0 : 12.99;
    const tax = (subtotal - discount) * 0.08;
    const total = subtotal - discount + shipping + tax;
    
    return { subtotal, discount, shipping, tax, total };
}

function renderCartItems() {
    cartItemsDiv.innerHTML = '';
    
    cartItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-category">${item.category}</p>
                <p class="item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="flex items-center space-x-3">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-btn" onclick="removeItem(${item.id})">
                    <i class="fas fa-trash-2"></i>
                </button>
            </div>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });
}

function renderCouponSection() {
    if (appliedCoupon) {
        appliedCouponDiv.style.display = 'block';
        couponInputDiv.style.display = 'none';
        
        document.getElementById('coupon-name').textContent = `Cupón aplicado: ${appliedCoupon.code}`;
        const description = document.getElementById('coupon-description');
        
        if (appliedCoupon.freeShipping) {
            description.textContent = 'Envío gratuito aplicado';
        } else if (appliedCoupon.discount > 0) {
            description.textContent = `${(appliedCoupon.discount * 100)}% de descuento`;
        }
    } else {
        appliedCouponDiv.style.display = 'none';
        couponInputDiv.style.display = 'block';
    }
}

function renderSummary() {
    const { subtotal, discount, shipping, tax, total } = calculateTotals();
    
    subtotalSpan.textContent = `${subtotal.toFixed(2)}`;
    
    if (discount > 0) {
        discountRow.style.display = 'flex';
        discountSpan.textContent = `-${discount.toFixed(2)}`;
    } else {
        discountRow.style.display = 'none';
    }
    
    if (shipping === 0) {
        shippingSpan.textContent = 'Gratis';
        freeShippingLabel.style.display = 'inline';
    } else {
        shippingSpan.textContent = `${shipping.toFixed(2)}`;
        freeShippingLabel.style.display = 'none';
    }
    
    taxSpan.textContent = `${tax.toFixed(2)}`;
    totalSpan.textContent = `${total.toFixed(2)}`;
}

function renderCart() {
    if (cartItems.length === 0) {
        emptyCartDiv.style.display = 'block';
        cartContentDiv.style.display = 'none';
        return;
    }
    
    emptyCartDiv.style.display = 'none';
    cartContentDiv.style.display = 'block';
    
    // Actualizar contador de items
    itemsCountSpan.textContent = `${cartItems.length} artículos en tu carrito`;
    
    // Renderizar items del carrito
    renderCartItems();
    
    // Renderizar sección de cupón
    renderCouponSection();
    
    // Renderizar resumen
    renderSummary();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar carrito inicial
    renderCart();
    
    // Event listener para aplicar cupón
    applyCouponBtn.addEventListener('click', applyCoupon);
    
    // Event listener para remover cupón
    removeCouponBtn.addEventListener('click', removeCoupon);
    
    // Event listener para presionar Enter en el input del cupón
    couponCodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyCoupon();
        }
    });
});

// Funciones globales para los event handlers inline
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;