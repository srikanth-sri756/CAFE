// Enhanced Features JavaScript

// Shopping Cart System
let cart = [];
let cartTotal = 0;

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
    initializeReservationSystem();
    initializeLiveChat();
    initializeWeatherWidget();
    initializeNewsletterPopup();
    initializeOrderingSystem();
    initializeLoyaltyProgram();
});

// Cart Management
function initializeCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addItemToCart);
    });
    
    quantityButtons.forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });
    
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
}

function handleQuantityChange(e) {
    const button = e.target;
    const orderItem = button.closest('.order-item');
    const quantityDisplay = orderItem.querySelector('.quantity-display');
    let currentQuantity = parseInt(quantityDisplay.textContent);
    
    if (button.classList.contains('plus')) {
        currentQuantity++;
    } else if (button.classList.contains('minus') && currentQuantity > 1) {
        currentQuantity--;
    }
    
    quantityDisplay.textContent = currentQuantity;
}

function addItemToCart(e) {
    const button = e.target;
    const orderItem = button.closest('.order-item');
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const quantity = parseInt(orderItem.querySelector('.quantity-display').textContent);
    const image = orderItem.querySelector('img').src;
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.name === name);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            name,
            price,
            quantity,
            image,
            id: Date.now()
        });
    }
    
    updateCartDisplay();
    showNotification(`${name} added to cart!`, 'success');
    
    // Add animation to cart
    const cartCount = document.querySelector('.cart-count');
    cartCount.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
    }, 200);
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.querySelector('.cart-count');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Clear cart display
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #666; margin: 2rem 0;">Your cart is empty</p>';
        cartTotalElement.style.display = 'none';
        checkoutBtn.disabled = true;
        return;
    }
    
    // Display cart items
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h5>${item.name}</h5>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">Qty: ${item.quantity}</div>
            </div>
            <button class="remove-item" data-index="${index}" style="background: none; border: none; color: #d4691a; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add remove item listeners
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('.remove-item').dataset.index);
            cart.splice(index, 1);
            updateCartDisplay();
            showNotification('Item removed from cart', 'info');
        });
    });
    
    // Calculate and display totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    cartTotalElement.style.display = 'block';
    checkoutBtn.disabled = false;
}

function handleCheckout() {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = total * 0.08;
    const finalTotal = total + tax;
    
    showNotification(`Order placed! Total: $${finalTotal.toFixed(2)}`, 'success');
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    
    // Simulate order processing
    setTimeout(() => {
        showNotification('Order confirmed! Estimated delivery: 25-30 minutes', 'success');
    }, 2000);
}

