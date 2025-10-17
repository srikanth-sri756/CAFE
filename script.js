// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const contactForm = document.getElementById('contactForm');

// Navigation functionality
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    });
});

// Prevent body scroll when mobile menu is open
hamburger.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'auto';
    } else {
        document.body.style.overflow = 'hidden';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Menu tabs functionality
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Animated counter for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current).toLocaleString();
        
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        }
    }, 16);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate stats counters when they come into view
            if (entry.target.classList.contains('stat-number')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to elements that should animate
    const animatedElements = document.querySelectorAll(
        '.feature-card, .menu-item, .testimonial-card, .gallery-item, .contact-item, .about-text, .about-image'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Observe stat numbers
    document.querySelectorAll('.stat-number').forEach(stat => {
        observer.observe(stat);
    });
});

// Gallery modal functionality
const galleryItems = document.querySelectorAll('.gallery-item');
let currentImageIndex = 0;

function createModal() {
    const modal = document.createElement('div');
    modal.classList.add('gallery-modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img class="modal-image" src="" alt="">
            <div class="modal-nav">
                <button class="prev-btn"><i class="fas fa-chevron-left"></i></button>
                <button class="next-btn"><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

// Add modal styles
const modalStyles = `
    .gallery-modal {
        display: none;
        position: fixed;
        z-index: 2000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
        position: relative;
        margin: auto;
        padding: 20px;
        width: 90%;
        max-width: 800px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    
    .modal-image {
        max-width: 100%;
        max-height: 80%;
        object-fit: contain;
        border-radius: 10px;
    }
    
    .close-modal {
        position: absolute;
        top: 20px;
        right: 30px;
        font-size: 40px;
        font-weight: bold;
        color: white;
        cursor: pointer;
        z-index: 2001;
    }
    
    .close-modal:hover {
        opacity: 0.7;
    }
    
    .modal-nav {
        margin-top: 20px;
        display: flex;
        gap: 20px;
    }
    
    .prev-btn, .next-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        padding: 10px 15px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        transition: background 0.3s ease;
    }
    
    .prev-btn:hover, .next-btn:hover {
        background: rgba(255, 255, 255, 0.4);
    }
`;

// Add modal styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);

// Gallery modal functionality
let modal = null;
const galleryImages = Array.from(galleryItems).map(item => item.querySelector('img').src);

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (!modal) {
            modal = createModal();
        }
        
        currentImageIndex = index;
        showModal();
    });
});

function showModal() {
    if (!modal) return;
    
    const modalImage = modal.querySelector('.modal-image');
    modalImage.src = galleryImages[currentImageIndex];
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.prev-btn').addEventListener('click', prevImage);
    modal.querySelector('.next-btn').addEventListener('click', nextImage);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function closeModal() {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    modal.querySelector('.modal-image').src = galleryImages[currentImageIndex];
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    modal.querySelector('.modal-image').src = galleryImages[currentImageIndex];
}

// Keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    if (modal && modal.style.display === 'block') {
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    }
});

// Contact form handling
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        contactForm.reset();
    });
}

// Newsletter form handling
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (!email) {
            showNotification('Please enter your email address', 'error');
            return;
        }
        
        showNotification('Welcome to our community! Thanks for subscribing!', 'success');
        newsletterForm.reset();
    });
}

// Grand Opening Banner Auto-hide
setTimeout(() => {
    const banner = document.querySelector('.opening-banner');
    if (banner) {
        banner.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            banner.style.display = 'none';
        }, 500);
    }
}, 15000); // Hide after 15 seconds

// Special Offers Animation
document.addEventListener('DOMContentLoaded', () => {
    const offerCards = document.querySelectorAll('.offer-card');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const offerObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    entry.target.style.opacity = '1';
                }, index * 200);
            }
        });
    }, observerOptions);
    
    offerCards.forEach(card => {
        card.style.transform = 'translateY(30px) scale(0.9)';
        card.style.opacity = '0';
        card.style.transition = 'all 0.6s ease';
        offerObserver.observe(card);
    });
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Add notification animations
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

const notificationStyleSheet = document.createElement('style');
notificationStyleSheet.textContent = notificationStyles;
document.head.appendChild(notificationStyleSheet);

// Scroll to top functionality
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.classList.add('scroll-to-top');
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #d4691a;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        font-size: 18px;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.background = '#b8581a';
        scrollBtn.style.transform = 'translateY(-3px)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.background = '#d4691a';
        scrollBtn.style.transform = 'translateY(0)';
    });
}

// Initialize scroll to top button
createScrollToTopButton();

