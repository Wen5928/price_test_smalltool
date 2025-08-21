# Testing Instructions for New Architecture

## Quick Start Testing

### 1. Start Development Server
```bash
npm run dev
```
Visit: http://localhost:3000

### 2. Test Demo Flow (Fastest)
1. Click "Watch 1 min Demo" to see instructions
2. Click "Try with Demo Data →" (green button)
3. System will load demo data and navigate to analysis
4. Select any product from the grid
5. Review visualization and click "Continue to Results →"
6. View final recommendations and metrics

### 3. Test CSV Upload Flow
1. From landing page, drag & drop a CSV file or click upload
2. System navigates to analysis page
3. Select a product from the loaded products
4. Continue through to results

### 4. Test Manual Input Flow
1. From landing page, click "Manual Input"
2. Fill out the product form in analysis page
3. Click "Analyze Pricing"
4. Continue to results

## Debug Mode
Add `?debug=true` to any URL to see:
- SessionStorage contents
- Current page info
- Data flow tracking

Examples:
- http://localhost:3000?debug=true
- http://localhost:3000/analysis?debug=true

## Expected Flow

### Landing Page (/)
- ✅ Title and subtitle display
- ✅ Demo section expands/collapses
- ✅ CSV upload works
- ✅ Manual input navigation works
- ✅ Demo data button loads sample data

### Analysis Page (/analysis)
- ✅ Back button returns to landing
- ✅ Logo and header display
- ✅ CSV products load from sessionStorage
- ✅ Product selection works
- ✅ Charts and comparison table display
- ✅ Advanced settings panel functions
- ✅ Continue button navigates to results

### Results Page (/results)
- ✅ Back button returns to analysis
- ✅ Price comparison display
- ✅ Key metrics show differences
- ✅ Detailed explanation renders
- ✅ CTA button opens ABConvert
- ✅ Warning tooltip in header

## Test Data

### Demo Products (7 items):
- Premium Wireless Earbuds (Black/White) - $79.99
- Smart Fitness Watch (Small/Large) - $149.99
- Premium Yoga Mat - $39.99
- Insulated Coffee Mug (350ml/500ml) - $24.99/$29.99

### Manual Test Product:
- Name: "Test Product"
- Price: $50.00
- Cost: $20.00
- Shipping: Yes

## Common Issues & Solutions

### Navigation Not Working:
- Check browser console for errors
- Try refreshing the page
- Use debug mode to see data flow

### CSV Not Loading:
- Check debug panel for sessionStorage
- Ensure CSV has proper headers
- Try demo data first

### Charts Not Displaying:
- Check if product was selected
- Verify calculation functions work
- Look for console errors

## Architecture Verification

### Page Structure:
1. **Landing (/)** - Title, demo, upload
2. **Analysis (/analysis)** - Product selection, visualization  
3. **Results (/results)** - Comparison, recommendations, CTA

### Data Flow:
1. CSV/Manual → sessionStorage
2. Analysis → calculations
3. Results → final display

### Color System:
- Dark theme (Pure Black background)
- White text for readability
- Blue accents for actions
- Green for positive indicators

## Performance
- Build size: ~228KB for analysis page (largest)
- Static generation working
- No runtime errors in production build