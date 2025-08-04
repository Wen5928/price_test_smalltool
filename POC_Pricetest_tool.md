# 📄 Proof of Concept: Price Test Easy Tool

## 🎯 Objective

To create an interactive frontend tool that simulates how different pricing points affect conversion rate, revenue, and profit. The goal is to help Shopify merchants understand the business value of price testing before running a real A/B test with ABConvert.

---

## ✅ Problem

Most merchants don’t have an intuitive understanding of how pricing changes affect buying behavior. Without seeing the potential lift or loss, they hesitate to run pricing experiments.

---

## 💡 Proposed Solution

A lightweight simulation tool built in React that:

- Assumes willingness to pay (WTP) follows a normal distribution.
- Lets users input:
  - Unit cost (C)
  - Average WTP (μ)
  - Standard deviation (σ)
  - Price range (P_min to P_max)
  - Traffic count (N)
- Calculates:
  - Conversion Rate at each price
  - Revenue = Price × Conversion Rate × N
  - Profit = (Price - Cost) × Conversion Rate × N
- Visualizes the result using charts (Recharts).

---

## 🔢 Core Math

Let:
- μ = average WTP
- σ = std. dev. of WTP
- C = unit cost
- N = number of potential customers
- P = target price

Then:

- ConversionRate(P) = Φ((μ - P)/σ)  
- Revenue(P) = P × N × ConversionRate(P)  
- Profit(P) = (P - C) × N × ConversionRate(P)

Where Φ is the standard normal CDF.

---

## 🛠️ Tech Stack

- **Frontend**: React + Tailwind CSS
- **Visualization**: Recharts
- **Math**: JS + custom CDF function
- **Hosting**: Vercel (or embed into ABConvert’s dashboard)
- **Backend**: ❌ None needed for MVP

---

## 🧪 MVP Features

- Sliders or inputs for μ, σ, C, N, P_min, P_max
- Dynamic chart updates
- Exportable chart or CTA: “Run this test on ABConvert”

---

## 🚀 Goals

- Demonstrate AB testing value
- Engage merchants during onboarding or blog education
- Lightweight, embeddable, and no-login-required tool

---

## 📝 Next Step

- Build interactive frontend
- Test perceived usefulness (e.g., via click-through, CTA engagement)
- Consider later backend integration (saving test plans)
