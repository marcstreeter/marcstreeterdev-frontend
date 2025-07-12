# MarcStreeter.dev Frontend justfile
# Run with: just <command>

# Default recipe to run when no arguments are provided
default:
    @just --list

# Check if tilt is installed
_check-tilt:
    #!/usr/bin/env bash
    if ! command -v tilt &> /dev/null; then
        echo "Error: tilt is not installed. Please install tilt first."
        echo "Visit: https://docs.tilt.dev/install.html"
        exit 1
    fi

# Check if docker is installed
_check-docker:
    #!/usr/bin/env bash
    if ! command -v docker &> /dev/null; then
        echo "Error: docker is not installed. Please install docker first."
        exit 1
    fi

# Check if kubectl is installed
_check-kubectl:
    #!/usr/bin/env bash
    if ! command -v kubectl &> /dev/null; then
        echo "Error: kubectl is not installed. Please install kubectl first."
        echo "Visit: https://kubernetes.io/docs/tasks/tools/"
        exit 1
    fi

# Development setup
setup: _check-docker _check-tilt _check-kubectl
    @echo "🔧 Setting up development environment..."
    @echo "Installing dependencies..."
    npm ci
    @echo "Installing git hooks..."
    npx lefthook install
    @echo "✅ Development setup complete!"

# Development with Tilt (recommended)
start: _check-tilt _check-docker _check-kubectl
    @echo "🚀 Starting development environment with Tilt..."
    @echo "This will start the app in a container with live reloading."
    @echo "Access the app at: http://localhost:17300"
    @echo "Access Storybook at: http://localhost:17600"
    @echo "Press Ctrl+C to stop"
    tilt up

# Local development (without Tilt)
start-local:
    @echo "🚀 Starting local development server..."
    @echo "Note: Use 'just dev' for containerized development with Tilt"
    npm run dev

stop: _check-tilt
    @echo "🛑 Stopping development environment..."
    tilt down

# Testing with Tilt
test: _check-tilt
    @echo "🧪 Running tests in the development container..."
    tilt exec marcstreeterdev-frontend npm test

test-watch: _check-tilt
    @echo "🧪 Running tests in watch mode..."
    tilt exec marcstreeterdev-frontend npm run test:ui

test-coverage: _check-tilt
    @echo "🧪 Running tests with coverage..."
    tilt exec marcstreeterdev-frontend npm run test:coverage

# Linting and formatting with Tilt
lint: _check-tilt
    @echo "🔍 Running linter..."
    tilt exec marcstreeterdev-frontend npm run lint

lint-fix: _check-tilt
    @echo "🔧 Fixing linting issues..."
    tilt exec marcstreeterdev-frontend npm run lint:fix

format: _check-tilt
    @echo "💅 Formatting code..."
    tilt exec marcstreeterdev-frontend npm run format

format-check: _check-tilt
    @echo "✅ Checking code formatting..."
    tilt exec marcstreeterdev-frontend npm run format:check

check: _check-tilt
    @echo "🔍 Running Biome check..."
    tilt exec marcstreeterdev-frontend npm run check

check-fix: _check-tilt
    @echo "🔧 Fixing Biome issues..."
    tilt exec marcstreeterdev-frontend npm run check:fix

# Type checking with Tilt
type-check: _check-tilt
    @echo "🔍 Running type check..."
    tilt exec marcstreeterdev-frontend npm run type-check

# Storybook with Tilt
storybook: _check-tilt
    @echo "📚 Starting Storybook..."
    @echo "Access Storybook at: http://localhost:17600"
    tilt exec marcstreeterdev-frontend npm run storybook