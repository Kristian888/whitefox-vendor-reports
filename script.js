// WHITEFOX Vendor Reports - Brand-Aligned JavaScript

class WhitefoxVendorReports {
    constructor() {
        this.initializeEventListeners();
        this.loadSampleData();
    }

    initializeEventListeners() {
        // Admin panel keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.showAdminPanel();
            }
            if (e.key === 'Escape') {
                this.hideAdminPanel();
            }
        });

        // Admin panel controls
        const showAdminBtn = document.getElementById('show-admin');
        const closeAdminBtn = document.getElementById('close-admin');
        const generateBtn = document.getElementById('generate-report');

        if (showAdminBtn) showAdminBtn.addEventListener('click', () => this.showAdminPanel());
        if (closeAdminBtn) closeAdminBtn.addEventListener('click', () => this.hideAdminPanel());
        if (generateBtn) generateBtn.addEventListener('click', () => this.generateReport());

        // Video upload handler
        const videoUpload = document.getElementById('property-video');
        if (videoUpload) {
            videoUpload.addEventListener('change', (e) => this.handleVideoUpload(e));
        }

        // Show admin access on hover for development
        document.addEventListener('mousemove', (e) => {
            const adminAccess = document.getElementById('admin-access');
            if (adminAccess && (e.clientX > window.innerWidth - 100) && (e.clientY > window.innerHeight - 100)) {
                adminAccess.style.display = 'block';
            } else if (adminAccess) {
                adminAccess.style.display = 'none';
            }
        });
    }

    showAdminPanel() {
        const panel = document.getElementById('admin-panel');
        if (panel) {
            panel.style.display = 'flex';
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
                videoElement.load();
            }
        }
    }

    generateReport() {
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
        
        const linkContainer = document.getElementById('generated-link');
        if (linkContainer) {
            linkContainer.innerHTML = `
                <strong>Report Generated!</strong><br>
                <a href="${reportURL}" target="_blank">${reportURL}</a><br>
                <small>Share this link with your vendor</small>
            `;
        }

        this.saveReportData(code, {
            address,
            overview,
            analysis,
            feedback,
            strategy,
            timestamp: new Date().toISOString()
        });

        this.hideAdminPanel();
    }

    updateReportContent(data) {
        // Update property title and address
        const titleElement = document.getElementById('property-title');
        const addressElement = document.getElementById('property-address-display');
        
        if (titleElement) {
            titleElement.textContent = data.address || 'Your Property Report';
        }
        if (addressElement) {
            addressElement.textContent = data.address || 'Your Property Address';
        }

        // Parse overview data for property details
        if (data.overview) {
            this.parseOverviewData(data.overview);
        }

        // Update market analysis
        if (data.analysis) {
            const analysisElement = document.getElementById('market-analysis-content');
            if (analysisElement) {
                analysisElement.innerHTML = `<p>${data.analysis}</p>`;
            }
        }

        // Update buyer feedback
        if (data.feedback) {
            const feedbackElement = document.getElementById('buyer-feedback-content');
            if (feedbackElement) {
                feedbackElement.innerHTML = `<p>${data.feedback}</p>`;
            }
        }

        // Update marketing strategy
        if (data.strategy) {
            const strategyElement = document.getElementById('marketing-strategy-content');
            if (strategyElement) {
                strategyElement.innerHTML = `<p>${data.strategy}</p>`;
            }
        }
    }

    parseOverviewData(overviewText) {
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

        // Extract price if available
        const priceMatch = overviewText.match(/(?:price|value|worth):?\s*\$?([\d,]+(?:\.\d+)?)\s*(?:million|m)?/i);
        if (priceMatch) {
            const valueElement = document.getElementById('recommended-value');
            if (valueElement) {
                let price = priceMatch[1];
                if (overviewText.toLowerCase().includes('million') || overviewText.toLowerCase().includes('m')) {
                    price = `$${price} Million`;
                } else {
                    price = `$${price}`;
                }
                valueElement.textContent = price;
            }
        }
    }

    saveReportData(code, data) {
        const reports = JSON.parse(localStorage.getItem('whitefoxReports') || '{}');
        reports[code] = data;
        localStorage.setItem('whitefoxReports', JSON.stringify(reports));
    }

    loadReportData(code) {
        const reports = JSON.parse(localStorage.getItem('whitefoxReports') || '{}');
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

        // Load Jefferson Lane sample data
        this.loadJeffersonLaneSample();
    }

    loadJeffersonLaneSample() {
        const sampleData = {
            address: "6/152 Jefferson Lane, Palm Beach",
            overview: `
                Type: Premium Apartment
                Bedrooms: 2
                Bathrooms: 2
                Parking: 1
                Land Size: N/A (Strata)
                Price: $2,000,000
            `,
            analysis: `
                Our comprehensive analysis of the Jefferson Lane precinct reveals exceptional demand for luxury 2-bedroom apartments. Recent comparable sales demonstrate strong market confidence, with properties achieving premium prices. Based on current market conditions and comparable properties, we recommend strategic positioning at $2,000,000 to maximize market interest while allowing negotiation flexibility.
            `,
            feedback: `
                Following extensive market testing with 35 prospective buyers, we've identified strong positive sentiment. 65% of inspectors provided favorable feedback regarding location, presentation, and lifestyle offering. Price sensitivity was noted by 23% of prospects, indicating optimal negotiation opportunity. This response profile positions the property favorably for a successful campaign.
            `,
            strategy: `
                Digital-first marketing approach leveraging WHITEFOX's extensive network and premium positioning. Recommended 4-6 week campaign duration targeting both owner-occupiers and sophisticated investors. Comprehensive online presence across all major portals, supported by professional photography and virtual tour technology. Strategic pricing allows market flexibility while maximizing exposure.
            `
        };

        this.updateReportContent(sampleData);
        
        // Update sample comparables
        this.loadSampleComparables();
    }

    loadSampleComparables() {
        const comparablesData = document.getElementById('comparables-data');
        if (comparablesData) {
            comparablesData.innerHTML = `
                <div class="comparable-item">
                    <div class="comp-address">5/148 Jefferson Lane, Palm Beach</div>
                    <div class="comp-details">2 / 2 / 1</div>
                    <div class="comp-price">$1,850,000</div>
                    <div class="comp-date">Nov 2025</div>
                </div>
                <div class="comparable-item">
                    <div class="comp-address">3/156 Jefferson Lane, Palm Beach</div>
                    <div class="comp-details">2 / 2 / 1</div>
                    <div class="comp-price">$1,920,000</div>
                    <div class="comp-date">Dec 2025</div>
                </div>
                <div class="comparable-item">
                    <div class="comp-address">7/150 Jefferson Lane, Palm Beach</div>
                    <div class="comp-details">2 / 1 / 1</div>
                    <div class="comp-price">$1,750,000</div>
                    <div class="comp-date">Oct 2025</div>
                </div>
            `;
        }
    }

    // Smooth scroll for internal navigation
    initializeSmoothScrolling() {
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
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    new WhitefoxVendorReports();
});

// Fade-in animation on scroll
window.addEventListener('load', () => {
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

    // Observe sections for animation
    document.querySelectorAll('section:not(.hero)').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WhitefoxVendorReports;
}