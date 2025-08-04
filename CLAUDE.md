# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Project Overview

This is the "Price Test Easy Tool" - an interactive simulation tool designed to help Shopify merchants understand the business value of A/B testing product pricing before running real experiments with ABConvert. The tool demonstrates how different pricing points affect conversion rate, revenue, and profit through statistical modeling.

### Business Purpose

- **Problem**: Merchants lack intuitive understanding of how pricing changes affect buying behavior
- **Solution**: Lightweight simulation tool showing potential lift/loss from pricing experiments
- **Goal**: Engage merchants during onboarding and drive adoption of actual A/B price testing

## Mathematical Foundation

The tool is built on the assumption that customer **Willingness to Pay (WTP)** follows a normal distribution:

```
WTP ~ N(μ, σ²)
```

Where:
- **μ (mu)**: Average acceptable price point
- **σ (sigma)**: Standard deviation representing variation in customer price expectations

### Core Formulas

1. **Conversion Rate**: `ConversionRate(P) = Φ((μ - P)/σ)` where Φ is the standard normal CDF
2. **Revenue**: `Revenue(P) = P × N × ConversionRate(P)`
3. **Profit**: `Profit(P) = (P - C) × N × ConversionRate(P)`
4. **ROI**: `ROI(P) = Profit(P) / (C × N)` (optional enhancement)

## Technical Architecture

### Core Architecture

The application follows a client-side React architecture with three main layers:

1. **Main Page** (`src/app/page.tsx`): Root component managing global state for simulation parameters (μ, σ, cost, traffic, price range)

2. **Components Layer** (`src/components/`):
   - `InputPanel.tsx`: Form inputs for all simulation parameters with responsive grid layout
   - `ResultChart.tsx`: Recharts-based visualization with dual y-axes for revenue/profit and conversion rates

3. **Mathematical Core** (`src/utils/math.ts`): Statistical functions implementing the pricing simulation
   - `erf()`: Error function implementation using Abramowitz and Stegun approximation
   - `normCDF()`: Normal cumulative distribution function for WTP modeling
   - `generateChartData()`: Main simulation engine converting parameters into visualization data

### Key Dependencies

- **Next.js 15**: App Router with client-side rendering
- **React 19**: State management via useState hooks
- **Recharts**: Data visualization library for dual-axis line charts
- **Tailwind CSS 4**: Utility-first styling with responsive grid layouts
- **TypeScript**: Type safety for mathematical functions and React props

### Data Flow

Parameters flow: InputPanel → page.tsx state → generateChartData() → ResultChart
The simulation calculates conversion rates using normal distribution CDF where customers purchase when their WTP ≥ price.

## Simulation Parameters

| Parameter | Symbol | Description | Example |
|-----------|--------|-------------|---------|
| Average WTP | μ | Mean willingness to pay | $30 |
| Std Deviation | σ | Variation in customer expectations | $5 |
| Unit Cost | C | Cost per unit | $15 |
| Traffic | N | Number of potential customers | 1000 |
| Price Range | P_min, P_max | Simulation price bounds | $20-$40 |

## File Structure

```
src/
├── app/
│   ├── page.tsx          # Main application with state management
│   └── globals.css       # Tailwind imports and CSS variables
├── components/
│   ├── InputPanel.tsx    # Parameter input form
│   └── ResultChart.tsx   # Recharts dual-axis visualization
└── utils/
    └── math.ts           # Statistical functions and simulation logic

# Documentation
├── price_test_math_core.md   # Mathematical foundation and formulas
├── POC_Pricetest_tool.md     # Business requirements and objectives
└── CLAUDE.md                 # This file
```

## Future Enhancements

- Interactive sliders for real-time parameter adjustment
- Exportable graph images for social sharing
- ROI calculations and visualization
- CTA integration: "Run a real test with ABConvert"
- Comparison features for different variable scenarios