# Panel Splitter - Production Setup

A recursive window panel splitter app built with **React + TypeScript**.

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Panel/
│   │   │   ├── Panel.tsx          # Main Panel component
│   │   │   └── index.ts           # Component export
│   │   └── PanelSplitter/
│   │       ├── PanelSplitter.tsx  # Main app container
│   │       └── index.ts           # Component export
│   ├── hooks/
│   │   └── usePanelTree.ts        # Custom hook for panel tree management
│   ├── types/
│   │   ├── panel.ts               # Panel node types
│   │   └── components.ts          # Component prop types
│   ├── utils/
│   │   ├── colorUtils.ts          # Color generation utilities
│   │   └── treeUtils.ts           # Tree traversal utilities
│   ├── constants/
│   │   ├── colors.ts              # Color palettes & UI constants
│   │   └── config.ts              # App configuration
│   ├── styles/
│   │   └── componentStyles.ts     # Inline component styles
│   ├── App.tsx                    # Root component
│   └── main.tsx                   # React entry point
├── public/                        # Static assets
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── tsconfig.node.json             # TypeScript Node config
├── vite.config.ts                 # Vite build config
├── .eslintrc.json                 # ESLint rules
└── .gitignore                     # Git ignore rules
```

## 🚀 Get Started

### Install Dependencies
```bash
cd frontend
npm install
```

### Start Development Server
```bash
npm run dev
```

The app opens at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 🏗️ Architecture

### Types (`src/types/`)
- **panel.ts** - Defines `LeafNode` and `SplitNode` structures
- **components.ts** - React component prop interfaces

### Utilities (`src/utils/`)
- **colorUtils.ts** - Random color generation, node ID management
- **treeUtils.ts** - Tree traversal and node updates

### Hooks (`src/hooks/`)
- **usePanelTree.ts** - State management for panel operations (split, remove, resize)

### Components (`src/components/`)
- **Panel** - Main recursive component handling both leaf and split nodes
- **PanelSplitter** - App container component

### Styles (`src/styles/`)
- Centralized inline styles using TypeScript for type safety

### Constants (`src/constants/`)
- Color palettes, UI dimensions, configuration

## 🎯 Features

✅ **Recursive Panel Tree** - Infinite nesting capability  
✅ **TypeScript** - Full type safety across codebase  
✅ **Modular Architecture** - Separated concerns (hooks, utils, types, styles)  
✅ **Production-Ready** - ESLint, proper build config, scalable structure  
✅ **Path Aliases** - `@components`, `@hooks`, `@utils`, etc.  
✅ **Responsive Design** - All panels fill available space  
✅ **Draggable Dividers** - Smooth resize between panels  
✅ **12 Vibrant Colors** - Random bright colors for visual appeal

## 📦 Tech Stack

- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Vite 5** - Build tool
- **ESLint** - Code quality
