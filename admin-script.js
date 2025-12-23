/* ===================================
   ADMIN PANEL - JAVASCRIPT
   ==================================== */

// Sample admin data
let adminServices = JSON.parse(localStorage.getItem('adminServices')) || [
    {
        id: 1,
        name: "Pharmacy Website Design",
        category: "Website Design",
        icon: "fas fa-globe",
        description: "Professional website design for pharmacies",
        price: "₹25,000",
        timeline: "2-3 weeks",
        status: "Published",
        features: "Responsive Design, SEO Optimized, Fast Loading"
    },
    {
        id: 2,
        name: "Online Medicine Store",
        category: "Website Design",
        icon: "fas fa-shopping-cart",
        description: "Complete e-commerce for online medicine sales",
        price: "₹45,000",
        timeline: "4-5 weeks",
        status: "Published",
        features: "Product Catalog, Payment Gateway, Order Management"
    }
];

let adminInquiries = JSON.parse(localStorage.getItem('adminInquiries') || JSON.parse(localStorage.getItem('inquiries')) || '[]');
let categories = JSON.parse(localStorage.getItem('categories')) || ["Website Design", "Special Features", "Support"];

let currentEditingService = null;
let currentInquiry = null;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    loadInquiries();
    updateStats();
    setupMenuNavigation();
});

// ============ MENU NAVIGATION ============
function setupMenuNavigation() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            const section = this.getAttribute('data-section');
            if (section) {
                e.preventDefault();
                showSection(section);
                document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`${sectionId}-section`)?.classList.add('active');
}

// ============ SERVICES MANAGEMENT ============
function loadServices() {
    const tbody = document.getElementById('servicesTableBody');
    tbody.innerHTML = '';

    adminServices.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.name}</td>
            <td>${service.category}</td>
            <td>${service.price}</td>
            <td>${service.timeline}</td>
            <td><span class="status-badge status-${service.status.toLowerCase()}">${service.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editService(${service.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteService(${service.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    updateStats();
}

function openAddServiceModal() {
    currentEditingService = null;
    document.getElementById('serviceForm').reset();
    document.querySelector('#serviceFormModal .modal-header h2').textContent = 'Add New Service';
    document.getElementById('serviceFormModal').classList.add('active');
}

function closeServiceModal() {
    document.getElementById('serviceFormModal').classList.remove('active');
    currentEditingService = null;
}

function editService(id) {
    currentEditingService = adminServices.find(s => s.id === id);
    if (currentEditingService) {
        document.getElementById('srvName').value = currentEditingService.name;
        document.getElementById('srvCategory').value = currentEditingService.category;
        document.getElementById('srvIcon').value = currentEditingService.icon;
        document.getElementById('srvPrice').value = currentEditingService.price.replace('₹', '').replace(',', '');
        document.getElementById('srvTimeline').value = currentEditingService.timeline;
        document.getElementById('srvStatus').value = currentEditingService.status;
        document.getElementById('srvDescription').value = currentEditingService.description;
        document.getElementById('srvFeatures').value = currentEditingService.features;
        document.querySelector('#serviceFormModal .modal-header h2').textContent = 'Edit Service';
        document.getElementById('serviceFormModal').classList.add('active');
    }
}

function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        adminServices = adminServices.filter(s => s.id !== id);
        localStorage.setItem('adminServices', JSON.stringify(adminServices));
        loadServices();
        showNotification('Service deleted successfully', 'success');
    }
}

// Handle service form submission
document.getElementById('serviceForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        id: currentEditingService?.id || Date.now(),
        name: document.getElementById('srvName').value,
        category: document.getElementById('srvCategory').value,
        icon: document.getElementById('srvIcon').value,
        description: document.getElementById('srvDescription').value,
        price: '₹' + document.getElementById('srvPrice').value,
        timeline: document.getElementById('srvTimeline').value,
        status: document.getElementById('srvStatus').value,
        features: document.getElementById('srvFeatures').value
    };

    if (currentEditingService) {
        // Update existing service
        const index = adminServices.findIndex(s => s.id === currentEditingService.id);
        adminServices[index] = formData;
    } else {
        // Add new service
        adminServices.push(formData);
    }

    localStorage.setItem('adminServices', JSON.stringify(adminServices));
    loadServices();
    closeServiceModal();
    showNotification(currentEditingService ? 'Service updated successfully' : 'Service added successfully', 'success');
});

