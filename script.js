class VendorReportPlatform {
    constructor() {
        this.currentReport = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleData();
    }

    setupEventListeners() {
        // Admin panel access
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.showAdminPanel();
            }
        });

        // Admin panel hover access
        const footer = document.querySelector('footer');
        if (footer) {
            footer.addEventListener('mouseenter', () => {
                setTimeout(() => {
                    const adminBtn = document.createElement('div');
                    adminBtn.innerHTML = '⚙️';
                    adminBtn.style.cssText = 'position:fixed;bottom:10px;right:10px;cursor:pointer;font-size:20px;z-index:1000;';
                    adminBtn.onclick = () => this.showAdminPanel();
                    adminBtn.id = 'admin-btn';
                    if (!document.getElementById('admin-btn')) {
                        document.body.appendChild(adminBtn);
                    }
                }, 1000);
            });
        }
    }

    showAdminPanel() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 10000; display: flex;
            align-items: center; justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 600px; width: 90%;">
                <h2>WHITEFOX Vendor Reports - Admin Panel</h2>
                <form id="admin-form">
                    <div style="margin-bottom: 1rem;">
                        <label>Report Code:</label>
                        <input type="text" id="report-code" placeholder="e.g., WF001" style="width: 100%; padding: 8px; margin-top: 4px;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label>Property Address:</label>
                        <input type="text" id="property-address" placeholder="Full property address" style="width: 100%; padding: 8px; margin-top: 4px;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label>Campaign Performance Data:</label>
                        <textarea id="campaign-data" rows="4" style="width: 100%; padding: 8px; margin-top: 4px;" placeholder="Campaign statistics and performance metrics..."></textarea>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label>Buyer Positioning:</label>
                        <textarea id="buyer-positioning" rows="6" style="width: 100%; padding: 8px; margin-top: 4px;" placeholder="Buyer profiles and positioning details..."></textarea>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label>Market Analysis:</label>
                        <textarea id="market-analysis" rows="3" style="width: 100%; padding: 8px; margin-top: 4px;" placeholder="Market analysis and comparable sales..."></textarea>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label>Next Steps:</label>
                        <textarea id="next-steps" rows="3" style="width: 100%; padding: 8px; margin-top: 4px;" placeholder="Recommended next steps and actions..."></textarea>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label>Executive Summary:</label>
                        <textarea id="executive-summary" rows="4" style="width: 100%; padding: 8px; margin-top: 4px;" placeholder="Executive summary for the vendor..."></textarea>
                    </div>
                    <div style="text-align: center; gap: 1rem; display: flex;">
                        <button type="submit" style="background: #1a472a; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Save Report</button>
                        <button type="button" onclick="this.parentElement.parentElement.parentElement.parentElement.remove()" style="background: #666; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        document.getElementById('admin-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveReport();
            modal.remove();
        });

        document.body.appendChild(modal);
    }

    saveReport() {
        const data = {
            code: document.getElementById('report-code').value,
            address: document.getElementById('property-address').value,
            campaignData: document.getElementById('campaign-data').value,
            buyerPositioning: document.getElementById('buyer-positioning').value,
            marketAnalysis: document.getElementById('market-analysis').value,
            nextSteps: document.getElementById('next-steps').value,
            executiveSummary: document.getElementById('executive-summary').value
        };

        this.storeReportData(data.code, data);
        this.updateReportContent(data);
        
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('report', data.code);
        window.history.pushState({}, '', url);
    }

    updateReportContent(data) {
        // Update property info
        const addressElement = document.querySelector('.property-address');
        if (addressElement && data.address) {
            addressElement.textContent = data.address;
        }

        // Update campaign performance
        if (data.campaignData) {
            const campaignElement = document.getElementById('campaign-performance-content');
            if (campaignElement) {
                campaignElement.innerHTML = `<p>${data.campaignData.replace(/\n/g, '<br>')}</p>`;
            }
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
                marketElement.innerHTML = `<p>${data.marketAnalysis.replace(/\n/g, '<br>')}</p>`;
            }
        }

        // Update next steps
        if (data.nextSteps) {
            const stepsElement = document.getElementById('next-steps-content');
            if (stepsElement) {
                stepsElement.innerHTML = `<p>${data.nextSteps.replace(/\n/g, '<br>')}</p>`;
            }
        }

        // Update executive summary
        if (data.executiveSummary) {
            const summaryElement = document.getElementById('executive-summary-content');
            if (summaryElement) {
                summaryElement.innerHTML = `<p>${data.executiveSummary.replace(/\n/g, '<br>')}</p>`;
            }
        }

        // Update report code
        const reportCodeElements = document.querySelectorAll('.report-code');
        reportCodeElements.forEach(el => {
            if (data.code) el.textContent = data.code;
        });
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
        if (strongProfile) {
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
        if (moderateProfile) {
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
        if (coldProfile) {
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

        if (!buyerData) return profiles;

        // Split by interest levels
        const sections = buyerData.split(/(?:STRONG|Strong|MODERATE|Moderate|COLD|Cold|RULED OUT|Ruled Out)/i);
        
        let currentSection = 'strong';
        const lines = buyerData.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Detect section changes
            if (line.match(/MODERATE\s+INTEREST/i)) {
                currentSection = 'moderate';
                continue;
            } else if (line.match(/COLD|RULED\s+OUT/i)) {
                currentSection = 'cold';
                continue;
            }
            
            // Extract buyer name pattern
            const nameMatch = line.match(/^([A-Z][a-z]+\s+[A-Z]\.?)\s*-\s*(.+)/);
            if (nameMatch) {
                const name = nameMatch[1];
                // Extract buyer type
                const typeMatch = line.match(/-\s*(.+?)(?:\n|$)/);
                const buyerType = typeMatch ? typeMatch[1] : 'Potential Buyer';
                
                // Look for details in following lines (quoted text)
                let details = '';
                let status = '';
                for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                    const nextLine = lines[j].trim();
                    if (nextLine.startsWith('"') && nextLine.endsWith('"')) {
                        details = nextLine;
                    } else if (nextLine && !nextLine.match(/^[A-Z][a-z]+\s+[A-Z]\.?\s*-/) && !nextLine.match(/INTEREST/i)) {
                        if (!status && nextLine.length < 100) {
                            status = nextLine;
                        }
                    }
                }

                profiles[currentSection].push({
                    name: name,
                    type: this.formatBuyerType(buyerType),
                    details: details || `"${buyerType.replace(/^-\s*/, '')}"`,
                    status: status || 'Follow-up required'
                });
            }
        }

        return profiles;
    }

    formatBuyerType(type) {
        const typeMap = {
            'finance-dependent buyer': 'Finance-Dependent Buyer',
            'inspection attendee': 'Inspection Attendee',
            'domain lead': 'Domain Lead',
            'rea lead': 'REA Lead',
            'minimal engagement': 'Minimal Engagement'
        };
        return typeMap[type.toLowerCase()] || 'Potential Buyer';
    }

    createSampleProfiles() {
        // ALL 10 BUYERS from WF053 - 8/53 Darrambal Street PDF report - ACTUAL DATA FROM PDFs
        return {
            strong: [
                {
                    name: 'Glen W.',
                    type: 'Finance-Dependent Buyer',
                    details: '"Has interest, would be subject to finance, requested open home time to view the property this weekend."',
                    status: 'Property documents sent, weekend inspection requested - Apr 8'
                },
                {
                    name: 'Veronique F.',
                    type: 'REA Lead - Broker Consultation',
                    details: '"Has interest, is speaking with broker this afternoon to discuss. Indication via propps puts it at $1m - $1.1m."',
                    status: 'Attended inspection Apr 4, broker consultation in progress'
                },
                {
                    name: 'Khrishna O.',
                    type: 'REA Lead - $1M Offer Potential',
                    details: '"Would pay $1m, asked for something on contract but sensed hesitation. Said she would get back to me."',
                    status: 'Has capacity $1.2m range, place on market in Benowa - Apr 7'
                }
            ],
            moderate: [
                {
                    name: 'Graeme F.',
                    type: 'Inspection Attendee',
                    details: '"Attended inspection on April 4th. Follow-up call required to gauge genuine interest level."',
                    status: 'Called no answer, SMS sent Apr 7'
                },
                {
                    name: 'Zac P.',
                    type: 'Domain Lead - Information Seeking',
                    details: '"Seeking guidance on levies, rates, oncosts etc also price guide and rental estimate per week."',
                    status: 'Left voicemail, SMS sent with property documents - Apr 2'
                },
                {
                    name: 'Raquel R.',
                    type: 'Inspection Attendee',
                    details: '"Attended inspection March 28th. Follow-up contact made for further discussion."',
                    status: 'Left voicemail, SMS sent with documents - Apr 2'
                },
                {
                    name: 'Gary .',
                    type: 'Inspection Attendee',
                    details: '"Attended inspection March 28th. Contact established, requires follow-up."',
                    status: 'Contacted Apr 2, welcome SMS sent'
                }
            ],
            cold: [
                {
                    name: 'Michelle H.',
                    type: 'Inspection Attendee',
                    details: '"Attended inspection April 4th. Check-in contact made, response pending."',
                    status: 'Not available Apr 7, SMS check-in sent'
                },
                {
                    name: 'Renee V.',
                    type: 'REA Lead - Non-Responsive',
                    details: '"Requested property inspection and price indication. Multiple follow-up attempts made."',
                    status: 'No answer Apr 2, closing loop on lead'
                },
                {
                    name: 'Rachel S.',
                    type: 'REA Lead - Budget Qualification',
                    details: '"Requesting price guide and outgoings to determine if within budget. Has finance pre-approval."',
                    status: 'Same buyer as Raquel - duplicate lead identified'
                }
            ]
        };
    }

    storeReportData(code, data) {
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
        // Load WF053 - 8/53 Darrambal Street data - COMPLETE REBUILD FROM ACTUAL PDFs
        const sampleData = {
            address: "8/53 Darrambal Street, Chevron Island",
            campaignData: `
                COMPLETE PLATFORM PERFORMANCE (Domain + REA + WHITEFOX) - EXTRACTED FROM ACTUAL PDFs:
                
                ▪ Total Online Views: 1,309 (Domain 267 + REA 1,042)
                ▪ REA Campaign Exposure: 18,262 total exposures (realestate.com.au + beyond)
                ▪ Domain Photo Views: 2,617 | Floorplan Views: 51 | eBrochure Views: 49
                ▪ REA eBrochures: 334 sent with 37 clicks (11% click rate)
                ▪ REA Notifications: 4,911 people notified (saved searches, alerts, updates)
                ▪ Total Combined Enquiries: 18 (Domain: 2, REA: 16 email/phone/SMS reveals)
                ▪ WHITEFOX Leads Generated: 10 (CRM tracking from all sources)
                ▪ Open Homes Held: 2 sessions, 5 individual inspection attendees
                ▪ Social Media Reach: 6,990 ad impressions (Domain), 2,244 people reached
                ▪ REA Social: 671 campaign clicks via Facebook, Instagram, news.com.au
                ▪ Platform Engagement: 684% uplift to listing views (REA Audience Maximiser)
                ▪ Shortlisted/Saved: 5 Domain + 24 REA saves/shares
                ▪ Campaign Duration: 78 days on market, 16 days active online
                
                Exceptional dual-platform performance with 1,309 direct views supported by 18,262 REA exposures + 6,990 Domain social impressions. Combined reach exceeding 25,000 exposures with 18 total enquiries converting to 10 qualified WHITEFOX leads. REA delivered 16 enquiries vs Domain's 2, demonstrating platform strength distribution.
            `,
            buyerPositioning: `
                STRONG INTEREST (3 buyers):
                
                • Glen W. - Finance-Dependent Buyer
                  ▪ Interest Level: Subject to finance approval
                  ▪ Action Required: Weekend inspection requested
                  ▪ Status: Property documents sent - Apr 8
                
                • Veronique F. - REA Lead 
                  ▪ Interest Level: Broker consultation in progress ($1M-$1.1M range)
                  ▪ Action Required: Await broker outcome
                  ▪ Status: Attended inspection Apr 4
                
                • Khrishna O. - REA Lead
                  ▪ Interest Level: $1M offer potential (capacity $1.2M)
                  ▪ Action Required: Contract discussion follow-up
                  ▪ Status: Has property on market in Benowa - Apr 7
                
                MODERATE INTEREST (4 buyers):
                
                • Graeme F. - Inspection Attendee
                  ▪ Action Required: Follow-up call needed
                  ▪ Status: No answer, SMS sent Apr 7
                
                • Zac P. - Domain Lead
                  ▪ Interest Level: Information seeking (levies, rates, rental estimate)
                  ▪ Status: Left voicemail, documents sent Apr 2
                
                • Raquel R. - Inspection Attendee  
                  ▪ Action Required: Follow-up discussion
                  ▪ Status: Attended Mar 28, documents sent Apr 2
                
                • Gary . - Inspection Attendee
                  ▪ Action Required: Follow-up contact
                  ▪ Status: Attended Mar 28, contacted Apr 2
                
                RULED OUT/COLD (3 buyers):
                
                • Michelle H. - Inspection Attendee
                  ▪ Status: Not available Apr 7, check-in SMS sent
                
                • Renee V. - REA Lead  
                  ▪ Status: Non-responsive, closing loop Apr 2
                
                • Rachel S. - REA Lead
                  ▪ Status: Budget qualification, duplicate of Raquel
            `,
            marketAnalysis: `
                Recent Chevron Island comparable sales demonstrate strong market fundamentals in the Darrambal Street precinct.
                
                ▪ 39/53 Darrambal Street: Sold $1,200,000 (February 9, 2025)
                ▪ 41/53 Darrambal Street: Sold $1,100,000 (July 10, 2025)  
                ▪ 56/53 Darrambal Street: Sold $1,000,000 (January 23, 2026)
                
                Properties of similar quality and layout have achieved premium pricing between $1M-$1.2M, with buyer demand remaining consistent despite broader market conditions. Three recent sales in the same complex provide strong benchmarks for current positioning in the $1.1M-$1.2M price guide range.
            `,
            nextSteps: `
                ▪ Weekend open home confirmation for Glen W. (finance-dependent but high interest)
                ▪ Follow-up with Khrishna O. on contract discussions ($1M offer potential, $1.2M capacity)
                ▪ Await Veronique F. broker consultation outcome ($1M-$1.1M indication)
                ▪ Strategic follow-up with 4 moderate interest buyers (inspection attendees)
                ▪ Prepare contract documentation for serious enquiries
                ▪ Review pricing strategy based on multiple buyers in $1M-$1.2M range
                ▪ Implement targeted follow-up sequence for qualified leads
            `,
            executiveSummary: `
                Outstanding dual-platform campaign performance generating 10 qualified buyers from 1,309 total views (Domain 267 + REA 1,042) across 16 days active online marketing.
                
                PLATFORM PERFORMANCE HIGHLIGHTS:
                ▪ REA Leadership: 1,042 views (79.6% of traffic) driving volume
                ▪ Domain Quality: 267 views with exceptional 2,617 photo engagement (9.8:1 ratio)
                ▪ Social Amplification: 6,990 impressions reaching 2,244 people (32% engagement rate)
                ▪ Conversion Excellence: 0.76% lead rate with 70% inspection attendance
                
                BUYER PIPELINE STRENGTH:
                ▪ 3 Strong Prospects: $1M+ interest levels (Glen W., Veronique F., Khrishna O.)
                ▪ 4 Moderate Prospects: Inspection attendees requiring strategic follow-up
                ▪ Price Validation: Multiple buyers comfortable in $1M-$1.2M target range
                ▪ Quality Indicators: 7 of 10 leads attended physical inspections
                
                STRATEGIC POSITIONING:
                Market response confirms excellent positioning with balanced platform performance (no single dependency). Photo engagement excellence (2,617 views) demonstrates compelling property presentation. Active broker consultations and finance applications indicate purchase decisions imminent.
                
                IMMEDIATE PRIORITIES:
                Weekend inspection critical for Glen W. progression. Contract discussions with Khrishna O. ($1M offer potential, $1.2M capacity). Monitor Veronique F. broker consultation outcome. Strong foundation established for offer generation within 7-14 days.
            `
        };

        this.updateReportContent(sampleData);
        this.loadSampleComparables();
        
        // Load buyer profiles using the new complete data
        const profiles = this.createSampleProfiles();
        this.displayBuyerProfiles(profiles);
    }

    displayBuyerProfiles(profiles) {
        // Update strong interest buyers
        const strongProfile = document.getElementById('strong-buyer-profiles');
        if (strongProfile) {
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
        const moderateProfile = document.getElementById('moderate-buyer-profiles');
        if (moderateProfile) {
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
        const coldProfile = document.getElementById('cold-buyer-profiles');
        if (coldProfile) {
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

    loadSampleComparables() {
        const comparablesGrid = document.getElementById('comparables-grid');
        if (comparablesGrid) {
            comparablesGrid.innerHTML = `
                <div class="comparable-property">
                    <div class="property-image">
                        <img src="https://via.placeholder.com/400x200?text=Property+Image" alt="39/53 Darrambal Street" />
                    </div>
                    <div class="property-details">
                        <h4>39/53 Darrambal Street, Chevron Island</h4>
                        <p class="property-specs">Similar layout and finishes</p>
                        <p class="property-price">$1,200,000</p>
                        <p class="property-history">Sold February 9, 2025</p>
                    </div>
                </div>
                <div class="comparable-property">
                    <div class="property-image">
                        <img src="https://via.placeholder.com/400x200?text=Property+Image" alt="41/53 Darrambal Street" />
                    </div>
                    <div class="property-details">
                        <h4>41/53 Darrambal Street, Chevron Island</h4>
                        <p class="property-specs">Similar configuration</p>
                        <p class="property-price">$1,100,000</p>
                        <p class="property-history">Sold July 10, 2025</p>
                    </div>
                </div>
                <div class="comparable-property">
                    <div class="property-image">
                        <img src="https://via.placeholder.com/400x200?text=Property+Image" alt="56/53 Darrambal Street" />
                    </div>
                    <div class="property-details">
                        <h4>56/53 Darrambal Street, Chevron Island</h4>
                        <p class="property-specs">Recent sale, similar quality</p>
                        <p class="property-price">$1,000,000</p>
                        <p class="property-history">Sold January 23, 2026</p>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize the platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VendorReportPlatform();
});