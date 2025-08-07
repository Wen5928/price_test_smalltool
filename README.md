# 📊 Price Test Easy Tool

> An interactive pricing simulation tool that helps e-commerce merchants understand the impact of price changes on conversion rates, revenue, and profit.



## 🎯 What is this?

The **Price Test Easy Tool** is an educational simulation platform designed to help Shopify merchants and e-commerce business owners visualize how pricing changes affect their bottom line. It uses price elasticity modeling to predict customer behavior and demonstrates the value of systematic A/B testing.

🌐 **[Try the live demo](https://price-test-smalltool.vercel.app/)**

## ✨ Key Features

### 🔄 Dual Input Modes
- **Manual Input**: Quick theoretical analysis with customizable parameters
- **CSV Upload**: Upload Shopify product exports for real-world analysis

### 📊 Advanced Analytics
- **Price Elasticity Modeling**: Uses actual conversion rates as baseline
- **Comprehensive Cost Structure**: COGS + Shipping + Transaction fees
- **Optimal Price Discovery**: Revenue, Profit, or Conversion Rate optimization
- **Interactive Visualizations**: Real-time charts and comparison tables

### 🎨 Professional UX
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Interactive Sliders**: Real-time price adjustment with visual feedback
- **Clean Interface**: Professional styling with intuitive navigation
- **Educational Content**: Built-in explanations of A/B testing value

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/price-test-smalltool.git
   cd price-test-smalltool
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ComparisonTable.tsx    # Price comparison table
│   ├── CsvUploader.tsx        # CSV upload and product selection
│   ├── ExplanationText.tsx    # Educational content
│   ├── InputPanel.tsx         # Manual input form
│   ├── OecSelector.tsx        # Optimization criteria selector
│   ├── OptimalPriceConclusion.tsx  # Results summary
│   └── ResultChart.tsx        # Interactive price chart
└── utils/
    └── math.ts            # Price elasticity calculations
```

## 🔧 Technical Architecture

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS 4 for responsive design
- **Charts**: Recharts for interactive visualizations
- **CSV Processing**: Papa Parse for file handling

### Mathematical Foundation

The tool uses a **price elasticity model** based on customer Willingness to Pay (WTP):

```typescript
// Price elasticity calculation
const elasticityMultiplier = 
  normCDF(μ - newPrice, 0, σ) / normCDF(μ - originalPrice, 0, σ);

const predictedConversionRate = 
  actualConversionRate * elasticityMultiplier;
```

**Key Parameters:**
- **μ (mu)**: Average willingness to pay
- **σ (sigma)**: Price sensitivity (standard deviation)
- **Actual Conversion Rate**: Current performance baseline
- **Cost Structure**: COGS + Shipping + Transaction fees

## 📊 How to Use

### Method 1: Manual Input
1. Select "Manual Input" mode
2. Enter your pricing parameters (WTP, price sensitivity, costs, traffic)
3. Adjust price sliders to see impact
4. View optimal pricing recommendations

### Method 2: CSV Upload (Recommended)
1. Export your products from Shopify (or use compatible CSV format)
2. Select "Upload CSV" mode
3. Upload your file and select a product to analyze
4. Configure business parameters (shipping, transaction fees, traffic, conversion rate)
5. Choose optimization focus (Revenue, Profit, or Conversion Rate)
6. Explore interactive price scenarios

### CSV Format Requirements
Your CSV should include these columns:
- `Handle`: Product identifier
- `Title`: Product name
- `Variant Price`: Current selling price
- `Cost per item`: COGS (Cost of Goods Sold)
- `Variant Requires Shipping`: true/false

## 🎓 Educational Value

This tool is designed to:
- **Demonstrate pricing impact** visually and intuitively
- **Show simulation limitations** and need for real A/B testing
- **Build understanding** of price elasticity concepts
- **Generate interest** in systematic price optimization
- **Guide merchants** toward professional A/B testing solutions

## 🛠️ Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 🚀 Deployment

The application is optimized for deployment on **Vercel**:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and configure build settings
3. Deploy with zero configuration required

For other platforms, run `npm run build` and deploy the `out/` directory.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain responsive design principles
- Add comments for complex mathematical calculations
- Test on both desktop and mobile devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Links

- **Live Demo**: https://price-test-smalltool.vercel.app/
- **ABConvert**: https://www.abconvert.io/ (Professional A/B testing platform)
- **Documentation**: See `Proof of Concept.md` for detailed technical specifications

---

**Built with ❤️ for the e-commerce community**

*This tool is designed to educate and inspire better pricing decisions. For production A/B testing, consider professional platforms like ABConvert.*