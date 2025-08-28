# 📁 ABConvert A/B Price Testing Tool - Project Structure

**Clean, organized structure for easy collaboration and maintenance**

---

## 🎯 **Root Directory Overview**

```
price_test_smalltool/
├── 📋 README.md                     # Main project overview & setup
├── 🤝 PARTNER_OVERVIEW.md          # Partner collaboration guide  
├── 🔧 TECHNICAL_DOCUMENTATION.md   # Complete technical reference
├── 🤝 CONTRIBUTING.md               # Development guidelines
├── 📁 PROJECT_STRUCTURE.md         # This file - project organization
├── ⚙️ Configuration Files
│   ├── package.json                 # Dependencies & scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── next.config.ts              # Next.js configuration
│   ├── postcss.config.mjs          # PostCSS configuration
│   └── .gitignore                  # Git exclusions
├── 📂 src/                         # Source code
├── 📂 docs/                        # Documentation
├── 📂 public/                      # Static assets
└── 🔒 CLAUDE.md                    # AI assistant instructions (excluded from sharing)
```

---

## 📂 **Source Code Structure**

### `/src` - Application Source Code

```
src/
├── 📂 app/                         # Next.js App Router (Pages)
│   ├── layout.tsx                  # Root application layout
│   ├── page.tsx                    # Landing page (CSV upload)
│   ├── globals.css                 # Global styles & ABC color system
│   ├── sitemap.ts                  # SEO sitemap generation
│   ├── 📂 analysis/                # Interactive price analysis page
│   │   ├── layout.tsx              # Analysis page layout
│   │   └── page.tsx                # Price adjustment interface
│   └── 📂 results/                 # Results comparison page
│       ├── layout.tsx              # Results page layout
│       └── page.tsx                # Charts and comparison tables
├── 📂 components/                  # React Components
│   ├── 🔧 Core Analysis Components
│   │   ├── InteractivePriceChart.tsx    # Main analysis interface
│   │   ├── ComparisonTable.tsx          # A/B/Optimal comparison
│   │   ├── CsvUploader.tsx              # File upload & parsing
│   │   └── PriceComparisonChart.tsx     # Results visualization
│   ├── 🎨 User Interface Components  
│   │   ├── HelpManual.tsx               # User guidance system
│   │   ├── ManualInputForm.tsx          # Manual data entry
│   │   ├── ExplanationText.tsx          # Educational content
│   │   ├── StepIndicator.tsx            # Progress navigation
│   │   └── ThemeToggle.tsx              # Theme switching (future)
│   └── 🔧 Utility Components
│       ├── ErrorBoundary.tsx            # Error handling
│       ├── LoadingSkeleton.tsx          # Loading states
│       ├── DebugPanel.tsx               # Development tools
│       └── EmptyState.tsx               # Empty state handling
├── 📂 services/                    # Business Logic Services
│   └── aiPricingAnalyzer.ts             # AI-enhanced pricing analysis
└── 📂 utils/                       # Helper Functions & Utilities
    └── math.ts                          # Mathematical calculations
```

---

## 📚 **Documentation Structure**

### `/docs` - Complete Documentation Hub

```
docs/
├── 📋 README.md                    # Documentation navigation hub
├── 🚀 Getting Started Documents
│   ├── Project_Status_Summary.md   # Current project status
│   └── Testing_Instructions.md     # QA procedures
├── 🏗️ Technical Documentation
│   ├── Current_Project_Architecture.md     # System architecture
│   ├── Architecture_Update_Summary.md     # Recent changes
│   ├── Optimal_Price_Analysis_Documentation.md # Math models
│   └── AI_ENHANCED_COST_MODEL.md          # AI pricing models
├── 🎨 Design & UX Documentation
│   ├── design-principles.md        # ABC design system
│   ├── Color_Palette.md           # Color specifications
│   ├── WIREFRAME.md              # UI wireframes
│   └── Architecture_Flow.md       # User journey flow
├── 💼 Business Documentation
│   ├── POC_Pricetest_tool.md      # Proof of concept
│   ├── Proof of Concept.md        # Business overview
│   └── Fixes_Summary.md           # Change log
├── 📂 condensed/                  # Organized by category
│   ├── 🔧 technical/              # Technical specs
│   ├── 💼 business/               # Business requirements
│   ├── 🎨 design/                 # Design guidelines
│   └── 🛠️ development/           # Development guides
└── 📚 Legacy Documentation
    ├── Documentation_Index.md      # Original navigation
    ├── Project_Architecture_Documentation.md # Legacy architecture
    └── CONDENSED_DOCUMENTATION.md  # Historical overview
```

