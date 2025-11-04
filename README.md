# Neon Paint

A web-based neon drawing application designed for creating high-contrast, screen-mode compatible graphics for video post-production workflows.

## Overview

Neon Paint is a sophisticated HTML5 Canvas application that enables users to create vibrant neon-style artwork with real-time velocity-based brush dynamics. The application is specifically engineered for video production workflows, particularly for creating overlay graphics that can be seamlessly composited using screen blend modes in professional video editing software.

## Key Features

- **Velocity-Based Brush Dynamics**: Brush width automatically adjusts based on drawing speed, mimicking natural marker behavior
- **Neon Glow Effects**: Configurable glow intensity for maximum visual impact
- **Smooth Curve Rendering**: Advanced interpolation algorithms ensure fluid, professional-quality strokes
- **Undo/Redo System**: Full history management with keyboard shortcuts (CMD+Z / CTRL+Z)
- **Responsive Design**: Touch-enabled for tablet use, optimized for desktop workflows
- **Persistent Configuration**: User preferences automatically saved to localStorage

## Technical Architecture

Built with modern JavaScript ES6 modules following clean code principles:

- **Modular Architecture**: Separated concerns with dedicated modules for canvas management, drawing engine, color management, and history handling
- **Layered Abstraction**: Clean separation between UI, business logic, and infrastructure layers
- **Dependency Injection**: Loose coupling through constructor injection for testability and maintainability

## Use Case: Video Tutorial Production

This application was inspired by the visual style popularized by **IBM Technology** on YouTube, where neon graphics are composited over video content using screen blend modes.

### Production Workflow

1. **Create Graphics**: Use Neon Paint to draw annotations, highlights, or explanatory graphics on a black background
2. **Export**: Capture the canvas as a video frame or screenshot
3. **Post-Production**: Import into Adobe After Effects, Adobe Premiere Pro, or similar NLE software
4. **Compositing**: Apply **Screen Blend Mode** to remove the black background while preserving the neon colors
5. **Integration**: Overlay the neon graphics onto your video tutorial content

### Why Screen Blend Mode?

Screen blend mode mathematically inverts and multiplies colors, effectively removing black pixels while preserving brighter elements. This makes the black background (`#000000`) completely transparent while the neon colors remain fully visible, creating a seamless integration with your video content.

## Installation

```bash
npm install
npm run dev
```

The application runs on Vite dev server and is accessible at `http://localhost:5173`.

## Usage

### Drawing Controls

- **Color Selection**: Click on color buttons in the toolbar to switch between neon colors
- **Brush Size**: Adjust the "Grosor" (Thickness) slider to control maximum brush width
- **Variation**: The "Variación" (Variation) slider controls how much brush width varies with speed (0 = uniform, 100 = maximum variation)
- **Glow Intensity**: The "Glow" slider adjusts the neon glow effect strength

### Keyboard Shortcuts

- **Undo**: `CMD+Z` (Mac) or `CTRL+Z` (Windows/Linux)
- **Redo**: `CMD+SHIFT+Z` (Mac) or `CTRL+Y` (Windows/Linux)

### Touch Support

Fully supported on touch-enabled devices for tablet-based drawing workflows.

## Browser Compatibility

Optimized for modern browsers with Canvas API support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Deployment

Automated deployment via GitHub Actions to SSH-enabled servers. Configure the following secrets in your repository:

- `SSH_HOST`: Server hostname or IP
- `SSH_USER`: SSH username
- `SSH_PASSWORD`: SSH password
- `SSH_DIR`: Target directory path on server

Deployment triggers automatically on push to `main` branch.

## Technology Stack

- **Vanilla JavaScript ES6+**: No framework dependencies
- **HTML5 Canvas API**: Hardware-accelerated rendering
- **Vite**: Fast development server and build tool
- **GitHub Actions**: CI/CD automation

## License

ISC

---

**Note**: For optimal results in video post-production, ensure your canvas background remains pure black (`#000000`) and use maximum contrast neon colors for best screen blend mode compositing.

