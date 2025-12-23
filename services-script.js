/* ===================================
   SERVICES PAGE - JAVASCRIPT
   ==================================== */

// Sample services data (in production, this would come from a backend API)
const servicesData = [
    {
        id: 1,
        name: "Pharmacy Website Design",
        category: "Website Design",
        icon: "fas fa-globe",
        description: "Professional website design with modern UI/UX specifically for pharmacies",
        features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Beautiful UI"],
        price: "₹25,000",
        timeline: "2-3 weeks",
        status: "Published"
    },
    {
        id: 2,
        name: "Online Medicine Store",
        category: "Website Design",
        icon: "fas fa-shopping-cart",
        description: "Complete e-commerce solution for online medicine sales",
        features: ["Product Catalog", "Payment Gateway", "Order Management", "Inventory System"],
        price: "₹45,000",
        timeline: "4-5 weeks",
        status: "Published"
    },
    {
        id: 3,
        name: "Prescription Upload Feature",
        category: "Special Features",
        icon: "fas fa-file-upload",
        description: "Add prescription upload capability to your pharmacy website",
        features: ["Secure Upload", "Digital Verification", "Prescription Storage", "Customer Portal"],
        price: "₹12,000",
        timeline: "1-2 weeks",
        status: "Published"
    },
    {
        id: 4,
        name: "Pharmacy Inventory System",
        category: "Special Features",
        icon: "fas fa-warehouse",
        description: "Complete inventory management system for your pharmacy",
        features: ["Stock Tracking", "Low Stock Alerts", "Supplier Management", "Reports"],
        price: "₹18,000",
        timeline: "2-3 weeks",
        status: "Published"
    },
    {
        id: 5,
        name: "Healthcare Landing Page",
        category: "Website Design",
        icon: "fas fa-stethoscope",
        description: "Dedicated landing page for healthcare businesses and clinics",
        features: ["Doctor Profiles", "Appointment Booking", "Service Listings", "Reviews"],
        price: "₹15,000",
        timeline: "1-2 weeks",
        status: "Published"
    },
    {
        id: 6,
        name: "Pharmacy Website Support",
        category: "Support",
        icon: "fas fa-life-ring",
        description: "Ongoing support and maintenance for your pharmacy website",
        features: ["24/7 Support", "Monthly Updates", "Security Monitoring", "Performance Optimization"],
        price: "₹5,000/month",
        timeline: "Ongoing",
        status: "Published"
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadServices('all');
    populateServiceSelect();
    setupEventListeners();
});

// Load services based on filter
function loadServices(filter = 'all') {
    const servicesGrid = document.getElementById('servicesGrid');
    servicesGrid.innerHTML = '';

    const filtered = filter === 'all' 
        ? servicesData 
        : servicesData.filter(s => s.category.toLowerCase().includes(filter.toLowerCase()));

    filtered.forEach((service, index) => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-item';
        serviceCard.style.animationDelay = `${index * 0.1}s`;
        
        serviceCard.innerHTML = `
            <div class="service-image">
                <i class="${service.icon}"></i>
            </div>
            <div class="service-content">
                <div class="service-category">${service.category}</div>
                <h3 class="service-title">${service.name}</h3>
                <p class="service-description">${service.description}</p>
                <ul class="service-features">
                    ${service.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
                <div class="service-price">${service.price}</div>
                <button class="service-cta" onclick="selectService('${service.name}')">
                    Enquire Now
                </button>
            </div>
        `;
        
        servicesGrid.appendChild(serviceCard);
    });
}

// Populate service dropdown in inquiry form
function populateServiceSelect() {
    const serviceSelect = document.getElementById('serviceName');
    servicesData.forEach(service => {
        const option = document.createElement('option');
        option.value = service.name;
        option.textContent = service.name;
        serviceSelect.appendChild(option);
    });
}

// Select service and open modal
function selectService(serviceName) {
    document.getElementById('serviceName').value = serviceName;
    document.getElementById('serviceModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    document.getElementById('serviceModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Setup filter buttons
function setupEventListeners() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Load filtered services
            const filter = this.getAttribute('data-filter');
            loadServices(filter);
        });
    });
}

// Handle inquiry form submission
document.getElementById('inquiryForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        serviceName: document.getElementById('serviceName').value,
        fullName: document.getElementById('fullName').value,
        businessName: document.getElementById('businessName').value,
        pharmacyType: document.getElementById('pharmacyType').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        city: document.getElementById('city').value,
        budget: document.getElementById('budget').value,
        features: Array.from(document.querySelectorAll('input[name="features"]:checked')).map(cb => cb.value),
        message: document.getElementById('message').value,
        timestamp: new Date().toLocaleString()
    };

    // Validate form
    if (!formData.serviceName || !formData.fullName || !formData.businessName || 
        !formData.pharmacyType || !formData.email || !formData.phone || !formData.city) {
        showNotification('Please fill all required fields', 'error');
        return;
    }

    // Save inquiry to localStorage (in production, send to backend)
    let inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    formData.id = Date.now();
    formData.status = 'New';
    inquiries.push(formData);
    localStorage.setItem('inquiries', JSON.stringify(inquiries));

    // Show success notification
    showNotification('Thank you! Your inquiry has been submitted successfully. We will contact you soon!', 'success');

    // Reset form and close modal
    document.getElementById('inquiryForm').reset();
    closeModal();

    // Log to console
    console.log('Inquiry submitted:', formData);
});

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles if not already present
    if (!document.getElementById('notification-styles-services')) {
        const style = document.createElement('style');
        style.id = 'notification-styles-services';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 1.5rem;
                border-radius: 8px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                z-index: 2000;
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

            .notification-error {
                border-left: 4px solid #ef4444;
                color: #ef4444;
            }

            .notification-success i,
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

    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Close modal when clicking outside
document.getElementById('serviceModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Prevent form submission when hitting Enter in inputs
document.getElementById('inquiryForm')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
});
