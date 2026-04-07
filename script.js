// WHITEFOX Vendor Reports - JavaScript Functionality

class VendorReportManager {
    constructor() {
        this.initializeEventListeners();
        this.loadSampleData();
    }

    initializeEventListeners() {
        // Admin panel controls
        document.addEventListener('keydown', (e) => {
            // Ctrl+K to show admin panel
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.showAdminPanel();
            }
            // Escape to close admin panel
            if (e.key === 'Escape') {
                this.hideAdminPanel();
            }
        });

        // Admin panel buttons
        const showAdminBtn = document.getElementById('show-admin');
        const closeAdminBtn = document.getElementById('close-admin');
        const generateBtn = document.getElementById('generate-report');

        if (showAdminBtn) showAdminBtn.addEventListener('click', () => this.showAdminPanel());
        if (closeAdminBtn) closeAdminBtn.addEventListener('click', () => this.hideAdminPanel());
        if (generateBtn) generateBtn.addEventListener('click', () => this.generateReport());

        // File upload handler
        const videoUpload = document.getElementById('property-video');
        if (videoUpload) {
            videoUpload.addEventListener('change', (e) => this.handleVideoUpload(e));
        }
    }

    showAdminPanel() {
        const panel = document.getElementById('admin-panel');
        if (panel) {
            panel.style.display = 'flex';
            // Focus on first input
            const firstInput = panel.querySelector('input');
            if (firstInput) firstInput.focus();
        }
    }

    hideAdminPanel() {
        const panel = document.getElementById('admin-panel');
        if (panel) {
            panel.style.display = 'none';
        }
    }

    handleVideoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const videoURL = URL.createObjectURL(file);
            const videoElement = document.getElementById('property-video-display');
            if (videoElement) {
                videoElement.src = videoURL;
                videoElement.load(); // Reload the video element
            }
        }
    }

    generateReport() {
        // Get form data
        const address = document.getElementById('property-address').value;
        const code = document.getElementById('unique-code').value;
        const overview = document.getElementById('property-overview').value;
        const analysis = document.getElementById('market-analysis').value;
        const feedback = document.getElementById('buyer-feedback').value;
        const strategy = document.getElementById('marketing-strategy').value;

        if (!address || !code) {
            alert('Please fill in at least the property address and unique code.');
            return;
        }

        // Update the page with the new data
        this.updateReportContent({
            address,
            code,
            overview,
            analysis,
            feedback,
            strategy
        });

        // Generate unique link
        const baseURL = window.location.origin + window.location.pathname;
        const reportURL = `${baseURL}?report=${code}`;
        
        // Show generated link
        const linkContainer = document.getElementById('generated-link');
        if (linkContainer) {
            linkContainer.innerHTML = `
                <strong>Report Generated!</strong><br>
                <a href="${reportURL}" target="_blank">${reportURL}</a><br>
                <small>Share this link with your vendor</small>
            `;
        }

        // Save data to localStorage for persistence
        this.saveReportData(code, {
            address,
            overview,
            analysis,
            feedback,
            strategy,
            timestamp: new Date().toISOString()
        });

        // Hide admin panel
        this.hideAdminPanel();
    }

    updateReportContent(data) {
        // Update property title
        const titleElement = document.getElementById('property-title-text');
        if (titleElement) {
            titleElement.textContent = data.address || 'Your Premium Property Report';
        }

        // Update address in property overview
        const addressElement = document.getElementById('prop-address');
        if (addressElement) {
            addressElement.textContent = data.address || 'Your Property Address';
        }

        // Parse and update overview data if provided
        if (data.overview) {
            this.parseOverviewData(data.overview);
        }

        // Update market analysis
        if (data.analysis) {
            const analysisElement = document.getElementById('market-analysis-content');
            if (analysisElement) {
                analysisElement.innerHTML = `<p>${data.analysis}</p>` + analysisElement.innerHTML;
            }
        }

        // Update buyer feedback
        if (data.feedback) {
            const feedbackElement = document.getElementById('buyer-feedback-content');
            if (feedbackElement) {
                feedbackElement.innerHTML = `<p>${data.feedback}</p>` + feedbackElement.innerHTML;
            }
        }

        // Update marketing strategy
        if (data.strategy) {
            const strategyElement = document.getElementById('marketing-strategy-content');
            if (strategyElement) {
                strategyElement.innerHTML = `<div style="margin-bottom: 2rem;"><p>${data.strategy}</p></div>` + strategyElement.innerHTML;
            }
        }
    }

    parseOverviewData(overviewText) {
        // Simple parsing of overview data
        // Look for common patterns like "Bedrooms: 3", "Type: House", etc.
        const patterns = {
            bedrooms: /bedrooms?:?\s*(\d+)/i,
            bathrooms: /bathrooms?:?\s*(\d+)/i,
            parking: /parking|garage|car\s*spaces?:?\s*(\d+)/i,
            type: /type:?\s*([^\n,]+)/i,
            landsize: /land\s*size:?\s*([^\n,]+)/i
        };

        Object.keys(patterns).forEach(key => {
            const match = overviewText.match(patterns[key]);
            if (match) {
                const element = document.getElementById(`prop-${key}`);
                if (element) {
                    element.textContent = match[1];
                }
            }
        });
    }

    saveReportData(code, data) {
        const reports = JSON.parse(localStorage.getItem('vendorReports') || '{}');
        reports[code] = data;
        localStorage.setItem('vendorReports', JSON.stringify(reports));
    }

    loadReportData(code) {
        const reports = JSON.parse(localStorage.getItem('vendorReports') || '{}');
        return reports[code] || null;
    }

    loadSampleData() {
        // Check URL for report code
        const urlParams = new URLSearchParams(window.location.search);
        const reportCode = urlParams.get('report');
        
        if (reportCode) {
            const reportData = this.loadReportData(reportCode);
            if (reportData) {
                this.updateReportContent(reportData);
                return;
            }
        }

        // Load default sample data for Jefferson Lane example
        this.loadJeffersonLaneSample();
    }

    loadJeffersonLaneSample() {
        const sampleData = {
            address: "6/152 Jefferson Lane, Palm Beach",
            overview: `
                Type: Apartment/Unit
                Bedrooms: 2
                Bathrooms: 2
                Parking: 1
                Land Size: N/A (Strata)
            `,
            analysis: `
                Our analysis of recent sales in the Jefferson Lane precinct shows strong demand for quality 2-bedroom apartments. 
                Based on comparable properties, we recommend a strategic pricing approach of $2,000,000 to maximize interest 
                and achieve the best possible outcome.
            `,
            feedback: `
                Based on inspections and enquiries, we have compiled comprehensive feedback from 35 prospective buyers. 
                65% provided positive feedback on the location, presentation, and lifestyle offering. This strong market 
                response positions us well for a successful campaign.
            `,
            strategy: `
                Recommended launch price of $2,000,000 allows for negotiation flexibility while maximizing market interest. 
                4-6 week campaign duration for optimal market exposure, targeting both owner-occupiers and premium investors 
                through comprehensive digital marketing across all major property portals.
            `
        };

        this.updateReportContent(sampleData);
        
        // Update specific elements for the sample
        document.getElementById('price-recommendation').textContent = 'Recommended Value: $2,000,000';
        document.getElementById('positive-feedback').textContent = '65%';
        document.getElementById('neutral-feedback').textContent = '23%';
        document.getElementById('total-inspections').textContent = '35';

        // Update comparables table
        const comparablesData = document.getElementById('comparables-data');
        if (comparablesData) {
            comparablesData.innerHTML = `
                <tr>
                    <td>5/148 Jefferson Lane</td>
                    <td>2/2/1</td>
                    <td>$1,850,000</td>
                    <td>Nov 2025</td>
                </tr>
                <tr>
                    <td>3/156 Jefferson Lane</td>
                    <td>2/2/1</td>
                    <td>$1,920,000</td>
                    <td>Dec 2025</td>
                </tr>
                <tr>
                    <td>7/150 Jefferson Lane</td>
                    <td>2/1/1</td>
                    <td>$1,750,000</td>
                    <td>Oct 2025</td>
                </tr>
            `;
        }
    }

    // Utility method for copying text to clipboard
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new VendorReportManager();
    
    // Add smooth scrolling for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add some interactive enhancements
window.addEventListener('load', () => {
    // Fade in animations for report sections
    const sections = document.querySelectorAll('.report-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VendorReportManager;
}