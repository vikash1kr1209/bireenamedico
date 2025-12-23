/* ===================================
   INQUIRY DASHBOARD - JAVASCRIPT
   ==================================== */

let allInquiries = [];
let currentViewingInquiry = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadInquiries();
    setupEventListeners();
    updateStats();
});

// Load inquiries from localStorage
function loadInquiries() {
    const inquiries = JSON.parse(localStorage.getItem('adminInquiries')) || 
                      JSON.parse(localStorage.getItem('inquiries')) || [];
    
    allInquiries = inquiries;
    displayInquiries(allInquiries);
    updateStats();
}

// Display inquiries on dashboard
function displayInquiries(inquiries) {
    const container = document.getElementById('inquiriesContainer');
    container.innerHTML = '';

    if (inquiries.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; background: white; border-radius: 12px;">
                <i class="fas fa-inbox" style="font-size: 3rem; color: #d1d5db; margin-bottom: 1rem;"></i>
                <p style="color: #6b7280; font-size: 1.1rem;">No inquiries found</p>
            </div>
        `;
        return;
    }

    inquiries.forEach((inquiry, index) => {
        const card = document.createElement('div');
        card.className = `inquiry-item ${inquiry.status.toLowerCase().replace(' ', '-')}`;
        card.style.animationDelay = `${index * 0.1}s`;

        const statusClass = getStatusClass(inquiry.status);

        card.innerHTML = `
            <div class="inquiry-item-header">
                <div class="inquiry-customer">
                    <h4>${inquiry.fullName}</h4>
                    <p>${inquiry.businessName} • ${inquiry.pharmacyType}</p>
                </div>
                <span class="inquiry-status-badge ${statusClass}">${inquiry.status}</span>
            </div>

            <div class="inquiry-item-body">
                <div class="inquiry-detail">
                    <strong>Service</strong>
                    <span>${inquiry.serviceName || 'Not specified'}</span>
                </div>
                <div class="inquiry-detail">
                    <strong>Location</strong>
                    <span>${inquiry.city}</span>
                </div>
                <div class="inquiry-detail">
                    <strong>Contact</strong>
                    <span>${inquiry.phone}</span>
                </div>
                <div class="inquiry-detail">
                    <strong>Budget</strong>
                    <span>${inquiry.budget || 'Not specified'}</span>
                </div>
                <div class="inquiry-detail">
                    <strong>Submitted</strong>
                    <span>${inquiry.timestamp || new Date().toLocaleString()}</span>
                </div>
                <div class="inquiry-detail">
                    <strong>Features</strong>
                    <span>${inquiry.features?.length > 0 ? inquiry.features.length + ' selected' : 'None'}</span>
                </div>
            </div>

            <div class="inquiry-item-footer">
                <button class="inquiry-action-btn btn-view" onclick="viewInquiryDetails(${inquiry.id})">
                    <i class="fas fa-eye"></i> View Details
                </button>
                <button class="inquiry-action-btn btn-contact" onclick="contactCustomer('${inquiry.phone}', '${inquiry.email}', '${inquiry.fullName}')">
                    <i class="fas fa-phone"></i> Call
                </button>
                <button class="inquiry-action-btn btn-proposal" onclick="sendProposal(${inquiry.id})">
                    <i class="fas fa-file-alt"></i> Send Proposal
                </button>
                <button class="inquiry-action-btn btn-update" onclick="updateStatus(${inquiry.id})">
                    <i class="fas fa-edit"></i> Update Status
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

// Get status badge class
function getStatusClass(status) {
    const statusMap = {
        'New': 'badge-new',
        'Contacted': 'badge-contacted',
        'Proposal Sent': 'badge-proposal',
        'In Progress': 'badge-in-progress',
        'Completed': 'badge-completed'
    };
    return statusMap[status] || 'badge-new';
}

// View inquiry details
function viewInquiryDetails(inquiryId) {
    currentViewingInquiry = allInquiries.find(i => i.id === inquiryId);
    
    if (!currentViewingInquiry) return;

    const modal = document.getElementById('inquiryModal');
    const body = document.getElementById('inquiryModalBody');

    const featuresHtml = currentViewingInquiry.features && currentViewingInquiry.features.length > 0
        ? currentViewingInquiry.features.map(f => `<span style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 0.4rem 0.8rem; border-radius: 20px; margin-right: 0.5rem; margin-bottom: 0.5rem;">${f}</span>`).join('')
        : '<span style="color: #9ca3af;">No features specified</span>';

    body.innerHTML = `
        <div class="detail-section">
            <h5>Customer Information</h5>
            <div class="detail-row">
                <strong>Full Name:</strong>
                <span>${currentViewingInquiry.fullName}</span>
            </div>
            <div class="detail-row">
                <strong>Pharmacy Name:</strong>
                <span>${currentViewingInquiry.businessName}</span>
            </div>
            <div class="detail-row">
                <strong>Pharmacy Type:</strong>
                <span>${currentViewingInquiry.pharmacyType}</span>
            </div>
            <div class="detail-row">
                <strong>City:</strong>
                <span>${currentViewingInquiry.city}</span>
            </div>
            <div class="detail-row">
                <strong>Email:</strong>
                <span><a href="mailto:${currentViewingInquiry.email}" style="color: #10b981;">${currentViewingInquiry.email}</a></span>
            </div>
            <div class="detail-row">
                <strong>Phone:</strong>
                <span><a href="tel:${currentViewingInquiry.phone}" style="color: #10b981;">${currentViewingInquiry.phone}</a></span>
            </div>
        </div>

        <div class="detail-section">
            <h5>Inquiry Details</h5>
            <div class="detail-row">
                <strong>Service Requested:</strong>
                <span>${currentViewingInquiry.serviceName || 'Not specified'}</span>
            </div>
            <div class="detail-row">
                <strong>Budget Range:</strong>
                <span>${currentViewingInquiry.budget || 'Not specified'}</span>
            </div>
            <div class="detail-row">
                <strong>Current Status:</strong>
                <span><span class="inquiry-status-badge ${getStatusClass(currentViewingInquiry.status)}">${currentViewingInquiry.status}</span></span>
            </div>
            <div class="detail-row">
                <strong>Submitted Date:</strong>
                <span>${currentViewingInquiry.timestamp || 'N/A'}</span>
            </div>
        </div>

        <div class="detail-section">
            <h5>Required Features</h5>
            <div>${featuresHtml}</div>
        </div>

        <div class="detail-section">
            <h5>Message / Requirements</h5>
            <p style="margin: 0; padding: 1rem; background: #f9fafb; border-radius: 8px; color: #6b7280; line-height: 1.6;">
                ${currentViewingInquiry.message || 'No additional message provided'}
            </p>
        </div>

        <div class="detail-section">
            <h5>Update Status</h5>
            <select id="statusSelect" style="width: 100%; padding: 0.8rem; border: 2px solid #e5e7eb; border-radius: 8px; font-family: inherit;">
                <option value="New" ${currentViewingInquiry.status === 'New' ? 'selected' : ''}>New</option>
                <option value="Contacted" ${currentViewingInquiry.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                <option value="Proposal Sent" ${currentViewingInquiry.status === 'Proposal Sent' ? 'selected' : ''}>Proposal Sent</option>
                <option value="In Progress" ${currentViewingInquiry.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Completed" ${currentViewingInquiry.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
        </div>
    `;

    modal.classList.add('active');
}

// Close inquiry modal
function closeInquiryDetail() {
    document.getElementById('inquiryModal').classList.remove('active');
    currentViewingInquiry = null;
}

// Show reply panel
function showReplyPanel() {
    if (!currentViewingInquiry) return;

    closeInquiryDetail();

    const modal = document.getElementById('replyPanelModal');
    document.getElementById('replyTo').textContent = currentViewingInquiry.fullName;
    document.getElementById('replyEmail').textContent = currentViewingInquiry.email;
    document.getElementById('replyPhone').textContent = currentViewingInquiry.phone;

    modal.classList.add('active');
}

// Close reply panel
function closeReplyPanel() {
    document.getElementById('replyPanelModal').classList.remove('active');
    document.getElementById('replyForm').reset();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInquiry')?.addEventListener('input', function(e) {
        const term = e.target.value.toLowerCase();
        const filtered = allInquiries.filter(i =>
            i.fullName.toLowerCase().includes(term) ||
            i.businessName.toLowerCase().includes(term) ||
            i.email.toLowerCase().includes(term)
        );
        displayInquiries(filtered);
    });

    // Status filter
    document.getElementById('statusFilterInquiry')?.addEventListener('change', function(e) {
        const status = e.target.value;
        const filtered = status
            ? allInquiries.filter(i => i.status === status)
            : allInquiries;
        displayInquiries(filtered);
    });

    // Service filter
    document.getElementById('serviceFilterInquiry')?.addEventListener('change', function(e) {
        const service = e.target.value;
        const filtered = service
            ? allInquiries.filter(i => i.serviceName === service)
            : allInquiries;
        displayInquiries(filtered);
    });

    // Reply form submission
    document.getElementById('replyForm')?.addEventListener('submit', function(e) {
        e.preventDefault();

        const subject = document.getElementById('replySubject').value;
        const message = document.getElementById('replyMessage').value;
        const sendEmail = document.getElementById('replyEmail').checked;
        const sendSMS = document.getElementById('replySMS').checked;

        if (!subject || !message) {
            showNotification('Please fill in subject and message', 'error');
            return;
        }

        // Update inquiry status to "Contacted"
        if (currentViewingInquiry) {
            const inquiry = allInquiries.find(i => i.id === currentViewingInquiry.id);
            if (inquiry && inquiry.status === 'New') {
                inquiry.status = 'Contacted';
                localStorage.setItem('adminInquiries', JSON.stringify(allInquiries));
            }
        }

        // Log the reply (in production, send to backend)
        console.log({
            to: currentViewingInquiry.fullName,
            email: currentViewingInquiry.email,
            phone: currentViewingInquiry.phone,
            subject: subject,
            message: message,
            sendEmail: sendEmail,
            sendSMS: sendSMS
        });

        closeReplyPanel();
        loadInquiries();
        showNotification('Reply sent successfully!', 'success');
    });
}