// Ordering System Enhancement
function initializeOrderingSystem() {
    // Add delivery/pickup toggle
    const orderSection = document.querySelector('.order-section .container');
    const toggleHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <div class="delivery-toggle" style="display: inline-flex; background: white; border-radius: 25px; padding: 0.5rem; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <button class="toggle-btn active" data-type="delivery">
                    <i class="fas fa-truck"></i> Delivery
                </button>
                <button class="toggle-btn" data-type="pickup">
                    <i class="fas fa-store"></i> Pickup
                </button>
            </div>
        </div>
    `;
    
    const titleElement = orderSection.querySelector('.section-subtitle');
    titleElement.insertAdjacentHTML('afterend', toggleHTML);
    
    // Add toggle functionality
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const type = e.target.dataset.type;
            const subtitle = document.querySelector('#order .section-subtitle');
            subtitle.textContent = type === 'delivery' 
                ? 'Fresh coffee and food delivered to your door or ready for pickup'
                : 'Order ahead for quick pickup at our location';
        });
    });
}

// Reservation System
function initializeReservationSystem() {
    const reservationForm = document.getElementById('reservation-form');
    
    // Set minimum date to today
    const dateInput = document.getElementById('res-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(reservationForm);
        const reservationData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            guests: formData.get('guests'),
            date: formData.get('date'),
            time: formData.get('time'),
            special: formData.get('special')
        };
        
        // Simulate reservation booking
        showNotification('Reservation request sent! We\'ll confirm within 2 hours.', 'success');
        reservationForm.reset();
        
        // Simulate confirmation email
        setTimeout(() => {
            showNotification('Reservation confirmed! Check your email for details.', 'success');
        }, 3000);
    });
}

// Live Chat System
function initializeLiveChat() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatMessages = document.getElementById('chat-messages');
    const chatInputField = document.getElementById('chat-input-field');
    const chatSend = document.getElementById('chat-send');
    
    let chatOpen = false;
    
    chatToggle.addEventListener('click', () => {
        chatOpen = !chatOpen;
        chatWindow.style.display = chatOpen ? 'flex' : 'none';
        chatToggle.innerHTML = chatOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-comments"></i>';
    });
    
    function sendMessage() {
        const message = chatInputField.value.trim();
        if (!message) return;
        
        // Add user message
        addChatMessage(message, 'user');
        chatInputField.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            addChatMessage(botResponse, 'bot');
        }, 1000);
    }
    
    chatSend.addEventListener('click', sendMessage);
    chatInputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    function addChatMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `message-${sender}`);
        messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function getBotResponse(message) {
        const responses = {
            'hours': 'We\'re open Mon-Fri: 6:00 AM - 8:00 PM, Sat-Sun: 7:00 AM - 9:00 PM',
            'menu': 'You can view our full menu in the Menu section above, or scan the QR code for our digital menu!',
            'delivery': 'We offer delivery within 5 miles. Delivery fee is $3.99 and takes 25-30 minutes.',
            'reservation': 'You can make a reservation using our online form. We\'ll confirm within 2 hours!',
            'wifi': 'Yes! We offer free WiFi. The password is "GoldenBean2024"',
            'events': 'Check out our Events section for upcoming activities like jazz nights and coffee cupping sessions!',
            'default': 'Thanks for your message! For immediate assistance, call us at (555) 123-CAFE or visit our location.'
        };
        
        const lowerMessage = message.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (key !== 'default' && lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return responses.default;
    }
}

// Weather Widget
function initializeWeatherWidget() {
    const weatherWidget = document.querySelector('.weather-widget');
    
    // Simulate weather data
    const weatherConditions = [
        { temp: '72°F', desc: 'Perfect coffee weather!', icon: '☀️' },
        { temp: '65°F', desc: 'Cozy latte weather', icon: '⛅' },
        { temp: '58°F', desc: 'Hot chocolate time!', icon: '🌧️' },
        { temp: '75°F', desc: 'Iced coffee weather', icon: '☀️' }
    ];
    
    const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    weatherWidget.querySelector('.weather-temp').textContent = randomWeather.temp;
    weatherWidget.querySelector('.weather-desc').textContent = randomWeather.desc;
    weatherWidget.querySelector('.weather-icon').textContent = randomWeather.icon;
    
    // Update weather every 30 minutes
    setInterval(() => {
        const newWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        weatherWidget.querySelector('.weather-temp').textContent = newWeather.temp;
        weatherWidget.querySelector('.weather-desc').textContent = newWeather.desc;
        weatherWidget.querySelector('.weather-icon').textContent = newWeather.icon;
    }, 30 * 60 * 1000);
}

// Newsletter Popup
function initializeNewsletterPopup() {
    const popup = document.getElementById('newsletter-popup');
    const closeBtn = document.getElementById('newsletter-close');
    const form = document.getElementById('popup-newsletter-form');
    
    // Show popup after 30 seconds
    setTimeout(() => {
        if (!localStorage.getItem('newsletter-dismissed')) {
            popup.style.display = 'flex';
        }
    }, 30000);
    
    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
        localStorage.setItem('newsletter-dismissed', 'true');
    });
    
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
            localStorage.setItem('newsletter-dismissed', 'true');
        }
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Successfully subscribed to our newsletter!', 'success');
        popup.style.display = 'none';
        localStorage.setItem('newsletter-dismissed', 'true');
    });
}

// Loyalty Program
function initializeLoyaltyProgram() {
    const joinButton = document.querySelector('.loyalty-section .btn');
    
    joinButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Simulate account creation
        showNotification('Loyalty account created! Welcome bonus: 500 points!', 'success');
        
        // Update points display
        setTimeout(() => {
            const pointsDisplay = document.querySelector('.loyalty-points');
            pointsDisplay.textContent = '1,750';
            showNotification('Bonus points added to your account!', 'success');
        }, 2000);
    });
}

// Enhanced Scroll Animations
function initializeAdvancedAnimations() {
    // Stagger animation for menu items
    const menuItems = document.querySelectorAll('.menu-item, .order-item, .event-card');
    
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    menuItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        staggerObserver.observe(item);
    });
}

// Voice Search Feature
function initializeVoiceSearch() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        // Add voice search button to menu
        const menuSection = document.querySelector('#menu .menu-tabs');
        const voiceBtn = document.createElement('button');
        voiceBtn.classList.add('tab-button');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Voice Search';
        voiceBtn.addEventListener('click', () => {
            recognition.start();
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Listening...';
        });
        
        menuSection.appendChild(voiceBtn);
        
        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            handleVoiceCommand(command);
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Voice Search';
        };
        
        recognition.onerror = () => {
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Voice Search';
            showNotification('Voice search not available', 'error');
        };
    }
}

function handleVoiceCommand(command) {
    if (command.includes('coffee') || command.includes('espresso') || command.includes('latte')) {
        document.querySelector('[data-tab="coffee"]').click();
        showNotification('Showing coffee menu', 'success');
    } else if (command.includes('food') || command.includes('sandwich') || command.includes('salad')) {
        document.querySelector('[data-tab="food"]').click();
        showNotification('Showing food menu', 'success');
    } else if (command.includes('dessert') || command.includes('cake') || command.includes('sweet')) {
        document.querySelector('[data-tab="desserts"]').click();
        showNotification('Showing desserts menu', 'success');
    } else if (command.includes('reservation') || command.includes('book') || command.includes('table')) {
        document.querySelector('a[href="#reservation"]').click();
        showNotification('Navigating to reservations', 'success');
    } else {
        showNotification('Command not recognized. Try "show coffee menu" or "make reservation"', 'info');
    }
}

// Progressive Web App Features
function initializePWAFeatures() {
    // Add to home screen prompt
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button
        const installBtn = document.createElement('button');
        installBtn.textContent = '📱 Install App';
        installBtn.classList.add('install-btn');
        installBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #d4691a;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            cursor: pointer;
            z-index: 1000;
            font-size: 0.9rem;
        `;
        
        document.body.appendChild(installBtn);
        
        installBtn.addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    showNotification('App installed successfully!', 'success');
                }
                deferredPrompt = null;
                installBtn.remove();
            });
        });
    });
}

