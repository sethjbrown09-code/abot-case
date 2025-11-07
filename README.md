<div align="center">

# 🤖 Abot-MD WhatsApp Bot

_A powerful and feature-rich WhatsApp bot built with Node.js_

[![Visitors](https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2Fahlulmukh%2Fabot-case&countColor=%23263759)](https://visitorbadge.io/status?path=https%3A%2F%2Fgithub.com%2Fahlulmukh%2Fabot-case)
[![Forks](https://img.shields.io/github/forks/ahlulmukh/Abot-MD?label=Forks&color=blue&style=flat-square)](https://github.com/ahlulmukh/Abot-MD/network/members)
[![Watchers](https://img.shields.io/github/watchers/ahlulmukh/Abot-MD?label=Watchers&color=green&style=flat-square)](https://github.com/ahlulmukh/Abot-MD/watchers)
[![Stars](https://img.shields.io/github/stars/ahlulmukh/Abot-MD?label=Stars&color=yellow&style=flat-square)](https://github.com/ahlulmukh/Abot-MD/stargazers)
[![Contributors](https://img.shields.io/github/contributors/ahlulmukh/Abot-MD?label=Contributors&color=blue&style=flat-square)](https://github.com/ahlulmukh/Abot-MD/graphs/contributors)
[![Issues](https://img.shields.io/github/issues/ahlulmukh/Abot-MD?label=Issues&color=success&style=flat-square)](https://github.com/ahlulmukh/Abot-MD/issues)
[![Closed Issues](https://img.shields.io/github/issues-closed/ahlulmukh/Abot-MD?label=Closed&color=red&style=flat-square)](https://github.com/ahlulmukh/Abot-MD/issues?q=is%3Aissue+is%3Aclosed)
[![Pull Requests](https://img.shields.io/github/issues-pr/ahlulmukh/Abot-MD?label=PRs&color=success&style=flat-square)](https://github.com/ahlulmukh/Abot-MD/pulls)
[![Closed PRs](https://img.shields.io/github/issues-pr-closed/ahlulmukh/Abot-MD?label=Closed&color=red&style=flat-square)](https://github.com/ahlulmukh/Abot-MD/pulls?q=is%3Apr+is%3Aclosed)

</div>

---

## 📖 About This Bot

**Abot-MD** is a comprehensive WhatsApp bot built with Node.js and Baileys library. It features a modular case-based system that makes it easy to use, maintain, and extend with additional functionality.

### ✨ Key Features

- 🏗️ **Modular Architecture**: Built with a case-based system for easy development and maintenance
- 🔧 **Highly Configurable**: Easy configuration through setting files
- 🎯 **Multi-Platform Support**: Works on Termux, Ubuntu, Windows, VPS, and RDP
- 🤖 **AI Integration**: Supports OpenAI ChatGPT integration
- 📱 **Rich Media Support**: Handles images, videos, stickers, and documents
- 🛡️ **Security Features**: Anti-link, group management, and user controls
- 💾 **Database Management**: Built-in database for user data, groups, and configurations
- 🎨 **Customizable**: Easy to customize and add new commands

---

## 🚀 Installation Guide

### 📱 For Termux/Ubuntu/SSH Users

#### Prerequisites

Make sure you have sufficient storage space and a stable internet connection.

```bash
# Update system packages
apt update && apt upgrade -y

# Install required dependencies
apt install git nodejs ffmpeg imagemagick yarn -y

# Clone the repository
git clone https://github.com/ahlulmukh/Abot-MD
cd Abot-MD

# Install project dependencies
yarn install

# Start the bot
yarn start
```

### 💻 For Windows/VPS/RDP Users

#### Prerequisites Installation

Download and install the following software:

| Software        | Link                                                    | Notes                                            |
| --------------- | ------------------------------------------------------- | ------------------------------------------------ |
| **Git**         | [Download](https://git-scm.com/downloads)               | Version control system                           |
| **Node.js**     | [Download](https://nodejs.org/en/download)              | JavaScript runtime (LTS version recommended)     |
| **FFmpeg**      | [Download](https://ffmpeg.org/download.html)            | **Important:** Add to PATH environment variables |
| **ImageMagick** | [Download](https://imagemagick.org/script/download.php) | Image processing library                         |

#### Installation Steps

```bash
# Clone the repository
git clone https://github.com/ahlulmukh/Abot-MD
cd Abot-MD

# Install dependencies
npm install

# Update packages (optional)
npm update

# Start the bot
npm start
```

### 🐳 Docker Installation (Alternative)

```bash
# Clone the repository
git clone https://github.com/ahlulmukh/Abot-MD
cd Abot-MD

# Build Docker image
docker build -t abot-md .

# Run container
docker run -d --name abot-md-container abot-md
```

---

## ⚙️ Configuration

### Basic Configuration

1. **Open the configuration file:**

   ```bash
   config/setting.js
   ```

2. **Configure the following settings:**

```javascript
// Bot Owner Configuration
global.owner = ["+639641001139"]; // Your phone number without +
global.ownerNumber = ["your_number@s.whatsapp.net"];
global.nomerOwner = "your_phone_number";

// Bot Information
global.namabotnya = "YourBotName"; // Bot display name
global.namaownernya = "sethinoo"; // Your name

// OpenAI Configuration (for ChatGPT features)
global.keyopenai = "your_openai_api_key_here"; // Get from https://platform.openai.com/

// API Keys (Optional)
global.APIKeys = {
  "https://tools.betabotz.eu.org/": "your_api_key",
  "https://api.ryzendesu.vip/": "your_api_key",
};
```

### 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Bot Configuration
BOT_NAME=sethinoo
OWNER_NAME=seth
OWNER_NUMBER=639641001139

# API Keys
OPENAI_API_KEY=your_openai_api_key
BETABOTZ_API_KEY=your_betabotz_api_key
RYZENDESU_API_KEY=your_ryzendesu_api_key

# Database
DATABASE_URL=your_database_url (if using external database)
```

---

## 🏃 Running the Bot

### Standard Run

```bash
# Using Node.js
node main.js

# Or using npm
npm start

# Or using yarn
yarn start
```

### Development Mode

```bash
# With auto-restart on file changes
npm install -g nodemon
nodemon main.js
```

### Production Mode

```bash
# Using PM2 for production
npm install -g pm2
pm2 start main.js --name "abot-md"
pm2 save
pm2 startup
```

---

## 📚 Project Structure

```
abot-case/
├── 📁 config/           # Configuration files
│   ├── config.json      # Bot configuration
│   └── setting.js       # Main settings
├── 📁 function/         # Core functionality
│   ├── case.js          # Command handlers
│   ├── 📁 database/     # Database files
│   ├── 📁 lib/          # Utility libraries
│   └── 📁 image/        # Bot images and media
├── 📁 session/          # WhatsApp session data
├── 📁 sticker/          # Sticker configuration
├── main.js              # Main bot file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

---

## 🔧 Commands and Features

### General Commands

- `!help` - Display help menu
- `!info` - Bot information
- `!ping` - Check bot response time

### Media Commands

- `!sticker` - Convert images/videos to stickers
- `!toimg` - Convert sticker to image
- `!download` - Download media from URLs

### Group Management

- `!antilink` - Toggle anti-link protection
- `!welcome` - Set welcome message
- `!kick` - Remove user from group (admin only)

### AI Features

- `!ai [question]` - Chat with AI
- `!img [prompt]` - Generate images with AI

_Use `!menu` command in WhatsApp to see all available commands_

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 🐛 Troubleshooting

### Common Issues

#### Bot not responding

- Check internet connection
- Verify WhatsApp session is active
- Check console for error messages

#### Installation errors

- Ensure Node.js version is 16 or higher
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

#### Session expired

- Delete `session` folder
- Restart bot and rescan QR code

### Getting Help

- 📧 Email: [ahluldev20@gmail.com](mailto:ahluldev20@gmail.com)
- 💬 Telegram: [@ahlulmukh](https://t.me/ahlulmukh)
- 🐛 Issues: [GitHub Issues](https://github.com/ahlulmukh/Abot-MD/issues)

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Thanks to [@WhiskeySockets](https://github.com/WhiskeySockets) for the Baileys library
- Thanks to all contributors who help improve this project
- Special thanks to the open-source community

---

## 📱 Connect With Developer

<div align="center">

[![Instagram](https://img.shields.io/badge/-Instagram-e4405f?style=for-the-badge&logo=Instagram&logoColor=white)](https://www.instagram.com/ahlulmukh)
[![Facebook](https://img.shields.io/badge/-Facebook-1877f2?style=for-the-badge&logo=Facebook&logoColor=white)](https://facebook.com/ahlulmukh)
[![Telegram](https://img.shields.io/badge/-Telegram-0088cc?style=for-the-badge&logo=Telegram&logoColor=white)](https://t.me/ahlulmukh)
[![WhatsApp](https://img.shields.io/badge/-WhatsApp-25d366?style=for-the-badge&logo=WhatsApp&logoColor=white)](https://s.id/1Gqvt)
[![Email](https://img.shields.io/badge/-Email-ea4335?style=for-the-badge&logo=Gmail&logoColor=white)](mailto:ahluldev20@gmail.com)
[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)](https://github.com/ahlulmukh)

</div>

---

<div align="center">

**Made with ❤️ by [Ahlul Mukh](https://github.com/ahlulmukh)**

_If this project helped you, please consider giving it a ⭐_

</div>

