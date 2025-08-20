# ABC Design Principles & Style Guide

## Brand Identity

ABC represents modern, professional, and accessible design. Our color system reflects these values through carefully chosen palettes that work harmoniously across light and dark themes.

## Core Design Principles

### 1. Clarity First
- Information hierarchy should be immediately apparent
- Use color to guide attention, not distract
- Maintain high contrast ratios for readability

### 2. Consistency
- Colors should have semantic meaning across the application
- Interactive elements must have predictable states
- Maintain visual rhythm through consistent spacing

### 3. Accessibility
- WCAG AA compliance minimum (4.5:1 for normal text, 3:1 for large text)
- All interactive elements must have visible focus states
- Color should never be the only indicator of state or meaning

### 4. Professional Aesthetics
- Clean, modern interface with purposeful use of color
- Subtle transitions enhance perceived performance
- Balance between vibrant accents and neutral backgrounds

## Color Usage Guidelines

### Primary Colors (Blues)
- **Blue 01 (#217BD1)**: Primary actions, links, selected states
- **Blue 02 (#3FB4E8)**: Hover states, secondary emphasis
- **Blue 03 (#5DEFFF)**: Highlights, notifications
- **Blue 04 (#A4F6FF)**: Light backgrounds, subtle emphasis

### Secondary Colors (Greens)
- **Green 01 (#5A912B)**: Success states, confirmations
- **Green 02 (#82C621)**: Positive metrics, growth indicators
- **Green 03 (#ACFF17)**: Highlights, achievement badges
- **Green 04 (#D6FF8C)**: Light success backgrounds

### Accent Colors (Corals)
- **Coral 01 (#FF5F47)**: Errors, warnings, critical actions
- **Coral 02 (#FF8690)**: Important notices, moderate warnings
- **Coral 03 (#FFABD6)**: Soft warnings, gentle emphasis
- **Coral 04 (#FFD4EA)**: Light error backgrounds

### Neutral Colors
- **Dark Gray (#3C3C3C)**: Primary text in light theme, backgrounds in dark theme
- **Medium Gray (#4E4E4E)**: Secondary surfaces, borders
- **Pure White (#FFFFFF)**: Primary text in dark theme, backgrounds in light theme

## Interactive States

### Buttons
- Default: Solid background with high contrast text
- Hover: 10% darker/lighter depending on theme
- Active: 20% darker/lighter with slight scale
- Disabled: 50% opacity
- Focus: 2px outline with primary color

### Form Elements
- Default: Subtle border with neutral background
- Focus: Primary color border with slight glow
- Error: Coral border with error message
- Success: Green border with success indicator

### Links
- Default: Primary blue with no underline
- Hover: Underline appears with slight color shift
- Visited: Slightly darker blue
- Focus: Outline with offset

## Typography

### Hierarchy
- Use color sparingly in typography
- Primary text: Full contrast (white on dark, dark on white)
- Secondary text: 80% opacity
- Muted text: 60% opacity
- Disabled text: 40% opacity

### Emphasis
- Bold for strong emphasis
- Color for interactive elements only
- Avoid using color alone for emphasis

## Spacing & Layout

### Color Blocking
- Use surface colors to create visual separation
- Maintain consistent padding within colored sections
- Borders should be subtle (10-20% opacity)

### Visual Rhythm
- Group related elements with consistent backgrounds
- Use white space to let colors breathe
- Avoid adjacent high-contrast color blocks

## Animation & Transitions

### Theme Switching
- 300ms transition for background colors
- 200ms transition for text colors
- Stagger transitions for smooth experience

### Interactive Feedback
- 150ms transitions for hover states
- 100ms for active states
- No transition for focus states (immediate feedback)

## Accessibility Requirements

### Color Contrast Minimums
- Normal text: 4.5:1
- Large text (18pt+): 3:1
- Interactive elements: 3:1
- Disabled elements: No minimum but should be obviously disabled

### Focus Indicators
- Minimum 2px outline
- 2px offset from element
- Must be visible on all backgrounds
- Never remove focus indicators

### Color Independence
- Information must be conveyed through more than color
- Use icons, patterns, or text labels
- Error states need both color and icon/text

## Testing Checklist

### Visual Review
- [ ] All colors from palette are used appropriately
- [ ] No hardcoded colors outside the system
- [ ] Consistent use of semantic color variables
- [ ] Visual hierarchy is clear

### Accessibility Testing
- [ ] Run automated contrast checker
- [ ] Test with color blindness simulators
- [ ] Verify keyboard navigation
- [ ] Check screen reader compatibility

### Cross-Theme Testing
- [ ] Components look good in both themes
- [ ] No color conflicts or readability issues
- [ ] Smooth transitions between themes
- [ ] Proper contrast in both themes

### Responsive Testing
- [ ] Colors work at all viewport sizes
- [ ] Touch targets meet minimum sizes
- [ ] No color banding on gradients
- [ ] Consistent experience across devices