// Accessibility Enhancements
function initializeAccessibility() {
    // Add keyboard navigation for custom elements
    document.querySelectorAll('.tab-button, .gallery-item, .menu-item').forEach(element => {
        element.setAttribute('tabindex', '0');
        element.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                element.click();
            }
        });
    });
    
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #d4691a;
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 0 0 5px 5px;
    `;
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0px';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
        
        if (loadTime > 3000) {
            console.warn('Slow page load detected');
        }
    });
    
    // Monitor memory usage (if available)
    if (performance.memory) {
        setInterval(() => {
            const memoryUsage = performance.memory.usedJSHeapSize / 1048576; // Convert to MB
            if (memoryUsage > 50) { // Alert if memory usage exceeds 50MB
                console.warn(`High memory usage: ${memoryUsage.toFixed(2)}MB`);
            }
        }, 30000);
    }
}

// Initialize all advanced features
document.addEventListener('DOMContentLoaded', () => {
    initializeAdvancedAnimations();
    initializeVoiceSearch();
    initializePWAFeatures();
    initializeAccessibility();
    initializePerformanceMonitoring();
});

// Add CSS for toggle buttons
const toggleStyles = `
    .toggle-btn {
        padding: 0.8rem 1.5rem;
        background: transparent;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #666;
        font-weight: 500;
    }
    
    .toggle-btn.active {
        background: #d4691a;
        color: white;
    }
    
    .toggle-btn:hover {
        background: #f0f0f0;
    }
    
    .toggle-btn.active:hover {
        background: #b8581a;
    }
    
    .install-btn:hover {
        background: #b8581a !important;
        transform: translateY(-2px);
    }
`;

const toggleStyleSheet = document.createElement('style');
toggleStyleSheet.textContent = toggleStyles;
document.head.appendChild(toggleStyleSheet);

console.log('Enhanced cafe features loaded successfully! 🚀');
