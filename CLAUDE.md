# CLAUDE.md - AI Assistant Guide

> **Purpose**: This file provides AI assistants with comprehensive context about this repository's structure, conventions, and development workflows. Keep this document updated as the codebase evolves.

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Codebase Structure](#codebase-structure)
3. [Development Workflow](#development-workflow)
4. [Code Conventions](#code-conventions)
5. [Testing Guidelines](#testing-guidelines)
6. [Deployment](#deployment)
7. [Common Tasks](#common-tasks)
8. [AI Assistant Guidelines](#ai-assistant-guidelines)

---

## Repository Overview

**Repository Name**: `alonyaaran-stack/claude`

**Current Status**: ⚠️ Fresh repository - codebase structure to be defined

**Main Technologies**: _To be determined as project develops_

**Purpose**: _Document the primary purpose and goals of this project_

### Quick Start

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd claude

# Setup instructions to be added as project develops
```

---

## Codebase Structure

**Current State**: Repository is newly initialized. Structure will be documented here as the codebase grows.

### Recommended Directory Structure

When developing this project, consider organizing code with the following structure:

```
/
├── src/              # Source code
├── tests/            # Test files
├── docs/             # Documentation
├── config/           # Configuration files
├── scripts/          # Build and utility scripts
├── .github/          # GitHub workflows and templates
├── CLAUDE.md         # This file
└── README.md         # User-facing documentation
```

### Key Files and Directories

_This section will be populated as the codebase develops. Document important files, their purposes, and when AI assistants should modify them._

---

## Development Workflow

### Branch Strategy

**Current Branch**: `claude/claude-md-mkkxehagjkbsgmhz-h4bPD`

**Branch Naming Convention**:
- Feature branches: `claude/<description>-<session-id>`
- All development branches must start with `claude/` and end with matching session ID
- Critical: Branches not following this pattern will fail on push with 403 error

### Git Operations

**Pushing Changes**:
```bash
git push -u origin <branch-name>
```
- Always use `-u` flag for setting upstream
- Branch must start with 'claude/' and end with session ID
- Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s) on network errors

**Fetching/Pulling**:
```bash
git fetch origin <branch-name>
git pull origin <branch-name>
```
- Prefer fetching specific branches
- Retry up to 4 times with exponential backoff on network failures

### Commit Message Guidelines

Format: `<type>: <description>`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

**Example**:
```
feat: add user authentication module

- Implement JWT-based authentication
- Add login and registration endpoints
- Include password hashing with bcrypt
```

---

## Code Conventions

_Document language-specific conventions, naming patterns, and architectural decisions here as the project develops._

### General Principles

1. **Simplicity First**: Avoid over-engineering. Implement only what's needed.
2. **No Premature Abstraction**: Don't create utilities for one-time operations.
3. **Clear Naming**: Use descriptive variable and function names.
4. **Minimal Comments**: Code should be self-documenting; add comments only for complex logic.
5. **Security**: Always validate input at system boundaries. Check for OWASP Top 10 vulnerabilities.

### Code Style

_To be defined based on chosen programming language and framework._

**Placeholder Guidelines**:
- Indentation: [tabs/spaces]
- Line length: [character limit]
- Naming: [camelCase/snake_case/PascalCase]
- File organization: [module patterns]

---

## Testing Guidelines

_Document testing frameworks, patterns, and requirements as the project develops._

### Test Structure

**Unit Tests**: _Location and patterns_

**Integration Tests**: _Location and patterns_

**E2E Tests**: _Location and patterns_

### Running Tests

```bash
# Commands to be added
```

### Test Coverage

_Define minimum coverage requirements and how to measure them._

---

## Deployment

_Document deployment processes, environments, and CI/CD pipelines._

### Environments

- **Development**: _Configuration details_
- **Staging**: _Configuration details_
- **Production**: _Configuration details_

### CI/CD Pipeline

_Document automated workflows, checks, and deployment steps._

---

## Common Tasks

### Adding a New Feature

1. Create a feature branch with proper naming convention
2. Implement the feature with tests
3. Update documentation if needed
4. Commit with descriptive message
5. Push to remote branch
6. Create pull request

### Fixing a Bug

1. Identify the root cause
2. Add a test that reproduces the bug
3. Implement the fix
4. Verify the test passes
5. Commit and push changes

### Updating Dependencies

_Document process for dependency management_

---

## AI Assistant Guidelines

### Core Principles

1. **Read Before Modifying**: Always read files before suggesting changes
2. **Use Specialized Tools**: Prefer Read/Edit/Write over bash commands for file operations
3. **Avoid Over-engineering**: Don't add features beyond what's requested
4. **Security First**: Check for common vulnerabilities (XSS, SQL injection, command injection, etc.)
5. **Test Changes**: Run tests after making significant changes
6. **Incremental Changes**: Make small, focused commits

### Best Practices

**File Operations**:
- ✅ Use `Read` tool to read files
- ✅ Use `Edit` tool for modifications
- ✅ Use `Write` tool for new files
- ❌ Don't use `cat`, `sed`, `awk` via Bash for file operations

**Code Changes**:
- Always understand existing code before modifying
- Don't add unnecessary abstractions
- Don't refactor code unless specifically asked
- Keep changes minimal and focused
- Avoid backwards-compatibility hacks for unused code

**Git Operations**:
- Never skip hooks (no `--no-verify`)
- Never force push to main/master
- Never update git config without permission
- Create commits only when requested
- Follow the branch naming convention strictly

**Communication**:
- Keep responses concise for CLI display
- Use GitHub-flavored markdown
- Don't use emojis unless requested
- Output text directly, not via bash echo

### Task Management

Use `TodoWrite` tool for:
- Multi-step tasks (3+ steps)
- Complex implementations
- User-provided task lists
- Tracking progress on non-trivial work

Don't use for:
- Single, straightforward tasks
- Trivial operations
- Purely conversational responses

### Error Handling

When encountering errors:
1. Read the error message carefully
2. Check relevant files for context
3. Fix the issue incrementally
4. Test the fix
5. Document if it reveals a pattern

### Code Review Checklist

Before committing code, verify:
- [ ] Code follows project conventions
- [ ] No security vulnerabilities introduced
- [ ] Tests pass (if applicable)
- [ ] No unnecessary complexity added
- [ ] Documentation updated if needed
- [ ] Commit message is clear and descriptive

---

## Project-Specific Notes

_Add any project-specific quirks, gotchas, or important context here._

### Known Issues

_Document known issues and their workarounds._

### Dependencies

_List critical dependencies and their purposes._

### External Services

_Document any external APIs, databases, or services the project depends on._

---

## Maintenance

**Last Updated**: 2026-01-19

**Update Frequency**: This file should be updated whenever:
- Major architectural decisions are made
- New conventions are established
- Project structure changes significantly
- New workflows are introduced
- Important patterns emerge

**Maintainers**: _List maintainers or teams responsible for keeping this file current_

---

## Additional Resources

- [README.md](./README.md) - User-facing documentation
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines (if applicable)
- _Add links to relevant documentation as project grows_

---

**Note to AI Assistants**: As you work with this codebase, please update this document with any patterns, conventions, or important context you discover. This helps future AI assistants (and human developers) understand the codebase more quickly.
