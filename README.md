# ![Zap](/public/zap.svg) Zap, search for files and folders

<div>
  <a href="https://github.com/BryanVanWinnendael/Zap/releases/latest">
      <img src="https://img.shields.io/github/downloads/BryanVanWinnendael/Zap/total" alt="latest download">
  </a>
  <a href="https://github.com/BryanVanWinnendael/Zap/releases/latest">
      <img src="https://img.shields.io/github/v/release/BryanVanWinnendael/Zap" alt="version">
  </a>
</div>

With zap you can quickly search for a given file or folder.

![Zap](/public/zap2.png)

![Zap](/public/zap.png)

## Supported operating systems
- Windows

This includes following features:
  - load all disks and keep in cache
  - search for a file/folder in all disks
  - quickly go (zap) to the location of the file/folder
  - keep the 10 recent zaps for a quick access
  - light/dark mode
  - keep the searched files/folder to switch between results
  
## Dev Setup/Installation
### Prerequisites
- Stable [NodeJS](https://nodejs.org/) Install
- Stable [Rust](https://www.rust-lang.org/) Install
- Bun installation (`npm install -g bun`)
- Tauri-cli (`cargo install tauri-cli`)

### Install dependencies
```bash
bun i
```

### Run app for development
```bash
cargo tauri dev
```

### Build for production
```bash
cargo tauri build
```