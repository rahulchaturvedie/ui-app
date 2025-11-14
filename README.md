# MCP Application

A modern React application built with TypeScript, SCSS, and Bootstrap CSS featuring a responsive layout with left navigation.

## Features

- **Chat**: Interactive chat interface with message history
- **Agents**: Manage and monitor AI agents
- **MCP (Model Context Protocol)**:
  - **MCP Registry**: Browse and manage MCP servers
  - **MCP Inspector**: Debug and inspect MCP connections using the MCP Inspector library
  - **MCP Client**: Chat interface for interacting with MCP servers
  - **MCP Bridge**: Connect and bridge multiple MCP servers
  - **MCP Bridge Registry**: Manage and monitor MCP bridge connections

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router DOM** for navigation
- **Bootstrap 5** and **React Bootstrap** for responsive UI
- **SCSS** for custom styling
- **Bootstrap Icons** for iconography
- **MCP Inspector** library for protocol debugging

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build

Create a production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── Layout/
│       ├── Layout.tsx          # Main layout with navigation
│       └── Layout.scss         # Layout styles
├── pages/
│   ├── Chat/
│   │   ├── Chat.tsx           # Chat interface
│   │   └── Chat.scss
│   ├── Agents/
│   │   ├── Agents.tsx         # Agents management
│   │   └── Agents.scss
│   └── MCP/
│       ├── MCPRegistry.tsx     # MCP server registry
│       ├── MCPRegistry.scss
│       ├── MCPInspector.tsx    # MCP protocol inspector
│       ├── MCPInspector.scss
│       ├── MCPClient.tsx       # MCP chat client
│       ├── MCPClient.scss
│       ├── MCPBridge.tsx       # MCP bridge connector
│       ├── MCPBridge.scss
│       ├── MCPBridgeRegistry.tsx  # Bridge registry
│       └── MCPBridgeRegistry.scss
├── App.tsx                     # Main app with routing
├── App.scss                    # Global styles
├── main.tsx                    # Entry point
└── index.scss                  # Base styles
```

## Features Breakdown

### Responsive Design

- **Desktop**: Fixed left sidebar navigation (16.67% width)
- **Mobile**: Collapsible offcanvas menu with hamburger button
- Bootstrap's responsive grid system for all pages

### Navigation

The app includes a hierarchical navigation structure:
- Top-level items: Chat, Agents
- MCP section with nested routes:
  - MCP Registry
  - MCP Inspector
  - MCP Client
  - MCP Bridge
  - MCP Bridge Registry

### Styling

- Uses Bootstrap 5 for base components and responsive utilities
- Custom SCSS for enhanced styling and theming
- Dark sidebar with light content area
- Smooth animations and transitions
- Custom scrollbar styling

## Customization

### Colors

Update colors in the SCSS files. The primary Bootstrap theme color can be customized by overriding Bootstrap variables before importing Bootstrap CSS.

### Layout

The sidebar width can be adjusted in `Layout.scss`:
```scss
.sidebar {
  width: 16.66667%; // Adjust this value
}
```

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Add the navigation link in `src/components/Layout/Layout.tsx`

## License

ISC

## Author

Built with ❤️ using React, TypeScript, and Bootstrap

