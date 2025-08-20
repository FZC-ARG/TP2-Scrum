// Dashboard JavaScript - Funcionalidades principales
class Dashboard {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.setupEventListeners();
        this.loadUserData();
        this.setupNavigation();
        this.initializeAnimations();
    }

    checkAuthentication() {
        // Verificar si el usuario está autenticado
        const currentUser = sessionStorage.getItem('currentUser');
        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        if (!currentUser && !authToken) {
            // Usuario no autenticado, redirigir al login
            this.redirectToLogin();
            return;
        }

        if (currentUser) {
            try {
                this.currentUser = JSON.parse(currentUser);
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.redirectToLogin();
                return;
            }
        } else if (authToken) {
            try {
                const tokenData = JSON.parse(authToken);
                const tokenAge = Date.now() - tokenData.timestamp;
                const maxAge = 24 * 60 * 60 * 1000; // 24 horas

                if (tokenAge < maxAge) {
                    this.currentUser = tokenData.user;
                    // Guardar en sessionStorage para el dashboard
                    sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                } else {
                    // Token expirado
                    localStorage.removeItem('authToken');
                    sessionStorage.removeItem('authToken');
                    this.redirectToLogin();
                    return;
                }
            } catch (error) {
                console.error('Error parsing auth token:', error);
                this.redirectToLogin();
                return;
            }
        }

        // Usuario autenticado, continuar
        this.setupUserMenu();
    }

    setupEventListeners() {
        // Eventos para el menú de usuario
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserMenu();
            });
        }

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', () => {
            this.closeUserMenu();
        });

        // Eventos para los botones de acción
        this.setupActionButtons();

        // Eventos para la navegación
        this.setupNavigationEvents();
    }

    setupUserMenu() {
        const userName = document.getElementById('userName');
        const userFullName = document.getElementById('userFullName');
        const userEmail = document.getElementById('userEmail');

        if (this.currentUser) {
            if (userName) userName.textContent = this.currentUser.name;
            if (userFullName) userFullName.textContent = this.currentUser.name;
            if (userEmail) userEmail.textContent = this.currentUser.email;
        }
    }

    toggleUserMenu() {
        const dropdownMenu = document.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.classList.toggle('show');
        }
    }

    closeUserMenu() {
        const dropdownMenu = document.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.classList.remove('show');
        }
    }

    setupActionButtons() {
        // Botón Nuevo Proyecto
        const newProjectBtn = document.querySelector('.action-btn.primary');
        if (newProjectBtn) {
            newProjectBtn.addEventListener('click', () => {
                this.showActionModal('Nuevo Proyecto', 'Función de nuevo proyecto en desarrollo...');
            });
        }

        // Botón Subir Archivo
        const uploadBtn = document.querySelector('.action-btn.secondary:nth-child(2)');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                this.showActionModal('Subir Archivo', 'Función de subir archivo en desarrollo...');
            });
        }

        // Botón Descargar
        const downloadBtn = document.querySelector('.action-btn.secondary:nth-child(3)');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.showActionModal('Descargar', 'Función de descarga en desarrollo...');
            });
        }

        // Botón Compartir
        const shareBtn = document.querySelector('.action-btn.secondary:nth-child(4)');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.showActionModal('Compartir', 'Función de compartir en desarrollo...');
            });
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link);
            });
        });
    }

    setupNavigationEvents() {
        // Navegación por hash
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });

        // Navegación inicial
        this.handleHashChange();
    }

    handleNavigation(clickedLink) {
        // Remover clase active de todos los enlaces
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Agregar clase active al enlace clickeado
        clickedLink.classList.add('active');

        // Obtener el hash del enlace
        const hash = clickedLink.getAttribute('href').substring(1);
        window.location.hash = hash;
    }

    handleHashChange() {
        const hash = window.location.hash.substring(1) || 'dashboard';
        
        // Actualizar enlace activo
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${hash}`) {
                link.classList.add('active');
            }
        });

        // Mostrar contenido correspondiente
        this.showContent(hash);
    }

    showContent(section) {
        // Ocultar todas las secciones
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Mostrar sección seleccionada
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        // Actualizar título de la página
        this.updatePageTitle(section);
    }

    updatePageTitle(section) {
        const titles = {
            'dashboard': 'Dashboard - Inicio',
            'profile': 'Perfil de Usuario',
            'settings': 'Configuración',
            'help': 'Ayuda y Soporte'
        };

        if (titles[section]) {
            document.title = titles[section];
        }
    }

    loadUserData() {
        if (this.currentUser) {
            // Mostrar información del usuario
            this.displayUserInfo();
            
            // Mostrar tiempo de login
            this.displayLoginTime();
            
            // Actualizar último acceso
            this.updateLastAccess();
        }
    }

    displayUserInfo() {
        const userName = document.getElementById('userName');
        const userFullName = document.getElementById('userFullName');
        const userEmail = document.getElementById('userEmail');

        if (userName) userName.textContent = this.currentUser.name;
        if (userFullName) userFullName.textContent = this.currentUser.name;
        if (userEmail) userEmail.textContent = this.currentUser.email;
    }

    displayLoginTime() {
        const loginTimeElement = document.getElementById('loginTime');
        if (loginTimeElement) {
            const now = new Date();
            const timeString = now.toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            loginTimeElement.textContent = timeString;
        }
    }

    updateLastAccess() {
        const lastAccessElement = document.getElementById('lastAccess');
        if (lastAccessElement) {
            const now = new Date();
            const timeString = now.toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            lastAccessElement.textContent = timeString;
        }
    }

    initializeAnimations() {
        // Animación de entrada para las tarjetas
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observar todas las tarjetas del dashboard
        const cards = document.querySelectorAll('.dashboard-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }

    showActionModal(title, message) {
        // Crear modal de acción
        const modal = document.createElement('div');
        modal.className = 'action-modal-overlay';
        modal.innerHTML = `
            <div class="action-modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-btn" onclick="this.closest('.action-modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-content">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.action-modal-overlay').remove()">
                        Cerrar
                    </button>
                </div>
            </div>
        `;

        // Agregar estilos para el modal
        const style = document.createElement('style');
        style.textContent = `
            .action-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            }
            
            .action-modal {
                background: white;
                border-radius: 16px;
                max-width: 500px;
                width: 90%;
                animation: slideIn 0.3s ease;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 25px;
                border-bottom: 1px solid #e1e5e9;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #333;
                font-size: 20px;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 20px;
                color: #666;
                cursor: pointer;
                padding: 5px;
                border-radius: 5px;
                transition: all 0.3s ease;
            }
            
            .close-btn:hover {
                background: #f0f0f0;
                color: #333;
            }
            
            .modal-content {
                padding: 25px;
                text-align: center;
            }
            
            .modal-content p {
                margin: 0;
                color: #666;
                font-size: 16px;
                line-height: 1.6;
            }
            
            .modal-footer {
                padding: 20px 25px;
                border-top: 1px solid #e1e5e9;
                text-align: right;
            }
            
            .btn-secondary {
                background: #6c757d;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.3s ease;
            }
            
            .btn-secondary:hover {
                background: #5a6268;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(modal);
    }

    redirectToLogin() {
        // Limpiar datos de sesión
        sessionStorage.removeItem('currentUser');
        
        // Redirigir al login
        window.location.href = '../index.html';
    }

    // Función para cerrar sesión
    logout() {
        // Mostrar confirmación
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            // Limpiar datos de sesión
            sessionStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            
            // Redirigir al login
            window.location.href = '../index.html';
        }
    }
}

// Función global para logout (accesible desde HTML)
function logout() {
    if (window.dashboard) {
        window.dashboard.logout();
    }
}

// Inicializar dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `dashboard-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Agregar estilos para la notificación
    const style = document.createElement('style');
    style.textContent = `
        .dashboard-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            color: #333;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 3000;
            animation: slideInRight 0.3s ease;
            max-width: 350px;
        }
        
        .dashboard-notification.success {
            border-left: 4px solid #27ae60;
        }
        
        .dashboard-notification.error {
            border-left: 4px solid #e74c3c;
        }
        
        .dashboard-notification.info {
            border-left: 4px solid #3498db;
        }
        
        .dashboard-notification i {
            font-size: 18px;
        }
        
        .dashboard-notification.success i {
            color: #27ae60;
        }
        
        .dashboard-notification.error i {
            color: #e74c3c;
        }
        
        .dashboard-notification.info i {
            color: #3498db;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Ocultar notificación después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);

    // Agregar animación de salida
    const exitStyle = document.createElement('style');
    exitStyle.textContent = `
        @keyframes slideOutRight {
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(exitStyle);
}
