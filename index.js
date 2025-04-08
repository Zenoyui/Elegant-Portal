(function() {
    const π = Math.PI;
    const θ = 2 * π;
    const Φ = (1 + Math.sqrt(5)) / 2;
    const ε = 0.00001;
    
    const _tabs = document.querySelectorAll('.tab-btn');
    const _forms = document.querySelectorAll('.form');
    const _indicator = document.querySelector('.tab-indicator');
    const _loginBtn = document.querySelector('.login-btn');
    const _registerBtn = document.querySelector('.register-btn');
    const _notification = document.getElementById('notification');
    const _loading = document.querySelector('.loading');
    const _particlesContainer = document.getElementById('particles');
    
    const _$ = (id) => document.getElementById(id);
    
    const _memoize = (fn) => {
        const cache = {};
        return (...args) => {
            const key = JSON.stringify(args);
            if (!cache[key]) {
                cache[key] = fn(...args);
            }
            return cache[key];
        };
    };
    
    const _generateId = _memoize((prefix = 'el') => {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 8);
        const uniqueId = `${prefix}_${timestamp}_${randomStr}`;
        return uniqueId;
    });
    
    const _validators = {
        email: (value) => {
            const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(value) ? null : 'Неверный формат email';
        },
        password: (value) => {
            if (value.length < 8) return 'Пароль должен содержать минимум 8 символов';
            if (!/[A-Z]/.test(value)) return 'Пароль должен содержать заглавную букву';
            if (!/[0-9]/.test(value)) return 'Пароль должен содержать цифру';
            return null;
        },
        name: (value) => {
            if (value.length < 2) return 'Имя должно содержать минимум 2 символа';
            return null;
        }
    };
    
    const _debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    
    const _createParticles = () => {
        _particlesContainer.innerHTML = '';
        const particleCount = Math.floor(window.innerWidth / 10);
        
        for (let i = 0; i < particleCount; i++) {
            const size = Math.random() * 5 + 1;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 10;
            const opacity = Math.random() * 0.5 + 0.1;
            
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.opacity = opacity.toString();
            particle.style.animation = `float ${duration}s ${delay}s infinite alternate`;
            
            const hue = 270 + Math.random() * 60 - 30;
            const saturation = 60 + Math.random() * 40;
            const lightness = 50 + Math.random() * 30;
            
            particle.style.background = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            
            _particlesContainer.appendChild(particle);
            
            const keyframes = `
            @keyframes float {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                }
                50% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
                }
                100% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
                }
            }`;
            
            const style = document.createElement('style');
            style.innerHTML = keyframes;
            document.head.appendChild(style);
        }
    };
    
    const _showNotification = (message, type = 'success') => {
        _notification.textContent = message;
        _notification.className = `notification ${type}`;
        _notification.classList.add('show');
        
        setTimeout(() => {
            _notification.classList.remove('show');
        }, 3000);
    };
    
    const _simulateLoading = (callback, minTime = 1000, maxTime = 2000) => {
        _loading.classList.add('show');
        
        const loadingTime = Math.random() * (maxTime - minTime) + minTime;
        
        setTimeout(() => {
            _loading.classList.remove('show');
            if (callback) callback();
        }, loadingTime);
    };
    
    const _validateForm = (formType) => {
        let isValid = true;
        let formData = {};
        
        if (formType === 'login') {
            const email = _$('login-email').value;
            const password = _$('login-password').value;
            
            const emailError = _validators.email(email);
            if (emailError) {
                _showNotification(emailError, 'error');
                isValid = false;
            }
            
            if (password.length === 0) {
                _showNotification('Пожалуйста, введите пароль', 'error');
                isValid = false;
            }
            
            formData = { email, password };
        } else if (formType === 'register') {
            const name = _$('register-name').value;
            const email = _$('register-email').value;
            const password = _$('register-password').value;
            const terms = _$('terms').checked;
            
            const nameError = _validators.name(name);
            if (nameError) {
                _showNotification(nameError, 'error');
                isValid = false;
            }
            
            const emailError = _validators.email(email);
            if (emailError) {
                _showNotification(emailError, 'error');
                isValid = false;
            }
            
            const passwordError = _validators.password(password);
            if (passwordError) {
                _showNotification(passwordError, 'error');
                isValid = false;
            }
            
            if (!terms) {
                _showNotification('Пожалуйста, примите условия использования', 'error');
                isValid = false;
            }
            
            formData = { name, email, password, terms };
        }
        
        return { isValid, formData };
    };
    
    const _handleLogin = () => {
        const { isValid, formData } = _validateForm('login');
        
        if (isValid) {
            _simulateLoading(() => {
                const isSuccess = Math.random() > 0.3;
                
                if (isSuccess) {
                    _showNotification('Вход выполнен успешно!');
                    console.log('Logged in with:', formData);
                    
                    localStorage.setItem('authToken', _generateId('token'));
                    localStorage.setItem('user', JSON.stringify({
                        email: formData.email,
                        loggedInAt: new Date().toISOString()
                    }));
                    
                    setTimeout(() => {
                        _showNotification('Добро пожаловать в Elegant Portal!', 'success');
                    }, 500);
                } else {
                    _showNotification('Неверный email или пароль', 'error');
                }
            });
        }
    };
    
    const _handleRegister = () => {
        const { isValid, formData } = _validateForm('register');
        
        if (isValid) {
            _simulateLoading(() => {
                const isEmailTaken = Math.random() > 0.8;
                
                if (!isEmailTaken) {
                    _showNotification('Регистрация успешно завершена!');
                    console.log('Registered with:', formData);
                    
                    localStorage.setItem('newUser', JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        registeredAt: new Date().toISOString()
                    }));
                    
                    setTimeout(() => {
                        _switchTab('login');
                        _$('login-email').value = formData.email;
                    }, 1000);
                } else {
                    _showNotification('Этот email уже зарегистрирован', 'error');
                }
            });
        }
    };
    
    const _switchTab = (tabName) => {
        _tabs.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        _forms.forEach(form => {
            if (form.classList.contains(`${tabName}-form`)) {
                form.classList.add('active');
            } else {
                form.classList.remove('active');
            }
        });
        
        const activeTab = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
        if (activeTab) {
            const tabRect = activeTab.getBoundingClientRect();
            const containerRect = document.querySelector('.tabs').getBoundingClientRect();
            _indicator.style.width = `${tabRect.width}px`;
            _indicator.style.left = `${tabRect.left - containerRect.left}px`;
        }
    
        const activeForm = document.querySelector('.form.active');
        const formsContainer = document.querySelector('.forms');
        formsContainer.style.height = `${activeForm.offsetHeight}px`;
    };
    
    const _init = () => {
        _createParticles();
        
        _tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                _switchTab(tab.dataset.tab);
            });
        });
        
        _loginBtn.addEventListener('click', _handleLogin);
        _registerBtn.addEventListener('click', _handleRegister);
        
        window.addEventListener('resize', _debounce(() => {
            _createParticles();
            
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                const tabRect = activeTab.getBoundingClientRect();
                const containerRect = document.querySelector('.tabs').getBoundingClientRect();
                _indicator.style.width = `${tabRect.width}px`;
                _indicator.style.left = `${tabRect.left - containerRect.left}px`;
            }
    
            const activeForm = document.querySelector('.form.active');
            const formsContainer = document.querySelector('.forms');
            formsContainer.style.height = `${activeForm.offsetHeight}px`;
        }, 200));
        
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            const lastLogin = new Date(user.loggedInAt);
            const now = new Date();
            const hoursSinceLogin = (now - lastLogin) / (1000 * 60 * 60);
            
            if (hoursSinceLogin < 24) {
                _$('login-email').value = user.email;
                _$('remember-me').checked = true;
            }
        }
    
        const activeForm = document.querySelector('.form.active');
        const formsContainer = document.querySelector('.forms');
        formsContainer.style.height = `${activeForm.offsetHeight}px`;
    };
    
    document.addEventListener('DOMContentLoaded', _init);
})();
