# 🎮 Colorful Tetris for Kids! ✨

A fun and colorful Tetris game designed specifically for kids (ages 5-8), featuring:
- 🌈 Bright, colorful tetromino pieces
- 💥 Explosive animations when lines are cleared  
- 🎯 Kid-friendly interface with large, colorful buttons
- ⌨️ Simple keyboard controls
- 🎨 Beautiful gradient backgrounds and smooth animations

## 🕹️ How to Play

- **Arrow Keys**: Move pieces left/right and down
- **Up Arrow**: Rotate pieces
- **Spacebar**: Drop piece instantly
- **P**: Pause/Resume game

## 🚀 Play Online

Visit the live game at: `https://YOUR_USERNAME.github.io/tetris-game/`

## 🛠️ Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

### Prerequisites
- Node.js (recommend using Node 16 or earlier due to legacy Angular version)
- npm

### Running Locally

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server (use legacy OpenSSL provider)
NODE_OPTIONS="--openssl-legacy-provider" ng serve

# Build for production
NODE_OPTIONS="--openssl-legacy-provider" ng build --prod
```

### GitHub Pages Deployment

```bash
# Build and deploy to GitHub Pages
NODE_OPTIONS="--openssl-legacy-provider" ng build --prod --base-href="/tetris-game/"
npx angular-cli-ghpages --dir=dist/tetris-game
```

## 🎯 Features

- **Colorful Design**: Each tetromino piece has a unique bright color
- **Explosive Animations**: When lines are cleared, they explode with colorful particle effects
- **Kid-Friendly UI**: Large buttons, clear text, and Comic Sans font
- **Responsive Design**: Works on desktop and tablet
- **Score Tracking**: Points, level progression, and lines cleared
- **Next Piece Preview**: Shows the upcoming tetromino

## 🧩 Game Architecture

- **Models**: `tetris.model.ts` - Game state and piece definitions
- **Service**: `tetris-game.service.ts` - Core game logic and state management
- **Component**: `tetris-board.component.*` - Game display and user interaction

## 🚀 Generated with [Claude Code](https://claude.ai/code)

This project was created with assistance from Claude Code, featuring:
- Complete Angular architecture
- RxJS state management
- CSS animations and effects
- TypeScript game logic
- GitHub Pages deployment ready

Co-Authored-By: Claude <noreply@anthropic.com>
