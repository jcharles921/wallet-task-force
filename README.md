# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

This template uses the SWC plugin by default.

## Overview
```
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── containers/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── package.json
├── index.html
├── eslint.config.js
├── tsconfig.app.json
├── tsconfig.node.json
├── tsconfig.json
├── README.md
└── vite.config.ts 
```
## Folders 

- **assets/**: Manages static resources like images and fonts.
- **components/**: Reusable, smaller UI components used throughout the app.
- **constants/**: Stores static values and configuration settings to maintain consistency.
- **containers/**: Holds more complex components responsible for business logic and data handling.
- **pages/**: Each file represents a different route/view in the application.
- **styles/**: Central location for defining global and modular styles for the app.
- **utils/**: Houses helper functions and reusable logic that can be used across components.