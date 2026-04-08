# WHITEFOX Vendor Reports - Weekly Workflow

## 📋 WEEKLY UPDATE PROCESS

### Step 1: Collect Property Data
- Gather new PDF reports for each active listing
- Collect property videos (if new/updated)
- Note any changes in pricing, feedback, or strategy

### Step 2: Extract Data (via Chat)
**Drop PDFs in chat and say:**
"Please extract data for WF001 - [Property Address]"

**I'll provide formatted data:**
```
PROPERTY OVERVIEW:
Type: [extracted]
Bedrooms: [extracted] 
Bathrooms: [extracted]
Parking: [extracted]
Price: [extracted]

MARKET ANALYSIS:
[Detailed analysis]

BUYER FEEDBACK: 
[Feedback summary]

MARKETING STRATEGY:
[Strategic recommendations]
```

### Step 3: Update Each Report
1. Visit: https://kristian888.github.io/whitefox-vendor-reports/
2. Press `Ctrl+K` to open admin panel
3. For each property:
   - Enter report code (e.g., WF001)
   - Upload video (if new)
   - Paste extracted data from chat
   - Click "Generate Report"
   - Copy the unique link

### Step 4: Share with Vendors
Send personalized links:
- "Hi [Vendor Name], here's your updated weekly report: [unique link]"
- Each vendor only sees their property data

## 🗂️ PROPERTY TRACKING SYSTEM

### Recommended Codes:
- **WF001-WF099:** Palm Beach properties
- **WF100-WF199:** Surfers Paradise properties  
- **WF200-WF299:** Mermaid Waters properties
- **WF300-WF399:** Broadbeach properties

### Property Register:
| Code | Address | Vendor | Status | Last Updated |
|------|---------|---------|---------|--------------|
| WF001 | 6/152 Jefferson Lane | Smith Family | Active | 2026-04-08 |
| WF002 | 23 Ocean Drive | Johnson Trust | Active | 2026-04-08 |
| WF003 | 15 Riverside Terrace | Brown Estate | Active | 2026-04-08 |

## 📹 VIDEO MANAGEMENT

### Video Naming Convention:
- `WF001_6_Jefferson_Lane.mp4`
- `WF002_23_Ocean_Drive.mp4` 
- `WF003_15_Riverside.mp4`

### Video Storage Options:
1. **Local Upload:** Upload directly via admin panel
2. **Cloud Storage:** Store on Google Drive/Dropbox, link in admin
3. **Website Assets:** Place in `/assets/videos/` folder

## 🔄 AUTOMATION OPPORTUNITIES

### Future Enhancements:
- **Bulk Upload:** Process multiple PDFs at once
- **Email Integration:** Auto-send reports to vendors
- **Calendar Sync:** Schedule weekly updates
- **Analytics:** Track vendor engagement

## 📞 VENDOR COMMUNICATION

### Weekly Email Template:
```
Subject: Weekly Property Report - [Address]

Hi [Vendor Name],

Your weekly WHITEFOX property report is ready:
[Unique Link]

Key highlights this week:
• [Market update]
• [Inspection feedback] 
• [Next steps]

Best regards,
Kristian Whitehead
WHITEFOX Real Estate
```

## 🚨 TROUBLESHOOTING

### Common Issues:
- **Video not loading:** Check file format (MP4 preferred)
- **Report not saving:** Ensure unique code is entered
- **Link not working:** Verify report was generated successfully
- **Data not displaying:** Check formatting in admin panel

### Support:
- Test locally first: Open index.html file
- Check browser console for errors (F12)
- Verify GitHub Pages deployment status