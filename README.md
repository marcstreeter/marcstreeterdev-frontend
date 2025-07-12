# MarcStreeter.dev Frontend

## Requirements

- [Node.js 18.x](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Tilt](https://docs.tilt.dev/install.html)
- [kubectl](https://kubernetes.io/docs/tasks/tools/) - for Kubernetes operations
- [asdf](https://asdf-vm.com) - for local installs (optional, see .tool-versions)

A React + TypeScript + Vite frontend application for MarcStreeter.dev.

## Development

This project uses a justfile for all development tasks.
### Quick Start

```bash
just  # see all available commands
```

#### Development Configuration (Optional)

Copy `.env.sample` to `.env` and modify the values as needed for your local development:

```bash
cp .env.sample .env
```

## Production Deployment

In production (GitHub Pages), the application will use the default values unless overridden at build time.
