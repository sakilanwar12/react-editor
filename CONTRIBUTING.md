# Contributing to React File Upload UI

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Development Workflow](#development-workflow)
  - [Project Structure](#project-structure)
  - [Running the Playground](#running-the-playground)
- [Building](#building)
- [Pull Requests](#pull-requests)
- [License](#license)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [pnpm](https://pnpm.io/) (This project uses pnpm workspaces)

### Installation

1. Fork the repository on GitHub.
2. Clone your forked repository:

```bash
git clone https://github.com/YOUR-USERNAME/react-file-upload-ui.git
cd react-file-upload-ui
```

3. Install dependencies:

```bash
pnpm install
```

## Development Workflow

### Project Structure

This repository is set up as a monorepo:

- **`packages/`**: Contains the source code for the `react-file-upload-ui` library.
- **`playground/`**: A React application used for testing and developing the library.

### Running the Playground

We use a playground app to test changes in real-time.

1. Start the development server:

```bash
npm run dev
# or
pnpm dev
```

This command starts the Vite development server for the playground. You can open it in your browser (usually at `http://localhost:5173`).

2. Making changes:
   - Modify the source code in `packages/src`.
   - The playground is linked to the local package, so changes should be reflected immediately or after a reload.

## Building

To build the package for production:

```bash
npm run build
# or
pnpm build
```

This will:

- Build the React package in `packages/` using `tsup`.
- Generate the CSS bundles.

## Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. Ensure the test suite passes (if applicable).
4. Make sure your code lints.
5. Create the pull request!

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
