# Contributing Guide

## Getting Started

1. **Fork and clone** the repository
2. **Install dependencies**: `npm install`
3. **Set up environment**: Copy `.env.example` files and configure
4. **Start development**: `npm run dev`
5. **Verify setup**: Check both server (8080) and web (3000) are running

## Commit Message Style

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(web): add emotion color mapping
fix(server): resolve MongoDB connection timeout
docs(readme): update installation instructions
refactor(shared): simplify validation schemas
test(server): add API endpoint tests
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Scopes

- `web`: Frontend changes
- `server`: Backend changes
- `shared`: Shared package changes
- `deps`: Dependency updates

## Pre-Push Checklist

Before pushing changes, ensure:

- [ ] **Tests pass**: `npm run test`
- [ ] **Linting clean**: `npm run lint`
- [ ] **Type checking**: `npm run typecheck`
- [ ] **No unused code**: `npm run tsprune`
- [ ] **No unused deps**: `npm run depcheck`
- [ ] **Bundle size check**: `npm run build:check`
- [ ] **Environment variables**: All required vars documented

## Code Review Checklist

### Self-Review (Solo Development)

- [ ] **Functionality**: Does the code work as intended?
- [ ] **Performance**: No unnecessary re-renders or API calls?
- [ ] **Accessibility**: Proper ARIA labels and keyboard navigation?
- [ ] **Mobile**: Responsive design on all screen sizes?
- [ ] **Error handling**: Graceful error states and user feedback?
- [ ] **Security**: No sensitive data exposure or injection vulnerabilities?
- [ ] **Code quality**: Clean, readable, and maintainable?
- [ ] **Documentation**: Comments for complex logic?

### Architecture Review

- [ ] **Component placement**: Is it in the right directory?
- [ ] **Import structure**: Using proper aliases and grouping?
- [ ] **Type safety**: Proper TypeScript usage?
- [ ] **Reusability**: Can this be reused elsewhere?
- [ ] **Separation of concerns**: Business logic separated from UI?

## Performance and Dead Code Audits

### Performance Audit

```bash
# Check bundle size
npm run build:check

# Analyze webpack bundle (if using webpack)
npm run analyze

# Lighthouse audit
npm run lighthouse

# Performance monitoring
npm run perf
```

### Dead Code Detection

```bash
# Find unused exports
npm run tsprune

# Find unused dependencies
npm run depcheck

# Find unused CSS classes
npm run purge-css

# Check for dead code in specific files
npx ts-prune src/components/
```

### Optimization Opportunities

- **Code splitting**: Lazy load routes and heavy components
- **Tree shaking**: Use named exports for better optimization
- **Bundle analysis**: Regular size monitoring
- **Image optimization**: Compress and use modern formats
- **Caching**: Implement proper cache headers

## Development Workflow

1. **Create feature branch**: `git checkout -b feature/name`
2. **Make changes**: Follow coding standards and architecture
3. **Test locally**: Ensure all functionality works
4. **Run checks**: Complete pre-push checklist
5. **Commit**: Use conventional commit format
6. **Push**: Create pull request or merge directly
7. **Deploy**: Test in staging before production

## Common Issues

### TypeScript Errors

- Check import paths and aliases
- Ensure all required props are passed
- Verify type definitions match usage

### Build Failures

- Clear `node_modules` and reinstall
- Check for circular dependencies
- Verify all imports are available

### Performance Issues

- Use React DevTools Profiler
- Check for unnecessary re-renders
- Monitor bundle size changes
- Profile API response times
