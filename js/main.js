// Funcionalidades adicionales y mejoras de UX
document.addEventListener('DOMContentLoaded', () => {
    // Mejoras de accesibilidad
    setupAccessibility();
    
    // Efectos visuales adicionales
    setupVisualEffects();
    
    // Manejo de teclas
    setupKeyboardNavigation();
    
    // Auto-focus en el primer campo
    autoFocusFirstField();
});

function setupAccessibility() {
    // Agregar atributos ARIA para mejor accesibilidad
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    
    if (emailInput) {
        emailInput.setAttribute('aria-describedby', 'emailError');
        emailInput.setAttribute('aria-required', 'true');
    }
    
    if (passwordInput) {
        passwordInput.setAttribute('aria-describedby', 'passwordError');
        passwordInput.setAttribute('aria-required', 'true');
    }
    
    if (loginBtn) {
        loginBtn.setAttribute('aria-live', 'polite');
    }
}

function setupVisualEffects() {
    // Efecto de partículas en el fondo (opcional)
    createParticleEffect();
    
    // Animación de entrada para los elementos del formulario
    animateFormElements();
}

function createParticleEffect() {
    // Crear efecto de partículas flotantes en el fondo
    const particleCount = 20;
    const container = document.querySelector('.container');
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: float 6s ease-in-out infinite;
            animation-delay: ${i * 0.3}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        container.appendChild(particle);
    }
    
    // Agregar CSS para la animación de partículas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
        }
    `;
    document.head.appendChild(style);
}

function animateFormElements() {
    const formElements = document.querySelectorAll('.form-group, .login-btn, .login-footer');
    
    formElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
}

function setupKeyboardNavigation() {
    // Navegación con Tab
    const focusableElements = document.querySelectorAll('input, button, a, select, textarea');
    
    focusableElements.forEach(element => {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && element.tagName === 'INPUT') {
                e.preventDefault();
                const nextElement = element.nextElementSibling;
                if (nextElement && nextElement.tagName === 'INPUT') {
                    nextElement.focus();
                } else {
                    document.getElementById('password').focus();
                }
            }
        });
    });
    
    // Atajo de teclado para login (Ctrl + Enter)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn && !loginBtn.disabled) {
                loginBtn.click();
            }
        }
    });
}

function autoFocusFirstField() {
    // Auto-focus en el campo de email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        setTimeout(() => {
            emailInput.focus();
        }, 500);
    }
}

// Función para mostrar/ocultar contraseña con teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') return; // No interferir con navegación por Tab
    
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    
    if (e.target === passwordInput && e.key === 'Enter') {
        e.preventDefault();
        // Simular click en el botón de login
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
});

// Mejora de UX: Mostrar fortaleza de contraseña
function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthIndicator(strength);
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
}

function updatePasswordStrengthIndicator(strength) {
    // Implementar indicador visual de fortaleza de contraseña
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;
    
    // Remover clases anteriores
    passwordInput.classList.remove('password-weak', 'password-medium', 'password-strong');
    
    // Agregar clase correspondiente
    if (strength === 'weak') {
        passwordInput.classList.add('password-weak');
    } else if (strength === 'medium') {
        passwordInput.classList.add('password-medium');
    } else if (strength === 'strong') {
        passwordInput.classList.add('password-strong');
    }
}

// Función para limpiar formulario
function clearForm() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.reset();
        
        // Limpiar errores
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        document.querySelectorAll('.form-group input').forEach(input => {
            input.classList.remove('error');
        });
        
        // Focus en el primer campo
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.focus();
        }
    }
}

// Función para mostrar información de ayuda
function showHelp() {
    const helpInfo = `
        <div class="help-modal">
            <h3>Información de Acceso</h3>
            <p><strong>Usuarios de prueba:</strong></p>
            <ul>
                <li><strong>Admin:</strong> admin@test.com / admin123</li>
                <li><strong>Usuario:</strong> usuario@test.com / user123</li>
                <li><strong>Dante:</strong> dante@test.com / dante123</li>
            </ul>
            <button onclick="closeHelp()">Cerrar</button>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = helpInfo;
    modal.className = 'help-overlay';
    document.body.appendChild(modal);
    
    // Agregar estilos para el modal
    const style = document.createElement('style');
    style.textContent = `
        .help-overlay {
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
        }
        
        .help-modal {
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            text-align: center;
        }
        
        .help-modal h3 {
            color: #333;
            margin-bottom: 20px;
        }
        
        .help-modal ul {
            text-align: left;
            margin: 20px 0;
        }
        
        .help-modal button {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
}

function closeHelp() {
    const overlay = document.querySelector('.help-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Inicializar funcionalidades adicionales
document.addEventListener('DOMContentLoaded', () => {
    setupPasswordStrength();
    
    // Agregar botón de ayuda (opcional)
    const helpBtn = document.createElement('button');
    helpBtn.innerHTML = '<i class="fas fa-question-circle"></i>';
    helpBtn.className = 'help-btn';
    helpBtn.onclick = showHelp;
    helpBtn.title = 'Mostrar ayuda';
    
    // Agregar estilos para el botón de ayuda
    const style = document.createElement('style');
    style.textContent = `
        .help-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        
        .help-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(helpBtn);
});
