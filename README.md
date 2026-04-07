# WHITEFOX Vendor Reports Platform

A professional, branded landing page system for generating and sharing vendor reports with unique links for each property.

## 🚀 Features

- **Video Headers**: Property video loops with branded overlay
- **Responsive Design**: Perfect viewing on desktop, tablet, and mobile
- **Unique Report Links**: Each property gets a custom URL code
- **Admin Panel**: Easy content management (Ctrl+K to access)
- **Professional Branding**: Full WHITEFOX Real Estate styling
- **PDF Data Integration**: Extract property data from uploaded documents

## 📁 File Structure

```
├── index.html          # Main landing page template
├── styles.css          # Custom WHITEFOX styling
├── script.js           # Interactive functionality
├── assets/             # Images, videos, and resources
│   ├── logo/          # WHITEFOX logos
│   └── videos/        # Sample property videos
└── README.md          # Documentation
```

## 🎯 How It Works

### For You (Admin):
1. Press **Ctrl+K** to open admin panel
2. Upload property video
3. Paste extracted data from PDF analysis
4. Generate unique report link
5. Share with vendor

### For Vendors:
1. Click their unique link (e.g., `yoursite.com/report/ABC123`)
2. View professional branded report
3. Watch property video header
4. Review comprehensive market analysis

## 🛠️ Setup Instructions

### 1. GitHub Pages Deployment
1. Fork or download this repository
2. Go to repository Settings → Pages
3. Select "Deploy from branch" → "main branch"
4. Your site will be live at: `username.github.io/repository-name`

### 2. Custom Domain (Optional)
1. In repository settings, add your custom domain
2. Create CNAME file with your domain name
3. Update DNS records to point to GitHub Pages

### 3. Adding Content
- Replace `assets/logo/whitefox-logo.png` with your actual logo
- Add property videos to `assets/videos/`
- Customize contact information in `index.html`

## 📊 PDF Data Extraction Workflow

When you receive property PDFs, use this format for the admin panel:

### Property Overview:
```
Type: Apartment/House/Townhouse
Bedrooms: X
Bathrooms: X  
Parking: X
Land Size: XXX sqm
```

### Market Analysis:
```
Comparable sales analysis, pricing recommendations, 
market conditions, and strategic positioning.
```

### Buyer Feedback:
```
Inspection feedback, interest levels, common concerns,
and buyer sentiment analysis.
```

### Marketing Strategy:
```
Recommended approach, timing, pricing strategy,
and campaign duration.
```

## 🎨 Customization

### Branding
- Update colors in `:root` variables in `styles.css`
- Replace logo files in `assets/logo/`
- Modify contact information in `index.html`

### Layout
- Sections can be reordered in `index.html`
- Styling can be adjusted in `styles.css`
- Functionality can be extended in `script.js`

## 📱 Mobile Responsive

The platform is fully responsive and optimized for:
- Desktop viewing (full experience)
- Tablet viewing (adjusted layout)
- Mobile viewing (stacked sections)

## 🔒 Admin Access

- **Desktop**: Press `Ctrl+K` to open admin panel
- **Mobile**: Admin button appears in bottom-right corner
- All admin functions are client-side for security

## 📞 Support

For questions or customizations:
- Email: kristian@whitefoxrealestate.com.au
- Built by: WHITEFOX Real Estate Technology Team

## 📄 License

© 2026 WHITEFOX Real Estate. All rights reserved.
This system is proprietary and confidential.

---

**Next Steps:**
1. Deploy to GitHub Pages
2. Test with sample property
3. Start generating professional vendor reports!