// Contact customer
function contactCustomer(phone, email, name) {
    const message = `Contact ${name}?\n\nPhone: ${phone}\nEmail: ${email}`;
    if (confirm(message)) {
        showNotification(`Contacting ${name}...`, 'success');
        // In production, integrate with WhatsApp API
    }
}

// Send proposal
function sendProposal(inquiryId) {
    const inquiry = allInquiries.find(i => i.id === inquiryId);
    if (inquiry) {
        inquiry.status = 'Proposal Sent';
        localStorage.setItem('adminInquiries', JSON.stringify(allInquiries));
        loadInquiries();
        showNotification('Proposal marked as sent to ' + inquiry.fullName, 'success');
    }
}

// Update status
function updateStatus(inquiryId) {
    viewInquiryDetails(inquiryId);
    
    // Override the modal footer button behavior
    const modal = document.getElementById('inquiryModal');
    const updateBtn = modal.querySelector('.modal-footer .btn-primary');
    
    if (updateBtn) {
        updateBtn.onclick = function() {
            const newStatus = document.getElementById('statusSelect').value;
            const inquiry = allInquiries.find(i => i.id === inquiryId);
            
            if (inquiry) {
                inquiry.status = newStatus;
                localStorage.setItem('adminInquiries', JSON.stringify(allInquiries));
                closeInquiryDetail();
                loadInquiries();
                showNotification(`Status updated to "${newStatus}"`, 'success');
            }
        };
    }
}

