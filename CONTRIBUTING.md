# Contributing to Hono Starter Kit

Thank you for your interest in contributing! This document provides guidelines for contributing to the Hono Starter Kit template.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/hono-starter-kit.git
   cd hono-starter-kit
   ```
3. **Install dependencies**
   ```bash
   pnpm install
   ```
4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. **Make your changes**
   - Follow the existing code style
   - Keep changes focused and atomic
   - Write clear, concise commit messages

2. **Test your changes**
   ```bash
   pnpm lint          # Check code style
   pnpm typecheck     # Verify TypeScript types
   pnpm build         # Ensure it builds
   pnpm dev           # Test locally
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**

## Commit Message Guidelines

Follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `style:` - Code style changes

Example:
```
feat: add user authentication middleware
fix: resolve database connection timeout
docs: update README with deployment instructions
```

## Code Style

- Use **TypeScript** for all code
- Follow the **ESLint** configuration
- Use **meaningful variable names**
- Add **JSDoc comments** for complex functions
- Keep functions **small and focused**

## Pull Request Guidelines

- **One feature per PR**
- **Update documentation** if needed
- **Add tests** for new features
- **Ensure CI passes** (linting, type checking, build)
- **Keep PR description clear** - explain what and why

## Questions or Issues?

- Open an issue for bugs or feature requests
- Use discussions for questions
- Be respectful and constructive

Thank you for contributing! 🎉