---

## 🗂️ **Public Assets**

### `/public` - Static Files

```
public/
├── company_icon.png               # ABConvert brand logo
├── favicon.ico                    # Website favicon
└── robots.txt                     # SEO crawler instructions
```

---

## ⚙️ **Configuration Files**

### Root Configuration Files

| File | Purpose | Audience |
|------|---------|----------|
| `package.json` | Dependencies, scripts, project metadata | Developers |
| `tsconfig.json` | TypeScript compiler configuration | Developers |
| `next.config.ts` | Next.js framework configuration | Developers |
| `postcss.config.mjs` | PostCSS & Tailwind CSS configuration | Frontend devs |
| `.gitignore` | Git exclusions for clean repository | All contributors |

---

## 🎯 **File Organization Principles**

### ✅ **Best Practices Applied**

1. **Clear Separation**: Source code, documentation, and configuration separated
2. **Logical Grouping**: Components grouped by function (core, UI, utility)
3. **Documentation Hub**: Centralized docs with clear navigation
4. **Partner-Friendly**: Clean structure for easy collaboration
5. **Scalable Architecture**: Room for growth and new features

### 📋 **Naming Conventions**

- **Files**: PascalCase for components (`InteractivePriceChart.tsx`)
- **Folders**: lowercase with hyphens (`analysis/`, `price-components/`)
- **Documentation**: SCREAMING_SNAKE_CASE for main docs (`README.md`, `TECHNICAL_DOCUMENTATION.md`)
- **Configuration**: Standard conventions (`package.json`, `tsconfig.json`)

---

## 🔍 **Quick Navigation Guide**

### 🚀 **New Contributors Start Here**
1. **[📋 README.md](./README.md)** - Project overview and setup
2. **[🤝 PARTNER_OVERVIEW.md](./PARTNER_OVERVIEW.md)** - Collaboration info
3. **[🤝 CONTRIBUTING.md](./CONTRIBUTING.md)** - Development guidelines

### 👨‍💻 **Developers**
- **Source Code**: `/src` folder
- **Technical Docs**: `/docs/Current_Project_Architecture.md`
- **Setup Guide**: `/docs/condensed/development/setup-guide.md`

### 🎨 **Designers**  
- **Design System**: `/docs/design-principles.md`
- **Colors**: `/docs/Color_Palette.md`
- **Wireframes**: `/docs/WIREFRAME.md`

### 📊 **Product Managers**
- **Project Status**: `/docs/Project_Status_Summary.md`
- **Business Context**: `/docs/POC_Pricetest_tool.md`
- **Feature Specs**: `/docs/condensed/business/feature-specs.md`

---

## 🧹 **Maintenance & Organization**

### 📋 **Regular Cleanup Tasks**
- **Remove build artifacts**: `out/`, `.next/`, `*.tsbuildinfo`
- **Update documentation**: Keep docs current with code changes
- **Organize dependencies**: Regular `npm audit` and updates
- **Archive legacy files**: Move outdated docs to archive folders

### 🔄 **File Lifecycle**
```
New File → Proper Location → Documentation → Review → Archive (if outdated)
```

### 📊 **Organization Metrics**
- **Root Directory**: 6 main files (documentation + config)
- **Source Code**: Organized by function and responsibility  
- **Documentation**: Categorized by audience and priority
- **Dependencies**: Minimal and well-maintained

---

## ✅ **Structure Quality Checklist**

### 📋 **Project Organization**
- [ ] ✅ Clean root directory with essential files only
- [ ] ✅ Source code logically organized by responsibility
- [ ] ✅ Documentation categorized by audience
- [ ] ✅ Configuration files properly organized
- [ ] ✅ Public assets optimized and organized

### 🤝 **Partner-Friendly**
- [ ] ✅ Clear entry points (README, PARTNER_OVERVIEW)
- [ ] ✅ Complete development guidelines
- [ ] ✅ Comprehensive technical documentation
- [ ] ✅ Easy navigation and discovery
- [ ] ✅ Professional presentation

### 🔧 **Developer Experience**
- [ ] ✅ Fast project setup and development
- [ ] ✅ Clear code organization and patterns
- [ ] ✅ Comprehensive documentation
- [ ] ✅ Easy testing and debugging
- [ ] ✅ Scalable architecture for growth

---

**Document Version**: 1.0  
**Last Updated**: 2025-08-28  
**Maintained by**: ABConvert Team  

---

*This structure is designed for optimal collaboration, maintainability, and professional presentation to partners and stakeholders.*