# 🤝 Contributing to ABConvert A/B Price Testing Tool

Thank you for your interest in contributing to this project! This guide will help you get started with the development process and collaboration workflow.

---

## 🚀 **Quick Start for Contributors**

### 1. **Repository Setup**
```bash
# Clone the repository
git clone <repository-url>
cd price_test_smalltool

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. **Branch Strategy**
```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# Make your changes...

# Commit with descriptive messages
git commit -m "feat: add new pricing model parameter"

# Push to remote
git push origin feature/your-feature-name
```

### 3. **Pull Request Process**
1. Ensure your code follows the established patterns
2. Test thoroughly on different devices and browsers  
3. Update relevant documentation
4. Submit PR with clear description of changes

---

## 📋 **Development Standards**

### 🎯 **Code Quality**
- **TypeScript First**: All new code must be fully typed
- **ESLint Compliance**: Run `npm run lint` and fix all issues
- **Component Patterns**: Follow existing component structure
- **ABC Design System**: Use established colors and styling patterns

### 🧪 **Testing Requirements**
Before submitting any changes:
- [ ] ✅ Manual testing on desktop (Chrome, Firefox, Safari)
- [ ] ✅ Mobile testing (375px, 768px breakpoints)
- [ ] ✅ CSV upload functionality verified
- [ ] ✅ Mathematical calculations tested with various inputs
- [ ] ✅ All charts and visualizations rendering correctly
- [ ] ✅ Navigation flow between all three pages working

### 📝 **Documentation Updates**
When making changes, update:
- **Code Comments**: For complex logic or mathematical functions
- **README.md**: If changing setup or core functionality
- **TECHNICAL_DOCUMENTATION.md**: For architectural changes
- **Component Documentation**: For new or modified components

---

## 🏗️ **Architecture Guidelines**

### 📁 **File Organization**
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── analysis/          # Interactive analysis
│   └── results/           # Results comparison
├── components/            # React components
│   ├── Core components    # Main functionality
│   ├── UI components      # User interface elements
│   └── Utility components # Helper components
├── services/              # Business logic
└── utils/                 # Helper functions
```

### 🎨 **Styling Standards**
- **Tailwind CSS**: Use utility classes for styling
- **ABC Colors**: Reference `globals.css` for color variables
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Maintain consistency with existing dark theme

### 🧮 **Mathematical Functions**
- **Type Safety**: Full TypeScript interfaces for all math functions
- **Unit Tests**: Consider adding tests for complex calculations  
- **Documentation**: Clear comments explaining mathematical models
- **Parameter Validation**: Proper input validation and error handling

---

## 🔧 **Component Development**

### ✅ **Good Practices**
```typescript
// ✅ Good: Typed props with clear documentation
interface PriceAnalysisProps {
  /** Product data for analysis */
  productData: ProductData;
  /** Callback when analysis completes */
  onComplete: (results: AnalysisResults) => void;
}

export const PriceAnalysis: React.FC<PriceAnalysisProps> = ({
  productData,
  onComplete
}) => {
  // Implementation with proper error handling
};
```

### ❌ **Avoid**
```typescript
// ❌ Avoid: Untyped, unclear naming
function Component(props: any) {
  // Implementation without clear structure
}
```

### 🎯 **Component Checklist**
- [ ] TypeScript interfaces for all props
- [ ] Proper error boundary handling
- [ ] Responsive design implementation
- [ ] Accessibility considerations (WCAG AA)
- [ ] Loading states where appropriate
- [ ] Consistent with ABC design system

---

## 📊 **Performance Guidelines**

### ⚡ **Optimization Targets**
- **Bundle Size**: Keep page bundles under 250KB
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: Maintain 90+ across all metrics

### 🔍 **Performance Checklist**
- [ ] Use dynamic imports for large components
- [ ] Optimize images and static assets
- [ ] Minimize unnecessary re-renders
- [ ] Use proper React keys for lists
- [ ] Implement proper loading states

---

## 🚀 **Deployment Process**

### 🌐 **Automatic Deployment**
- **Main Branch**: Automatically deploys to production via Vercel
- **Feature Branches**: Create preview deployments for testing
- **Pull Requests**: Generate preview URLs for review

### 📋 **Pre-deployment Checklist**
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] ESLint checks pass
- [ ] Manual testing completed
- [ ] Documentation updated
- [ ] Performance impact assessed

---

## 🐛 **Bug Reports & Feature Requests**

### 🔍 **Bug Reports**
When reporting bugs, include:
1. **Steps to reproduce** the issue
2. **Expected vs actual behavior**
3. **Browser and device information**
4. **Screenshots or screen recordings** (if applicable)
5. **Console errors** (if any)

### 💡 **Feature Requests**
For new features, provide:
1. **Clear description** of the proposed feature
2. **Use case and business value**
3. **Technical considerations** (if any)
4. **Design mockups** (if applicable)

---

## 🎯 **ABC Design System**

### 🎨 **Color Usage**
```css
/* Use CSS variables for consistency */
.primary-button {
  background-color: var(--color-blue-primary);
}

.success-state {
  color: var(--color-success-green);
}
```

### 📐 **Layout Patterns**
- **Grid System**: Use CSS Grid for complex layouts
- **Flexbox**: Use for component-level layouts  
- **Spacing**: Follow 4px grid system (4, 8, 12, 16, 24, 32...)
- **Typography**: Use established font sizes and weights

---

## 🤝 **Communication & Support**

### 💬 **Getting Help**
- **Technical Questions**: ABConvert Development Team
- **Design Questions**: ABConvert Design Team
- **Business Logic**: ABConvert Product Team
- **General Support**: ABConvert Support Team

### 📅 **Regular Syncs**
- **Weekly**: Development team standup
- **Bi-weekly**: Architecture reviews
- **Monthly**: Partner collaboration check-ins

### 📋 **Issue Tracking**
- **GitHub Issues**: For bugs and feature requests
- **Internal Tools**: For project management and planning
- **Documentation**: Keep this CONTRIBUTING.md updated

---

## 📜 **Code of Conduct**

### 🎯 **Our Standards**
- **Professional Communication**: Respectful and constructive feedback
- **Collaborative Spirit**: Work together toward common goals
- **Quality Focus**: Maintain high standards for code and documentation
- **Continuous Learning**: Share knowledge and learn from others

### 🚫 **Unacceptable Behavior**
- Discriminatory language or behavior
- Personal attacks or harassment
- Publishing private information without consent
- Any behavior that would be deemed inappropriate in a professional setting

---

## ✅ **Contribution Checklist**

Before submitting your contribution:

### 📋 **Code Quality**
- [ ] TypeScript types are complete and accurate
- [ ] ESLint passes without errors
- [ ] Code follows established patterns
- [ ] No console.log statements in production code

### 🧪 **Testing**
- [ ] Manual testing completed on multiple browsers
- [ ] Responsive design tested on different screen sizes
- [ ] All user flows working correctly
- [ ] No JavaScript errors in console

### 📚 **Documentation**
- [ ] Code is properly commented
- [ ] README updated if necessary
- [ ] Technical documentation updated
- [ ] API changes documented

### 🚀 **Performance**
- [ ] No significant performance regressions
- [ ] Bundle size impact considered
- [ ] Loading states implemented where needed
- [ ] Accessibility standards maintained

---

## 🎉 **Thank You!**

Your contributions help make this tool better for the entire e-commerce community. Whether you're fixing bugs, adding features, improving documentation, or providing feedback, every contribution is valuable.

**Happy coding!** 🚀

---

**Document Version**: 1.0  
**Last Updated**: 2025-08-28  
**Maintained by**: ABConvert Team