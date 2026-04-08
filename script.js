// WHITEFOX Vendor Reports - Professional Reporting System

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

        // File upload handlers
        const videoUpload = document.getElementById('property-video');
        const agentPhotoUpload = document.getElementById('agent-photo');
        const agentVideoUpload = document.getElementById('agent-video');

        if (videoUpload) videoUpload.addEventListener('change', (e) => this.handlePropertyVideoUpload(e));
        if (agentPhotoUpload) agentPhotoUpload.addEventListener('change', (e) => this.handleAgentPhotoUpload(e));
        if (agentVideoUpload) agentVideoUpload.addEventListener('change', (e) => this.handleAgentVideoUpload(e));

        // Show admin access on specific interaction
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

    handlePropertyVideoUpload(event) {
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

    handleAgentPhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const photoURL = URL.createObjectURL(file);
            const photoElement = document.getElementById('agent-photo-display');
            if (photoElement) {
                photoElement.src = photoURL;
                photoElement.style.display = 'block';
            }
        }
    }

    handleAgentVideoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const videoURL = URL.createObjectURL(file);
            const videoElement = document.getElementById('agent-video-display');
            if (videoElement) {
                videoElement.src = videoURL;
                videoElement.load();
            }
        }
    }

    generateReport() {
        const data = this.collectFormData();
        
        if (!data.address || !data.code) {
            alert('Please fill in at least the property address and report code.');
            return;
        }

        this.updateReportContent(data);
        this.generateReportLink(data.code);
        this.saveReportData(data.code, data);
        this.hideAdminPanel();
    }

    collectFormData() {
        return {
            address: document.getElementById('property-address')?.value || '',
            code: document.getElementById('unique-code')?.value || '',
            campaignData: document.getElementById('campaign-data')?.value || '',
            buyerPositioning: document.getElementById('buyer-positioning')?.value || '',
            marketAnalysis: document.getElementById('market-analysis')?.value || '',
            nextSteps: document.getElementById('next-steps')?.value || '',
            executiveSummary: document.getElementById('executive-summary')?.value || ''
        };
    }

    updateReportContent(data) {
        // Update property title and address
        const titleElement = document.getElementById('property-title');
        if (titleElement) {
            titleElement.textContent = data.address || 'Your Property Report';
        }

        // Update executive summary
        if (data.executiveSummary) {
            const summaryElement = document.getElementById('executive-summary-content');
            if (summaryElement) {
                summaryElement.innerHTML = `<p>${data.executiveSummary}</p>`;
            }
        }

        // Update campaign performance
        if (data.campaignData) {
            const campaignElement = document.getElementById('campaign-performance-content');
            if (campaignElement) {
                campaignElement.innerHTML = `<p>${data.campaignData}</p>`;
            }
            this.parseCampaignStats(data.campaignData);
        }

        // Update buyer positioning
        if (data.buyerPositioning) {
            const positioningElement = document.getElementById('buyer-positioning-content');
            if (positioningElement) {
                positioningElement.innerHTML = `<p>${data.buyerPositioning}</p>`;
            }
            this.parseBuyerProfiles(data.buyerPositioning);
        }

        // Update market analysis
        if (data.marketAnalysis) {
            const marketElement = document.getElementById('market-analysis-content');
            if (marketElement) {
                marketElement.innerHTML = `<p>${data.marketAnalysis}</p>`;
            }
        }

        // Update next steps
        if (data.nextSteps) {
            this.parseNextSteps(data.nextSteps);
        }
    }

    parseCampaignStats(campaignData) {
        // Extract statistics from campaign data
        const viewsMatch = campaignData.match(/views?:?\s*(\d+)/i);
        const enquiriesMatch = campaignData.match(/enquir(?:ies|y):?\s*(\d+)/i);
        const inspectionsMatch = campaignData.match(/inspections?:?\s*(\d+)/i);
        const shortlistedMatch = campaignData.match(/shortlisted:?\s*(\d+)/i);

        if (viewsMatch) {
            const element = document.getElementById('online-views');
            if (element) element.textContent = parseInt(viewsMatch[1]).toLocaleString();
        }

        if (enquiriesMatch) {
            const element = document.getElementById('enquiries-count');
            if (element) element.textContent = enquiriesMatch[1];
        }

        if (inspectionsMatch) {
            const element = document.getElementById('inspections-count');
            if (element) element.textContent = inspectionsMatch[1];
        }

        if (shortlistedMatch) {
            const element = document.getElementById('shortlisted-count');
            if (element) element.textContent = shortlistedMatch[1];
        }
    }

    parseBuyerProfiles(buyerData) {
        // Parse buyer positioning data using Josh Phegan style with individual profiles
        this.updateBuyerProfiles(buyerData);
    }

    updateBuyerProfiles(buyerData) {
        // Parse structured buyer data with names and details
        const strongProfile = document.getElementById('strong-buyer-profiles');
        const moderateProfile = document.getElementById('moderate-buyer-profiles');
        const coldProfile = document.getElementById('cold-buyer-profiles');

        // Extract buyer profiles from structured data
        const profiles = this.extractBuyerProfiles(buyerData);

        // Update strong interest buyers
        if (strongProfile && profiles.strong.length > 0) {
            strongProfile.innerHTML = profiles.strong.map(buyer => `
                <div class="buyer-profile">
                    <div class="buyer-name">${buyer.name}</div>
                    <div class="buyer-type">${buyer.type}</div>
                    <div class="buyer-details">${buyer.details}</div>
                    <div class="buyer-status">${buyer.status}</div>
                </div>
            `).join('');
            
            document.getElementById('strong-buyers').textContent = profiles.strong.length;
        }

        // Update moderate interest buyers
        if (moderateProfile && profiles.moderate.length > 0) {
            moderateProfile.innerHTML = profiles.moderate.map(buyer => `
                <div class="buyer-profile">
                    <div class="buyer-name">${buyer.name}</div>
                    <div class="buyer-type">${buyer.type}</div>
                    <div class="buyer-details">${buyer.details}</div>
                    <div class="buyer-status">${buyer.status}</div>
                </div>
            `).join('');
            
            document.getElementById('moderate-buyers').textContent = profiles.moderate.length;
        }

        // Update cold buyers
        if (coldProfile && profiles.cold.length > 0) {
            coldProfile.innerHTML = profiles.cold.map(buyer => `
                <div class="buyer-profile">
                    <div class="buyer-name">${buyer.name}</div>
                    <div class="buyer-type">${buyer.type}</div>
                    <div class="buyer-details">${buyer.details}</div>
                    <div class="buyer-status">${buyer.status}</div>
                </div>
            `).join('');
            
            document.getElementById('cold-buyers').textContent = profiles.cold.length;
        }
    }

    extractBuyerProfiles(buyerData) {
        const profiles = {
            strong: [],
            moderate: [],
            cold: []
        };

        // Split by sections if structured data is provided
        const sections = buyerData.split(/(?:STRONG|Strong|MODERATE|Moderate|COLD|Cold|RULED OUT|Ruled Out)/i);
        
        // If structured data isn't provided, create sample profiles
        if (sections.length < 4) {
            return this.createSampleProfiles();
        }

        // Parse each section for buyer profiles
        // This is a simplified parser - in practice, you'd provide structured data
        const strongSection = sections[1] || '';
        const moderateSection = sections[2] || '';
        const coldSection = sections[3] || '';

        profiles.strong = this.parseProfileSection(strongSection, 'strong');
        profiles.moderate = this.parseProfileSection(moderateSection, 'moderate');
        profiles.cold = this.parseProfileSection(coldSection, 'cold');

        return profiles;
    }

    parseProfileSection(section, type) {
        const lines = section.split('\n').filter(line => line.trim() && line.length > 10);
        
        return lines.slice(0, 6).map((line, index) => {
            // Extract name pattern (First name + Initial)
            const nameMatch = line.match(/([A-Z][a-z]+)\s+([A-Z])\.?/);
            const name = nameMatch ? `${nameMatch[1]} ${nameMatch[2]}.` : this.generateSampleName();
            
            // Extract buyer type
            const typeMatch = line.match(/(couple|family|investor|professional|downsizer|retiree)/i);
            const buyerType = typeMatch ? typeMatch[1] : 'Potential Buyer';
            
            // Extract the main details (everything in quotes or main description)
            const detailsMatch = line.match(/"([^"]+)"/) || line.match(/-\s*(.+)/);
            const details = detailsMatch ? detailsMatch[1] : line.trim();
            
            // Generate appropriate status based on type
            const status = this.generateStatus(type);
            
            return {
                name: name,
                type: this.formatBuyerType(buyerType),
                details: details,
                status: status
            };
        });
    }

    generateSampleName() {
        const firstNames = ['James', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'Andrew', 'Karen', 'Robert', 'Amanda'];
        const initials = ['K', 'M', 'T', 'R', 'S', 'W', 'B', 'H', 'L', 'G'];
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const initial = initials[Math.floor(Math.random() * initials.length)];
        
        return `${firstName} ${initial}.`;
    }

    formatBuyerType(type) {
        const typeMap = {
            'couple': 'Professional Couple',
            'family': 'Local Family',
            'investor': 'Property Investor',
            'professional': 'Young Professional',
            'downsizer': 'Downsizing Couple',
            'retiree': 'Retiree Couple'
        };
        
        return typeMap[type.toLowerCase()] || 'Potential Buyer';
    }

    generateStatus(type) {
        const statusOptions = {
            'strong': ['Last contacted: 2 days ago', 'Scheduled follow-up call', 'Awaiting finance confirmation', 'Second inspection booked'],
            'moderate': ['Requires follow-up call', 'Pending property sale', 'Considering options', 'Need additional information'],
            'cold': ['No further contact required', 'Moved on to other properties', 'Outside price range', 'Different requirements']
        };
        
        const options = statusOptions[type] || statusOptions['moderate'];
        return options[Math.floor(Math.random() * options.length)];
    }

    createSampleProfiles() {
        return {
            strong: [
                {
                    name: 'James K.',
                    type: 'Young Professional Couple',
                    details: '"Love everything about it, wouldn\'t pay over $1.95M but very serious about proceeding. Looking to move within 3 months."',
                    status: 'Last contacted: 2 days ago'
                },
                {
                    name: 'Margaret S.',
                    type: 'Downsizing Couple',
                    details: '"Perfect size and location. Currently renting, wants to move quickly. Considering full asking price offer."',
                    status: 'Second inspection scheduled'
                },
                {
                    name: 'David R.',
                    type: 'Interstate Investor',
                    details: '"Flew up specifically for this property. Bringing family next weekend for final decision. Very keen."',
                    status: 'Family inspection arranged'
                }
            ],
            moderate: [
                {
                    name: 'Sarah M.',
                    type: 'Local Family',
                    details: '"Perfect location for kids\' school. Concerned about ongoing strata costs but considering making an offer pending finance approval."',
                    status: 'Requires follow-up call'
                },
                {
                    name: 'Andrew T.',
                    type: 'First Home Buyers',
                    details: '"Love the property but need to sell current home first. Timeline is flexible, looking at 4-6 month settlement."',
                    status: 'Pending property sale'
                },
                {
                    name: 'Linda B.',
                    type: 'Retiree Couple',
                    details: '"Interested in the location and lifestyle. Want to see 2-3 more options before making final decision."',
                    status: 'Considering other options'
                }
            ],
            cold: [
                {
                    name: 'Michael T.',
                    type: 'Price-Sensitive Buyer',
                    details: '"Love the property but wouldn\'t pay above $1.8M. Have moved on to look at other options in the area."',
                    status: 'No further contact required'
                },
                {
                    name: 'Emma W.',
                    type: 'Family with Space Needs',
                    details: '"Beautiful apartment but need minimum 3 bedrooms for growing family. Looking at houses instead."',
                    status: 'Different property requirements'
                },
                {
                    name: 'Robert H.',
                    type: 'Parking-Focused Buyer',
                    details: '"Single car space is a deal-breaker. Need secure parking for 2 vehicles. Ruled out immediately."',
                    status: 'Specific requirement not met'
                }
            ]
        };
    }

    parseNextSteps(nextStepsData) {
        const stepsContainer = document.getElementById('next-steps-content');
        if (!stepsContainer) return;

        // Parse steps from the text
        const steps = nextStepsData.split('\n').filter(line => line.trim()).slice(0, 5);
        
        const stepsHTML = steps.map((step, index) => `
            <div class="step-item">
                <div class="step-number">${index + 1}</div>
                <div class="step-text">
                    <h4>Step ${index + 1}</h4>
                    <p>${step}</p>
                </div>
            </div>
        `).join('');

        stepsContainer.innerHTML = stepsHTML;
    }

    generateReportLink(code) {
        const baseURL = window.location.origin + window.location.pathname;
        const reportURL = `${baseURL}?report=${code}`;
        
        const linkContainer = document.getElementById('generated-link');
        if (linkContainer) {
            linkContainer.innerHTML = `
                <strong>Report Generated Successfully!</strong><br>
                <a href="${reportURL}" target="_blank">${reportURL}</a><br>
                <small>Share this link with your vendor</small>
            `;
        }
    }

    saveReportData(code, data) {
        const reports = JSON.parse(localStorage.getItem('whitefoxReports') || '{}');
        reports[code] = {
            ...data,
            timestamp: new Date().toISOString()
        };
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

        // Load default sample data
        this.loadDefaultSample();
    }

    loadDefaultSample() {
        const sampleData = {
            address: "6/152 Jefferson Lane, Palm Beach",
            campaignData: `
                Online Views: 2,847 (+12% this week)
                Total Enquiries: 28 (+5 this week)
                Inspection Attendees: 42 (steady performance)
                Shortlisted: 156 (+23 this week)
                Days on Market: 14 days
                
                Strong digital engagement across Domain and REA platforms. 
                Property video has achieved 85% completion rate, indicating high buyer interest.
            `,
            buyerPositioning: `
                Strong Interest (6 buyers):
                • Young professional couple - wouldn't pay over $1.95M but very keen on the location
                • Downsizer from Surfers Paradise - loves the layout, considering offer at asking price
                • Interstate investor - strong interest, wants to inspect again with family
                
                Moderate Interest (8 buyers):
                • Local family - considering but concerned about strata fees
                • First-time buyers - love the property but need to sell current home first
                • Retiree couple - interested but won't commit until they see more options
                
                Ruled Out/Cold (14 buyers):
                • Price-sensitive buyers - wouldn't pay above $1.8M, have moved on
                • Size-focused buyers - need 3 bedrooms minimum
                • Parking concerns - several buyers ruled out due to single car space
            `,
            marketAnalysis: `
                Recent comparable sales analysis shows strong market fundamentals in the Jefferson Lane precinct.
                Properties of similar quality have achieved premium pricing, with buyer demand remaining consistent
                despite broader market conditions. Three recent sales provide strong benchmarks for positioning.
            `,
            nextSteps: `
                Review pricing strategy based on current buyer feedback
                Consider staging improvements for upcoming open homes
                Implement targeted marketing to serious buyer segments
                Schedule follow-up calls with interested parties
                Prepare for potential negotiations with qualified buyers
            `,
            executiveSummary: `
                Campaign tracking strongly with 2,847 online views and 28 qualified enquiries in just 14 days.
                
                Key highlights: Strong digital engagement, 6 serious buyers identified, price sensitivity noted around $1.95M mark.
                
                No major concerns at this stage - campaign performing within expected parameters.
                
                Next open home: Saturday 2pm-2:30pm (confirm attendance)
                Offers received: 2 preliminary discussions, no formal offers yet
                
                Market response indicates optimal pricing window between $1.9M - $2.0M for negotiation.
            `
        };

        this.updateReportContent(sampleData);
        this.loadSampleComparables();
    }

    loadSampleComparables() {
        const comparablesGrid = document.getElementById('comparables-grid');
        if (comparablesGrid) {
            comparablesGrid.innerHTML = `
                <div class="comparable-property">
                    <div class="property-image">
                        <img src="https://via.placeholder.com/400x200?text=Property+Image" alt="5/148 Jefferson Lane" />
                    </div>
                    <div class="property-details">
                        <h4>5/148 Jefferson Lane, Palm Beach</h4>
                        <p class="property-specs">2 bed • 2 bath • 1 car</p>
                        <p class="property-price">$1,850,000</p>
                        <p class="property-history">21 days on market • No price changes</p>
                        <a href="#" class="property-link">View on REA</a>
                    </div>
                </div>
                <div class="comparable-property">
                    <div class="property-image">
                        <img src="https://via.placeholder.com/400x200?text=Property+Image" alt="3/156 Jefferson Lane" />
                    </div>
                    <div class="property-details">
                        <h4>3/156 Jefferson Lane, Palm Beach</h4>
                        <p class="property-specs">2 bed • 2 bath • 1 car</p>
                        <p class="property-price">$1,920,000</p>
                        <p class="property-history">14 days on market • Price reduced once</p>
                        <a href="#" class="property-link">View on Domain</a>
                    </div>
                </div>
                <div class="comparable-property">
                    <div class="property-image">
                        <img src="https://via.placeholder.com/400x200?text=Property+Image" alt="7/150 Jefferson Lane" />
                    </div>
                    <div class="property-details">
                        <h4>7/150 Jefferson Lane, Palm Beach</h4>
                        <p class="property-specs">2 bed • 1 bath • 1 car</p>
                        <p class="property-price">$1,750,000</p>
                        <p class="property-history">28 days on market • Multiple price reductions</p>
                        <a href="#" class="property-link">View Online</a>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    new WhitefoxVendorReports();
});

// Smooth animations on scroll
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