// ========== VARIABLES GLOBALES ==========
let services = [];
const API_BASE_URL = 'http://localhost:3000';

// ========== FUNCIONES DE TOKEN ==========
function getAuthToken() {
    return sessionStorage.getItem('authToken');
}

function isAuthenticated() {
    const token = getAuthToken();
    return token !== null && token !== '';
}

// ========== FUNCIONES DE UI ==========
function showLoading(show = true) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = show ? 'flex' : 'none';
}

function showError(message) {
    const container = document.getElementById('servicesContainer');
    container.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <button class="retry-btn" onclick="loadServices()">Reintentar</button>
        </div>
    `;
}

function showEmptyState() {
    const container = document.getElementById('servicesContainer');
    container.innerHTML = `
        <div class="empty-state">
            <p>No hay servicios disponibles en este momento.</p>
            <button class="retry-btn" onclick="loadServices()">Actualizar</button>
        </div>
    `;
}

// ========== FUNCIONES DE API ==========
async function loadServices() {
    try {
        showLoading(true);

        const token = getAuthToken();
        const headers = {
            'Content-Type': 'application/json'
        };

        // Agregar token si existe
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/services`, {
            method: 'GET',
            headers: headers
        });

        console.log('Response status:', response);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        services = data.services || data || [];

        if (services.length === 0) {
            showEmptyState();
        } else {
            renderServices(services);
        }

    } catch (error) {
        console.error('Error loading services:', error);
        showError('Error al cargar los servicios. Verifica tu conexión e intenta nuevamente.');
    } finally {
        showLoading(false);
    }
}

// ========== FUNCIONES DE RENDER ==========
function renderServices(servicesData) {
    const container = document.getElementById('servicesContainer');

    if (!servicesData || servicesData.length === 0) {
        showEmptyState();
        return;
    }

    container.innerHTML = servicesData.map(service => createServiceCard(service)).join('');
}

function createServiceCard(service) {
    const {
        id,
        name = 'Servicio sin nombre',
        description = 'Sin descripción disponible',
        price = 0,
        duration = 'No especificado',
        rating = 0,
        category = 'Mantenimiento',
        image = null
    } = service;

    // Generar estrellas basadas en el rating
    const stars = generateStars(rating);
    const formattedPrice = parseFloat(price).toFixed(2);

    return `
        <div class="service-card">
            <div class="service-header">
                <h3>${category}</h3>
            </div>
            <div class="service-content">
                ${image ? `<img src="${image}" alt="${name}" class="service-image" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">` : ''}
                <h2 class="service-title">${name}</h2>
                <p class="service-description">${description}</p>
                
                <div class="service-details">
                    <span class="service-price">${formattedPrice}</span>
                    <span class="service-duration">${formatDuration(duration)}</span>
                </div>
                
                <div class="service-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-text">(${rating}/5)</span>
                </div>
                
                <button class="buy-btn" onclick="buyService('${id}')">Comprar</button>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) +
        (hasHalfStar ? '☆' : '') +
        '☆'.repeat(emptyStars);
}

function formatDuration(duration) {
    if (typeof duration === 'number') {
        if (duration === 1) return '1 día';
        if (duration < 7) return `${duration} días`;
        if (duration < 30) return `${Math.floor(duration / 7)} semanas`;
        return `${Math.floor(duration / 30)} meses`;
    }
    return duration || 'No especificado';
}

// ========== FUNCIONES DE VALIDACIÓN ==========
function validateAuthToken() {
    const token = getAuthToken();

    if (!token || token.trim() === '') {
        alert('Debes iniciar sesión para poder comprar servicios');
        redirectToLogin();
        return false;
    }

    return true;
}

// ========== FUNCIONES DE COMPRA ==========
async function buyService(serviceId) {
    try {
        // Validar autenticación antes de proceder
        if (!validateAuthToken()) {
            return;
        }

        showLoading(true);

        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/stripe/create/${serviceId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                redirectToLogin();
                return;
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.url) {
            // Redirigir a Stripe
            console.log('Redirigiendo a Stripe:', data.url);
            window.location.href = data.url;
        } else {
            throw new Error('No se recibió URL de pago');
        }

    } catch (error) {
        console.error('Error al procesar compra:', error);
        alert('Error al procesar la compra. Por favor, intenta nuevamente.');
    } finally {
        showLoading(false);
    }
}
// ========== FUNCIONES DE NAVEGACIÓN ==========

// ========== EVENT LISTENERS ==========
document.addEventListener('DOMContentLoaded', function () {
    // Verificar autenticación obligatoria
    if (!validateAuthToken()) {
        return; // Se redirige automáticamente al login
    }

    // Cargar servicios al iniciar
    loadServices();
});

// ========== FUNCIONES DE UTILIDAD ==========
function redirectToLogin() {
    // Limpiar token inválido si existe
    sessionStorage.removeItem('authToken');
    window.location.href = '/login';
}

function redirectToCart() {
    window.location.href = '/cart';
}

// Hacer disponibles las funciones globalmente para onclick handlers
window.buyService = buyService;
window.loadServices = loadServices;