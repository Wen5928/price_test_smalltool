# 📊 Price Test Easy Tool - Mathematical Core

This document defines the core mathematical logic for the "Price Test Easy Tool" — a simulation tool used to demonstrate the importance of A/B testing product pricing.

---

## 🎯 Objective

Simulate how different pricing points affect:

- Conversion rate
- Revenue
- Profit
- ROI

This helps users intuitively understand why price testing is valuable before running real A/B tests.

---

## 🧠 Assumption: Normal Distribution of Willingness to Pay (WTP)

We assume customer willingness to pay follows a normal distribution:

- **Mean (μ):** Average acceptable price
- **Standard deviation (σ):** Variation in customer expectations

```math
WTP ~ 𝒩(μ, σ^2)
```

---

## 1️⃣ Conversion Rate at a Given Price (P)

The proportion of users willing to buy at price `P` is:

```math
ConversionRate(P) = Φ\left(\frac{μ - P}{σ}\right)
```

Where `Φ` is the **cumulative distribution function (CDF)** of the standard normal distribution.

---

## 2️⃣ Profit Per Unit

```math
ProfitPerUnit(P) = P - C
```

Where `C` is the unit cost.

---

## 3️⃣ Total Revenue and Total Profit

Assuming total potential customer count = `N`

```math
Revenue(P) = P × N × ConversionRate(P)
Profit(P)  = (P - C) × N × ConversionRate(P)
```

---

## 4️⃣ Return on Investment (ROI)

Optionally, ROI can be computed as:

```math
ROI(P) = \frac{Profit(P)}{C × N}
```

This allows comparing total return vs. base production cost.

---

## 🛠 Parameters to Simulate

| Parameter | Description                        |
| --------- | ---------------------------------- |
| `μ`       | Avg. WTP (e.g. \$30)               |
| `σ`       | Std. deviation of WTP (e.g. \$5)   |
| `C`       | Unit cost (e.g. \$15)              |
| `N`       | Number of customers (e.g. 1000)    |
| `P`       | Simulated price range (\$20\~\$40) |

---

## 📈 Suggested Output Charts

- Conversion rate vs. price
- Total revenue vs. price
- Total profit vs. price
- ROI bar graph (optional)

---

## 💡 Use Cases

- Built-in tool for onboarding to demonstrate price sensitivity
- Embed in blog posts to drive awareness of pricing experiments
- CTA to launch an actual A/B price test via ABConvert

---

## ✨ Optional Enhancements

- Interactive sliders for `μ`, `σ`, and `C`
- Exportable graph images for social sharing
- CTA integration: "Run a real test with this idea"

---

> This mathematical core serves as the foundation for MVP simulation logic. It can be implemented using JavaScript, Python, or embedded in a React frontend.

