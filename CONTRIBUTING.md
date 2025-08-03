# Contributing to AICcountancy

Thank you for your interest in contributing to AICcountancy! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [AI Development Guidelines](#ai-development-guidelines)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/AICcountancy.git`
3. Install dependencies: `npm install`
4. Copy config template: `cp config/default.json config/local.json`
5. Update database connection in `config/local.json`
6. Start development server: `npm start`

## Development Process

### 1. Create an Issue
- Check existing issues before creating a new one
- Use the appropriate issue template
- Provide clear description and acceptance criteria

### 2. Create a Branch
```bash
git checkout -b feature/issue-123-brief-description
```

Branch naming conventions:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `enhancement/` - Improvements to existing features
- `hotfix/` - Urgent production fixes

### 3. Make Changes
- Write clean, self-documenting code
- Add tests for new functionality
- Update documentation as needed
- Follow the coding standards below

### 4. Test Your Changes
```bash
npm test
```

### 5. Submit a Pull Request
- Use the pull request template
- Reference the related issue
- Ensure all tests pass
- Request review from maintainers

## Coding Standards

### JavaScript Style
```javascript
// Allman brace style
function exampleFunction(param)
{
    if (param)
    {
        return true;
    }
    else
    {
        return false;
    }
}

// Use single quotes for strings
const message = 'Hello World';

// 4-space indentation
function nestedExample()
{
    const obj = 
    {
        key: 'value',
        nested: 
        {
            deep: true
        }
    };
}
```

### Best Practices
- Use meaningful variable and function names
- Keep functions small and focused
- Add JSDoc comments for public functions
- Handle errors appropriately
- Log important operations using Winston

### File Organization
- Controllers in `/controllers/`
- Models in `/models/`
- Services in `/services/`
- AI services in `/services/ai/`
- Views in `/views/`

## Commit Messages

Follow conventional commit format:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

Example:
```
feat(ai): add document intelligence service

Implement OCR and data extraction for invoices using AI
- Support PDF and image formats
- Extract vendor, amount, date fields
- Add fallback for manual entry

Closes #123
```

## Pull Request Process

1. Update your branch with latest master
2. Run tests and ensure they pass
3. Update documentation if needed
4. Fill out the PR template completely
5. Link related issues
6. Request review from maintainers
7. Address review feedback promptly
8. Squash commits if requested

## AI Development Guidelines

When working on AI features:

### 1. Provider Abstraction
Always use the provider pattern:
```javascript
// Good
const aiService = AIServiceFactory.create(config.aiProvider);
const result = await aiService.extractData(document);

// Bad
const result = await openai.extractData(document);
```

### 2. Error Handling
Implement graceful fallbacks:
```javascript
try 
{
    const aiResult = await aiService.process(data);
    return aiResult;
}
catch (error) 
{
    logger.error('AI service failed', error);
    return fallbackProcess(data);
}
```

### 3. Cost Management
- Cache AI responses when appropriate
- Use feature flags to control AI usage
- Log API usage for monitoring

### 4. Privacy & Security
- Never log sensitive data
- Obtain user consent for AI processing
- Use environment variables for API keys
- Implement data retention policies

### 5. Testing AI Features
- Mock AI services in unit tests
- Create integration tests with real services (use test API keys)
- Test fallback behaviors
- Benchmark performance impact

## Questions?

If you have questions, please:
1. Check the documentation
2. Search existing issues
3. Ask in the discussions section
4. Contact maintainers

Thank you for contributing to AICcountancy!