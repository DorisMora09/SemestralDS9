// ========== FUNCIONES DE MANEJO DE TOKEN ==========

// Función para guardar token en sessionStorage
function setAuthToken(token) {
    sessionStorage.setItem('authToken', token);
    console.log('Token guardado en sessionStorage:', token);
}

// Función para obtener token de sessionStorage
function getAuthToken() {
    return sessionStorage.getItem('authToken');
}

// Función para eliminar token de sessionStorage
function removeAuthToken() {
    sessionStorage.removeItem('authToken');
    console.log('Token eliminado de sessionStorage');
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    const token = getAuthToken();
    return token !== null && token !== '';
}

// ========== FUNCIONES DE UI ==========

function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab');
    const registroForm = document.getElementById('registroForm');
    const loginForm = document.getElementById('loginForm');

    // Remover clase active de todos los tabs
    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'registro') {
        tabs[0].classList.add('active');
        document.querySelector('.subtitle').textContent = 'Completa tus datos y comienza tu experiencia.';
        registroForm.classList.add('active');
        loginForm.classList.remove('active');
    } else {
        tabs[1].classList.add('active');
        document.querySelector('.subtitle').textContent = 'Ingresa tus credenciales para acceder.';
        loginForm.classList.add('active');
        registroForm.classList.remove('active');
    }
}

// Función para mostrar loading
function mostrarLoading(mensaje = 'Cargando...') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.textContent = mensaje;
    loadingOverlay.style.display = 'flex';
}

// Función para ocultar loading
function ocultarLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'none';
}

// Función para mostrar errores
function mostrarError(input, mensaje) {
    // Remover error anterior si existe
    ocultarError(input);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = mensaje;

    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#ef4444';
}

// Función para ocultar errores
function ocultarError(input) {
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    input.style.borderColor = '#e5e7eb';
}

// ========== FUNCIONES DE VALIDACIÓN ==========

// Función para validar formato de email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para validar contraseña fuerte
function validarContrasena(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

// ========== FUNCIONES DE API ==========

// Función para procesar el registro
async function procesarRegistro() {
    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        fecha: document.getElementById('fecha').value,
        cedula: document.getElementById('cedula').value,
        telefono: document.getElementById('telefono').value,
        pais: document.getElementById('pais').value,
        direccion: document.getElementById('direccion').value,
        password: document.getElementById('password').value
    };

    console.log('Datos de registro:', formData);

    try {
        mostrarLoading('Registrando usuario...');

        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Registro exitoso:', data);

            // Si el servidor devuelve un token, guardarlo en sessionStorage
            if (data.token) {
                setAuthToken(data.token);
            }

            alert('¡Registro exitoso! Bienvenido a Hilo&Huella');

            // Redirigir automáticamente después del registro
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);

        } else {
            console.error('Error en el registro:', data);
            alert(data.message || 'Error al registrar usuario. Intenta nuevamente.');
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        alert('Error de conexión. Verifica que el servidor esté funcionando en localhost:3000');
    } finally {
        ocultarLoading();
    }
}

// Función para procesar el login
async function procesarLogin(email, password) {
    const loginData = {
        email: email,
        password: password
    };

    console.log('Datos de login:', loginData);

    try {
        mostrarLoading('Iniciando sesión...');

        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });
        const data = await response.json();

        if (response.ok && data.token) {
            if (data.token) {
                setAuthToken(data.token);
                console.log('Token guardado en sessionStorage');
            }
            window.location.href = '../service';

        } else {
            console.error('Error en el login:', data);
            alert(data.message || 'Credenciales incorrectas');
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        alert('Error de conexión. Verifica que el servidor esté funcionando en localhost:3000');
    } finally {
        ocultarLoading();
    }
}

// ========== EVENT LISTENERS ==========

// Event listener para el formulario de registro
document.getElementById('registro').addEventListener('submit', function (e) {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // Validar que se acepten los términos y condiciones
    if (!document.getElementById('terms').checked) {
        alert('Debes aceptar los términos y condiciones');
        return;
    }

    // Procesar el registro
    procesarRegistro();
});

// Event listener para el formulario de login
document.getElementById('login').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Validar que los campos no estén vacíos
    if (!email || !password) {
        alert('Por favor completa todos los campos');
        return;
    }

    // Validar formato de email
    if (!validarEmail(email)) {
        alert('Por favor ingresa un email válido');
        return;
    }

    // Procesar el login
    procesarLogin(email, password);
});

// ========== VALIDACIONES EN TIEMPO REAL ==========

document.addEventListener('DOMContentLoaded', function () {
    // Verificar si ya está autenticado
    if (isAuthenticated()) {
        console.log('Usuario ya autenticado, token:', getAuthToken());
    }

    // Validaciones en tiempo real para el formulario de registro
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const loginEmailInput = document.getElementById('loginEmail');

    // Validar email de registro
    if (emailInput) {
        emailInput.addEventListener('blur', function () {
            if (this.value && !validarEmail(this.value)) {
                mostrarError(this, 'Email inválido');
            } else if (this.value) {
                ocultarError(this);
            }
        });
    }

    // Validar contraseña
    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            if (this.value && !validarContrasena(this.value)) {
                mostrarError(this, 'Contraseña debe tener al menos 8 caracteres, una mayúscula, minúscula y número');
            } else if (this.value) {
                ocultarError(this);
            }
        });
    }

    // Validar confirmación de contraseña
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function () {
            if (this.value && this.value !== passwordInput.value) {
                mostrarError(this, 'Las contraseñas no coinciden');
            } else if (this.value) {
                ocultarError(this);
            }
        });
    }

    // Validar email de login
    if (loginEmailInput) {
        loginEmailInput.addEventListener('blur', function () {
            if (this.value && !validarEmail(this.value)) {
                mostrarError(this, 'Email inválido');
            } else if (this.value) {
                ocultarError(this);
            }
        });
    }
});