# AGENT.md

## Project Overview
Interactive data science learning repository with standalone HTML/CSS/JavaScript visualizations for machine learning and statistical concepts.

## Repository Structure
- Each concept in its own directory (`activation-functions/`, `confusion-matrix/`, `means/`, `data-types/`)
- Each directory contains: `index.html`, `script.js`, `styles.css`, `README.md`
- No build process - pure vanilla JavaScript with Chart.js

## Common Commands

### Testing/Running
```bash
# Open any visualization in browser
open activation-functions/index.html
open confusion-matrix/index.html
open means/index.html
open data-types/index.html

# Or use a simple HTTP server if needed
python3 -m http.server 8000
# Then visit http://localhost:8000/[directory]/
```

### Development Workflow
1. Edit HTML/CSS/JS files directly
2. Refresh browser to see changes
3. Test on different screen sizes
4. Verify mathematical accuracy

## Code Conventions

### JavaScript
- Use modern ES6+ features
- camelCase for variables/functions
- Pure mathematical functions
- Chart.js pattern: `chart.data.datasets[0].data = newData; chart.update('none');`

### CSS
- Design system from confusion-matrix/
- Primary color: #3498db
- Container max-width: 1200px
- Border radius: 8px
- Box shadows: 0 4px 6px rgba(0, 0, 0, 0.1)

### File Organization
- Keep visualizations self-contained
- Mathematical implementations from scratch
- Real-time computation updates
- Responsive design with CSS Grid/Flexbox

## Design Principles

### Single-View Visualization
- **Always represent all visuals in a single view/page** for easy comparison
- Avoid dropdowns or tabs that hide visualizations
- Use responsive grid layouts to display multiple related concepts simultaneously
- Enable users to compare behaviors, parameters, and outputs side-by-side
- Example: Show all stochastic processes (Random Walk, Brownian Motion, Markov Chain, etc.) at once

## Educational Focus
- Visual/interactive over theoretical
- Mathematical accuracy
- Beginner to intermediate friendly
- Consistent design language
