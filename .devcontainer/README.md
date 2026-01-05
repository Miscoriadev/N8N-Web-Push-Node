# n8n Node Development Container

This devcontainer provides a complete development environment for building n8n community nodes.

## What's Included

### Base Image
- **Node.js 22** (Bookworm-based Debian)
- TypeScript support
- npm package manager

### VS Code Extensions
- **ESLint** - Code quality and linting
- **Prettier** - Code formatting
- **EditorConfig** - Consistent coding styles
- **TypeScript** - Enhanced TypeScript support
- **Pretty TS Errors** - Better TypeScript error messages
- **Code Spell Checker** - Catch typos in code and comments

### Features
- **Git** - Version control
- **GitHub CLI** - GitHub operations from terminal

### Port Forwarding
- **Port 5678** - n8n web interface (auto-forwarded)

## Getting Started

### Prerequisites
- Docker Desktop installed
- VS Code with Remote-Containers extension

### Opening the Project

1. Open VS Code
2. Open this folder
3. When prompted, click "Reopen in Container"
   - Or use Command Palette: `Remote-Containers: Reopen in Container`

The container will:
1. Build the development environment
2. Install all npm dependencies automatically
3. Configure VS Code settings
4. Forward port 5678 for n8n

### Development Workflow

Once the container is running:

```bash
# Start n8n with hot reload
npm run dev

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Build for production
npm run build
```

Access n8n at: http://localhost:5678

## Container Features

### Automatic Setup
- Git configuration mounted from host
- npm dependencies installed on container creation
- ESLint and Prettier configured
- Format on save enabled

### Environment Variables
- `N8N_REINSTALL_MISSING_PACKAGES=true` - Ensures n8n packages are available

## Customization

### Adding Extensions
Edit `.devcontainer/devcontainer.json` and add to the `extensions` array:

```json
"customizations": {
  "vscode": {
    "extensions": [
      "your.extension.id"
    ]
  }
}
```

### Changing Node Version
Modify the `image` property in `devcontainer.json`:

```json
"image": "mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm"
```

### Additional Tools
Add features in the `features` section:

```json
"features": {
  "ghcr.io/devcontainers/features/docker-in-docker:2": {}
}
```

## Troubleshooting

### Container Won't Start
- Ensure Docker Desktop is running
- Check Docker has enough resources (4GB+ RAM recommended)
- Try rebuilding: `Remote-Containers: Rebuild Container`

### Port 5678 Already in Use
- Stop any local n8n instances
- Or change port in `devcontainer.json`:
  ```json
  "forwardPorts": [5679]
  ```

### npm Dependencies Not Installing
- Rebuild container: `Remote-Containers: Rebuild Container`
- Or run manually: `npm install`

### Git Config Not Available
- Ensure your `.gitconfig` exists in your home directory
- Check mount path in `devcontainer.json` matches your OS

## Claude Configuration

The `.claude/claude_config.json` file configures Claude Code for n8n development:

- **Allowed Tools**: All Claude Code tools enabled
- **Auto-approve**: Read, write, and common npm/git commands
- **System Prompt**: Tailored for n8n node development
- **Rules**: n8n best practices and conventions
- **File Watching**: Monitors TypeScript files for changes

## Additional Resources

- [Dev Containers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [n8n Node Development Guide](../N8N_CUSTOM_NODE_GUIDE.md)
- [n8n Official Docs](https://docs.n8n.io/integrations/creating-nodes/)