// ============ INQUIRIES MANAGEMENT ============
function loadInquiries() {
    const inquiriesList = document.getElementById('inquiriesList');
    if (!inquiriesList) return;

    inquiriesList.innerHTML = '';

    adminInquiries.forEach(inquiry => {
        const card = document.createElement('div');
        card.className = 'inquiry-card';

        card.innerHTML = `
            <div class="inquiry-card-header">
                <div class="inquiry-card-title">
                    <h4>${inquiry.fullName}</h4>
                    <p>${inquiry.businessName}</p>
                </div>
                <span class="inquiry-status status-${inquiry.status.toLowerCase().replace(' ', '-')}">${inquiry.status}</span>
            </div>

            <div class="inquiry-card-body">
                <div class="inquiry-field">
                    <strong>Service:</strong> <span>${inquiry.serviceName}</span>
                </div>
                <div class="inquiry-field">
                    <strong>Type:</strong> <span>${inquiry.pharmacyType}</span>
                </div>
                <div class="inquiry-field">
                    <strong>City:</strong> <span>${inquiry.city}</span>
                </div>
                <div class="inquiry-field">
                    <strong>Email:</strong> <span>${inquiry.email}</span>
                </div>
                <div class="inquiry-field">
                    <strong>Phone:</strong> <span>${inquiry.phone}</span>
                </div>
                <div class="inquiry-field">
                    <strong>Submitted:</strong> <span>${inquiry.timestamp}</span>
                </div>
            </div>

            <div class="inquiry-card-footer">
                <button class="inquiry-action-btn btn-view" onclick="viewInquiryDetails(${inquiry.id})">
                    <i class="fas fa-eye"></i> View Details
                </button>
                <button class="inquiry-action-btn btn-contact" onclick="contactCustomer('${inquiry.phone}', '${inquiry.email}')">
                    <i class="fas fa-phone"></i> Contact
                </button>
                <button class="inquiry-action-btn btn-update" onclick="updateInquiryStatus(${inquiry.id})">
                    <i class="fas fa-flag"></i> Update Status
                </button>
            </div>
        `;

        inquiriesList.appendChild(card);
    });

    updateStats();
}

function viewInquiryDetails(inquiryId) {
    currentInquiry = adminInquiries.find(i => i.id === inquiryId);
    if (currentInquiry) {
        const modal = document.getElementById('inquiryDetailsModal');
        const content = document.getElementById('inquiryDetailsContent');

        const featuresHtml = currentInquiry.features.map(f => `<li>${f}</li>`).join('');

        content.innerHTML = `
            <div class="detail-group">
                <h5>Customer Information</h5>
                <div class="detail-field">
                    <strong>Name:</strong>
                    <span>${currentInquiry.fullName}</span>
                </div>
                <div class="detail-field">
                    <strong>Pharmacy Name:</strong>
                    <span>${currentInquiry.businessName}</span>
                </div>
                <div class="detail-field">
                    <strong>Type:</strong>
                    <span>${currentInquiry.pharmacyType}</span>
                </div>
                <div class="detail-field">
                    <strong>City:</strong>
                    <span>${currentInquiry.city}</span>
                </div>
                <div class="detail-field">
                    <strong>Email:</strong>
                    <span>${currentInquiry.email}</span>
                </div>
                <div class="detail-field">
                    <strong>Phone:</strong>
                    <span>${currentInquiry.phone}</span>
                </div>
            </div>

            <div class="detail-group">
                <h5>Inquiry Details</h5>
                <div class="detail-field">
                    <strong>Service:</strong>
                    <span>${currentInquiry.serviceName}</span>
                </div>
                <div class="detail-field">
                    <strong>Budget:</strong>
                    <span>${currentInquiry.budget || 'Not specified'}</span>
                </div>
                <div class="detail-field">
                    <strong>Status:</strong>
                    <span>${currentInquiry.status}</span>
                </div>
                <div class="detail-field">
                    <strong>Submitted:</strong>
                    <span>${currentInquiry.timestamp}</span>
                </div>
            </div>

            <div class="detail-group">
                <h5>Required Features</h5>
                <ul style="margin: 0; padding-left: 1.5rem;">
                    ${featuresHtml || '<li>No specific features mentioned</li>'}
                </ul>
            </div>

            <div class="detail-group">
                <h5>Message</h5>
                <p style="margin: 0; color: #6b7280; line-height: 1.6;">${currentInquiry.message || 'No message provided'}</p>
            </div>

            <div class="detail-group">
                <h5>Change Status</h5>
                <select id="inquiryStatusSelect" style="width: 100%; padding: 0.8rem; border: 2px solid #e5e7eb; border-radius: 8px;">
                    <option value="New" ${currentInquiry.status === 'New' ? 'selected' : ''}>New</option>
                    <option value="Contacted" ${currentInquiry.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                    <option value="Proposal Sent" ${currentInquiry.status === 'Proposal Sent' ? 'selected' : ''}>Proposal Sent</option>
                    <option value="In Progress" ${currentInquiry.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Completed" ${currentInquiry.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
            </div>
        `;

        modal.classList.add('active');
    }
}

