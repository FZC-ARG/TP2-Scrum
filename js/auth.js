// Sistema de Autenticación - Login
class AuthSystem {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.users = [
            { email: 'admin@test.com', password: 'admin123', name: 'Administrador' },
            { email: 'usuario@test.com', password: 'user123', name: 'Usuario Test' },
            { email: 'dante@test.com', password: 'dante123', name: 'Dante' }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.setupPasswordToggle();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        // Evento de envío del formulario
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Validación en tiempo real del email
        emailInput.addEventListener('blur', () => {
            this.validateEmail(emailInput.value);
        });

        // Validación en tiempo real de la contraseña
        passwordInput.addEventListener('blur', () => {
            this.validatePassword(passwordInput.value);
        });

        // Limpiar errores al escribir
        emailInput.addEventListener('input', () => {
            this.clearError('emailError');
            this.removeErrorClass(emailInput);
        });

        passwordInput.addEventListener('input', () => {
            this.clearError('passwordError');
            this.removeErrorClass(passwordInput);
        });
    }

    setupPasswordToggle() {
        const toggleBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = toggleBtn.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }

    validateEmail(email) {
        const emailError = document.getElementById('emailError');
        const emailInput = document.getElementById('email');
        
        if (!email) {
            this.showError('emailError', 'El correo electrónico es requerido');
            this.addErrorClass(emailInput);
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('emailError', 'Formato de correo electrónico inválido');
            this.addErrorClass(emailInput);
            return false;
        }

        this.clearError('emailError');
        this.removeErrorClass(emailInput);
        return true;
    }

    validatePassword(password) {
        const passwordError = document.getElementById('passwordError');
        const passwordInput = document.getElementById('password');
        
        if (!password) {
            this.showError('passwordError', 'La contraseña es requerida');
            this.addErrorClass(passwordInput);
            return false;
        }

        if (password.length < 6) {
            this.showError('passwordError', 'La contraseña debe tener al menos 6 caracteres');
            this.addErrorClass(passwordInput);
            return false;
        }

        this.clearError('passwordError');
        this.removeErrorClass(passwordInput);
        return true;
    }

    addErrorClass(input) {
        input.classList.add('error');
    }

    removeErrorClass(input) {
        input.classList.remove('error');
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    async handleLogin() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validar campos
        if (!this.validateEmail(email) || !this.validatePassword(password)) {
            this.showNotification('Por favor, corrige los errores en el formulario', 'error');
            return;
        }

        // Mostrar estado de carga
        this.setLoadingState(true);

        try {
            // Simular delay de red
            await this.simulateNetworkDelay();

            // Validar credenciales
            const user = this.authenticateUser(email, password);

            if (user) {
                // Login exitoso
                this.loginSuccess(user, rememberMe);
            } else {
                // Credenciales inválidas
                this.loginError('Correo electrónico o contraseña incorrectos');
            }
        } catch (error) {
            this.loginError('Error de conexión. Intenta nuevamente.');
        } finally {
            this.setLoadingState(false);
        }
    }

    authenticateUser(email, password) {
        return this.users.find(user => 
            user.email.toLowerCase() === email.toLowerCase() && 
            user.password === password
        );
    }

    loginSuccess(user, rememberMe) {
        this.isAuthenticated = true;
        this.currentUser = user;

        // Guardar en localStorage si se marcó "recordar sesión"
        if (rememberMe) {
            localStorage.setItem('authToken', JSON.stringify({
                user: user,
                timestamp: Date.now()
            }));
        } else {
            sessionStorage.setItem('authToken', JSON.stringify({
                user: user,
                timestamp: Date.now()
            }));
        }

        // Mostrar notificación de éxito
        this.showNotification('¡Inicio de sesión exitoso! Redirigiendo...', 'success');

        // Redirigir después de un breve delay
        setTimeout(() => {
            this.redirectToDashboard();
        }, 2000);
    }

    loginError(message) {
        this.showNotification(message, 'error');
        
        // Limpiar contraseña
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }

    setLoadingState(loading) {
        const loginBtn = document.getElementById('loginBtn');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (loading) {
            loginBtn.classList.add('loading');
            emailInput.disabled = true;
            passwordInput.disabled = true;
        } else {
            loginBtn.classList.remove('loading');
            emailInput.disabled = false;
            passwordInput.disabled = false;
        }
    }

    showNotification(message, type) {
        const notification = document.getElementById(`${type}Notification`);
        const messageSpan = notification.querySelector('span');
        
        if (type === 'error') {
            messageSpan.textContent = message;
        }

        notification.classList.add('show');

        // Ocultar notificación después de 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    redirectToDashboard() {
        // Guardar información del usuario en sessionStorage para la página principal
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // Redirigir a la página principal
        window.location.href = 'pages/dashboard.html';
    }

    checkAuthStatus() {
        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        if (authToken) {
            try {
                const tokenData = JSON.parse(authToken);
                const tokenAge = Date.now() - tokenData.timestamp;
                const maxAge = 24 * 60 * 60 * 1000; // 24 horas

                if (tokenAge < maxAge) {
                    // Token válido, redirigir al dashboard
                    this.isAuthenticated = true;
                    this.currentUser = tokenData.user;
                    this.redirectToDashboard();
                } else {
                    // Token expirado, limpiar
                    localStorage.removeItem('authToken');
                    sessionStorage.removeItem('authToken');
                }
            } catch (error) {
                // Token inválido, limpiar
                localStorage.removeItem('authToken');
                sessionStorage.removeItem('authToken');
            }
        }
    }

    async simulateNetworkDelay() {
        return new Promise(resolve => {
            setTimeout(resolve, 1000 + Math.random() * 1000);
        });
    }

    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('currentUser');
        
        window.location.href = '../index.html';
    }
}

// Inicializar el sistema de autenticación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// Función global para logout (accesible desde otras páginas)
function logout() {
    if (window.authSystem) {
        window.authSystem.logout();
    }
}