// Update statistics
function updateStats() {
    const total = allInquiries.length;
    const newInq = allInquiries.filter(i => i.status === 'New').length;
    const contacted = allInquiries.filter(i => i.status === 'Contacted').length;
    const proposal = allInquiries.filter(i => i.status === 'Proposal Sent').length;
    const inProgress = allInquiries.filter(i => i.status === 'In Progress').length;
    const completed = allInquiries.filter(i => i.status === 'Completed').length;

    document.getElementById('totalInquiriesCount').textContent = total;
    document.getElementById('newInquiriesCount').textContent = newInq;
    document.getElementById('contactedCount').textContent = contacted;
    document.getElementById('proposalCount').textContent = proposal;
    document.getElementById('inProgressCount').textContent = inProgress;
    document.getElementById('completedCount').textContent = completed;
}

// Export inquiries
function exportInquiries() {
    let csv = 'Name,Pharmacy,Type,Service,City,Phone,Email,Status,Budget,Submitted\n';

    allInquiries.forEach(inquiry => {
        csv += `"${inquiry.fullName}","${inquiry.businessName}","${inquiry.pharmacyType}","${inquiry.serviceName}","${inquiry.city}","${inquiry.phone}","${inquiry.email}","${inquiry.status}","${inquiry.budget}","${inquiry.timestamp}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inquiries-' + new Date().toISOString().split('T')[0] + '.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('Inquiries exported successfully', 'success');
}

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
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
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
    `;

    notification.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: center;">
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
