/* ===================================
   BIREENA MEDICO - JAVASCRIPT
   Interactive Features & Animations
   ==================================== */

// ============ DOM ELEMENTS ============
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');

// ============ MOBILE MENU TOGGLE ============
// Toggle mobile menu when hamburger icon is clicked
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    menuToggle.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// ============ SMOOTH SCROLL ENHANCEMENT ============
// Add additional smooth scroll handling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============ CONTACT FORM VALIDATION & SUBMISSION ============
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validation
    if (!name || !phone || !message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate phone number (basic validation)
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
        showNotification('Please enter a valid 10-digit phone number', 'error');
        return;
    }
    
    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // If all validations pass, show success message
    // In a real application, you would send this to a backend server
    showNotification('Thank you for contacting us! We will get back to you soon.', 'success');
    
    // Log form data (in production, send to backend)
    console.log({
        name: name,
        phone: phone,
        email: email,
        message: message,
        timestamp: new Date().toLocaleString()
    });
    
    // Reset form
    contactForm.reset();
});

// ============ NOTIFICATION FUNCTION ============
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add CSS for notification (dynamically injected)
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 1.5rem;
                border-radius: 8px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
                max-width: 350px;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 1rem;
                font-weight: 500;
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
                color: #10b981;
            }
            
            .notification-success i {
                font-size: 1.5rem;
            }
            
            .notification-error {
                border-left: 4px solid #ef4444;
                color: #ef4444;
            }
            
            .notification-error i {
                font-size: 1.5rem;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(400px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(400px);
                }
            }
            
            @media (max-width: 768px) {
                .notification {
                    top: 20px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add notification to DOM
    document.body.appendChild(notification);
    
    // Auto-remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ============ SCROLL ANIMATIONS ============
// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all service cards, reason cards, and medicine categories
document.querySelectorAll('.service-card, .reason-card, .medicine-category, .info-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============ NAVBAR BACKGROUND ON SCROLL ============
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
    }
});

// ============ ACTIVE NAV LINK ON SCROLL ============
window.addEventListener('scroll', () => {
    let current = '';
    
    // Get all sections
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ============ HOVER EFFECT FOR SERVICE CARDS ============
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ============ BUTTON RIPPLE EFFECT ============
document.querySelectorAll('.btn, .cta-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Only add ripple effect if JavaScript is handling the click
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        // Add ripple styles if not already added
        if (!document.getElementById('ripple-styles')) {
            const rippleStyle = document.createElement('style');
            rippleStyle.id = 'ripple-styles';
            rippleStyle.textContent = `
                .btn, .cta-btn {
                    position: relative;
                    overflow: hidden;
                }
                
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                }
                
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(rippleStyle);
        }
        
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ============ FORM INPUT FOCUS EFFECTS ============
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
    });
});

// Add transition for input transform
const inputStyle = document.createElement('style');
inputStyle.textContent = `
    .form-group input,
    .form-group textarea {
        transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
    }
`;
document.head.appendChild(inputStyle);

// ============ PAGE LOAD ANIMATIONS ============
window.addEventListener('load', () => {
    // Animate hero section elements
    const heroTitle = document.querySelector('.hero-text h1');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroIllustration = document.querySelector('.medicine-icon-group');
    
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.animation = 'fadeIn 0.8s ease-out 0.2s forwards';
    }
    
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.animation = 'fadeIn 0.8s ease-out 0.4s forwards';
    }
    
    if (heroButtons) {
        heroButtons.style.opacity = '0';
        heroButtons.style.animation = 'fadeIn 0.8s ease-out 0.6s forwards';
    }
    
    if (heroIllustration) {
        heroIllustration.style.opacity = '0';
        heroIllustration.style.animation = 'fadeIn 0.8s ease-out 0.3s forwards';
    }
});

// ============ UTILITY: ADD CONSOLE WELCOME MESSAGE ============
console.log('%cWelcome to Bireena Medico', 'font-size: 24px; color: #10b981; font-weight: bold;');
console.log('%cYour Trusted Pharmacy – Bireena Medico\nQuality medicines, trusted care, and quick service', 'font-size: 14px; color: #6b7280;');
console.log('%cFor support, contact us at: info@bireenamedico.com', 'font-size: 12px; color: #9ca3af;');

// ============ PRINT FORM DATA (FOR DEMO) ============
// Uncomment below to see form submissions in console (for testing purposes)
/*
console.log('%cForm submissions are logged to console (dev mode)', 'color: #10b981; font-weight: bold;');
*/