function closeInquiryModal() {
    document.getElementById('inquiryDetailsModal').classList.remove('active');
    currentInquiry = null;
}

function updateInquiryStatus() {
    if (!currentInquiry) return;

    const newStatus = document.getElementById('inquiryStatusSelect').value;
    const inquiry = adminInquiries.find(i => i.id === currentInquiry.id);
    if (inquiry) {
        inquiry.status = newStatus;
        localStorage.setItem('adminInquiries', JSON.stringify(adminInquiries));
        loadInquiries();
        closeInquiryModal();
        showNotification(`Inquiry status updated to "${newStatus}"`, 'success');
    }
}

function filterInquiries() {
    const status = document.getElementById('statusFilter').value;
    const filtered = status 
        ? adminInquiries.filter(i => i.status === status)
        : adminInquiries;

    const inquiriesList = document.getElementById('inquiriesList');
    inquiriesList.innerHTML = '';

    filtered.forEach(inquiry => {
        const card = document.createElement('div');
        card.className = 'inquiry-card';

        card.innerHTML = `
            <div class="inquiry-card-header">
                <div class="inquiry-card-title">
                    <h4>${inquiry.fullName}</h4>
                    <p>${inquiry.businessName}</p>
                </div>
                <span class="inquiry-status status-${inquiry.status.toLowerCase().replace(' ', '-')}">${inquiry.status}</span>
            </div>

            <div class="inquiry-card-body">
                <div class="inquiry-field">
                    <strong>Service:</strong> <span>${inquiry.serviceName}</span>
                </div>
                <div class="inquiry-field">
                    <strong>City:</strong> <span>${inquiry.city}</span>
                </div>
                <div class="inquiry-field">
                    <strong>Phone:</strong> <span>${inquiry.phone}</span>
                </div>
            </div>

            <div class="inquiry-card-footer">
                <button class="inquiry-action-btn btn-view" onclick="viewInquiryDetails(${inquiry.id})">
                    View
                </button>
            </div>
        `;

        inquiriesList.appendChild(card);
    });
}

function contactCustomer(phone, email) {
    const message = `Contact customer at:\nPhone: ${phone}\nEmail: ${email}`;
    alert(message);
    // In production, integrate with WhatsApp/Email API
}

function updateInquiryStatus(inquiryId) {
    viewInquiryDetails(inquiryId);
}

// ============ SETTINGS ============
function addCategory() {
    const input = document.getElementById('newCategory');
    const category = input.value.trim();

    if (!category) {
        showNotification('Please enter a category name', 'error');
        return;
    }

    if (!categories.includes(category)) {
        categories.push(category);
        localStorage.setItem('categories', JSON.stringify(categories));
        input.value = '';
        loadCategories();
        showNotification('Category added successfully', 'success');
    } else {
        showNotification('Category already exists', 'error');
    }
}

function loadCategories() {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;

    categoryList.innerHTML = '';

    categories.forEach(category => {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = `
            <span>${category}</span>
            <button class="remove-btn" onclick="removeCategory('${category}')" title="Remove">
                <i class="fas fa-times"></i>
            </button>
        `;
        categoryList.appendChild(item);
    });
}

function removeCategory(category) {
    if (confirm(`Remove category "${category}"?`)) {
        categories = categories.filter(c => c !== category);
        localStorage.setItem('categories', JSON.stringify(categories));
        loadCategories();
        showNotification('Category removed', 'success');
    }
}

// ============ STATISTICS ============
function updateStats() {
    document.getElementById('totalServices').textContent = adminServices.length;
    document.getElementById('totalInquiries').textContent = adminInquiries.length;
    document.getElementById('pendingInquiries').textContent = adminInquiries.filter(i => i.status === 'New').length;
    document.getElementById('completedProjects').textContent = adminInquiries.filter(i => i.status === 'Completed').length;
    document.getElementById('inquiryBadge').textContent = adminInquiries.filter(i => i.status === 'New').length;
}

// ============ NOTIFICATION FUNCTION ============
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        max-width: 350px;
        border-left: 4px solid ${type === 'success' ? '#10b981' : '#ef4444'};
        color: ${type === 'success' ? '#10b981' : '#ef4444'};
        animation: slideIn 0.3s ease-out;
    `;

    notification.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: center; font-weight: 500;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" style="font-size: 1.5rem;"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);

// Load categories on page load
loadCategories();