// Preloader
function createPreloader() {
    const preloader = document.createElement('div');
    preloader.classList.add('preloader');
    preloader.innerHTML = `
        <div class="preloader-content">
            <i class="fas fa-coffee"></i>
            <div class="loading-text">Golden Bean</div>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        </div>
    `;
    
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    const preloaderStyles = `
        .preloader-content {
            text-align: center;
        }
        
        .preloader i {
            font-size: 3rem;
            color: #d4691a;
            margin-bottom: 1rem;
            animation: pulse 2s infinite;
        }
        
        .loading-text {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            color: #2c1810;
            margin-bottom: 1rem;
        }
        
        .loading-bar {
            width: 200px;
            height: 4px;
            background: #f0f0f0;
            border-radius: 2px;
            overflow: hidden;
        }
        
        .loading-progress {
            height: 100%;
            background: #d4691a;
            width: 0%;
            animation: loading 3s ease-in-out;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
        }
    `;
    
    const preloaderStyleSheet = document.createElement('style');
    preloaderStyleSheet.textContent = preloaderStyles;
    document.head.appendChild(preloaderStyleSheet);
    
    document.body.appendChild(preloader);
    
    // Hide preloader after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.remove();
                }
            }, 500);
        }, 1000);
    });
}

// Initialize preloader
document.addEventListener('DOMContentLoaded', createPreloader);

// Performance optimization - Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add loading state for buttons
function addButtonLoadingState() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('loading')) return;
            
            this.classList.add('loading');
            const originalText = this.textContent;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            // Remove loading state after 2 seconds (simulate processing)
            setTimeout(() => {
                this.classList.remove('loading');
                this.textContent = originalText;
            }, 2000);
        });
    });
}

// Initialize button loading states
document.addEventListener('DOMContentLoaded', addButtonLoadingState);

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Add smooth reveal animation for sections
const revealElements = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease';
    revealObserver.observe(el);
});

// Mobile-specific enhancements
function initializeMobileFeatures() {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        
        // Add touch feedback for buttons
        const buttons = document.querySelectorAll('.btn, .tab-button, .gallery-item');
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            btn.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
        
        // Optimize images for mobile
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
        });
        
        // Add swipe gestures for gallery
        initializeSwipeGesture();
        
        // Mobile-specific menu behavior
        const menuTabs = document.querySelector('.menu-tabs');
        if (menuTabs) {
            // Add scroll indicators for menu tabs
            menuTabs.style.position = 'relative';
        }
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            window.scrollTo(0, 0);
            // Recalculate heights after orientation change
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.height = window.innerHeight + 'px';
            }
        }, 100);
    });
    
    // Improve scroll performance on mobile
    let ticking = false;
    function updateScrollElements() {
        // Update navbar
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = window.scrollY > 50 ? '0' : '1';
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    });
}

// Swipe gesture for gallery
function initializeSwipeGesture() {
    let startX, startY, endX, endY;
    
    const gallery = document.querySelector('.gallery-grid');
    if (!gallery) return;
    
    gallery.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    gallery.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Check if it's a horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            // Add visual feedback for swipe
            gallery.style.transform = diffX > 0 ? 'translateX(-10px)' : 'translateX(10px)';
            setTimeout(() => {
                gallery.style.transform = '';
            }, 200);
        }
    });
}

// Mobile menu improvements
function enhanceMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    // Add slide animation classes
    navMenu.style.transition = 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Improve hamburger animation
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        
        // Add hamburger animation
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });
}

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileFeatures();
    enhanceMobileMenu();
});

// Add mobile-specific CSS
const mobileStyles = `
    .mobile-device .btn:active {
        transform: scale(0.95);
        transition: transform 0.1s ease;
    }
    
    .mobile-device .gallery-item:active {
        transform: scale(0.98);
    }
    
    .mobile-device .menu-item:active {
        transform: scale(0.98);
    }
    
    /* Smooth scrolling for iOS */
    .mobile-device {
        -webkit-overflow-scrolling: touch;
    }
    
    /* Hide scrollbars on mobile */
    .mobile-device .menu-tabs::-webkit-scrollbar {
        display: none;
    }
    
    /* Better touch targets */
    .mobile-device .nav-link {
        min-height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    /* Prevent zoom on input focus */
    .mobile-device input[type="text"],
    .mobile-device input[type="email"],
    .mobile-device input[type="tel"],
    .mobile-device textarea,
    .mobile-device select {
        font-size: 16px !important;
    }
`;

const mobileStyleSheet = document.createElement('style');
mobileStyleSheet.textContent = mobileStyles;
document.head.appendChild(mobileStyleSheet);

console.log('Golden Bean Cafe website loaded successfully! ☕ Mobile optimized!');
