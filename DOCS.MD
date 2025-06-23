# Bagah WhatsApp Library

[![NPM Version](https://img.shields.io/npm/v/@bagah/whatsapp-lib)](https://www.npmjs.com/package/@bagah/whatsapp-lib)
[![NPM Downloads](https://img.shields.io/npm/dm/@bagah/whatsapp-lib)](https://www.npmjs.com/package/@bagah/whatsapp-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A professional WhatsApp Bot library built on top of Baileys, providing powerful utilities for WhatsApp automation, message serialization, and bot development.

## ✨ Features

- 🚀 **High Performance** - Optimized for production use
- 📱 **Complete WhatsApp Integration** - Built on Baileys WebSocket
- 🔄 **Message Serialization** - Advanced message handling and storage
- 🛠️ **Rich Utilities** - Comprehensive utility functions
- 🖼️ **EXIF Handling** - Image metadata management
- 📦 **TypeScript Support** - Full type definitions included
- 🌐 **ESM & CommonJS** - Works with both module systems
- 🔧 **Easy Integration** - Simple API design

## 📦 Installation

```bash
npm install @bagah/whatsapp-lib
```

```bash
yarn add @bagah/whatsapp-lib
```

```bash
pnpm add @bagah/whatsapp-lib
```

## 🚀 Quick Start

### ESM (ES Modules)

```javascript
import {
  createSocket,
  BotUtils,
  serialize,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} from "@bagah/whatsapp-lib";

// Create WhatsApp connection
const { state, saveCreds } = await useMultiFileAuthState("session");
const { version } = await fetchLatestBaileysVersion();

const sock = createSocket({
  auth: state,
  printQRInTerminal: true,
  version,
});

// Handle connection updates
sock.ev.on("connection.update", (update) => {
  const { connection, lastDisconnect } = update;
  if (connection === "close") {
    const shouldReconnect =
      lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
    if (shouldReconnect) {
      console.log("Reconnecting...");
    }
  }
});

// Save credentials
sock.ev.on("creds.update", saveCreds);

// Use utilities
const phoneNumber = BotUtils.formatPhone("+1234567890");
console.log("Formatted:", phoneNumber);

// Serialize messages
const serialized = serialize(messageObject);
console.log("Serialized:", serialized);
```

### CommonJS

```javascript
const {
  createSocket,
  BotUtils,
  serialize,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} = require("@bagah/whatsapp-lib");

// Same usage as ESM but with require syntax
```

> **📌 Note:** You don't need to install `@whiskeysockets/baileys` separately! All Baileys functions are included in this library.

## 📖 API Documentation

### Core Functions

#### `createSocket(options)`

Creates a WhatsApp WebSocket connection with extended functionality.

```javascript
import { createSocket } from "@bagah/whatsapp-lib";

const sock = createSocket({
  printQRInTerminal: true,
  browser: ["Bot", "Chrome", "1.0.0"],
});
```

**Extended Methods Available:**

- `sock.reply(jid, text, quoted, options)` - Reply to messages
- `sock.sendReact(jid, emoji, messageKey)` - Send reactions
- `sock.sendContact(jid, contacts, quoted, info)` - Send contact cards
- `sock.sendProgress(jid, text, quoted)` - Send progress bar animation
- `sock.sendMessageModify(jid, text, quoted, properties)` - Send with external ad reply
- `sock.getName(jid)` - Get contact/group name
- `sock.groupAdmin(jid)` - Get group admins
- `sock.downloadMediaMessage(message)` - Download media files
- `sock.copyNForward(jid, message, options)` - Copy and forward messages

#### `serialize(message)`

Serializes WhatsApp messages for easier handling and storage.

```javascript
import { serialize } from "@bagah/whatsapp-lib";

sock.ev.on("messages.upsert", ({ messages }) => {
  for (const msg of messages) {
    const m = serialize(msg);

    console.log("Message Info:", {
      from: m.sender,
      chat: m.chat,
      text: m.text,
      isGroup: m.isGroup,
      messageType: m.mtype,
    });
  }
});
```

**Serialized Message Properties:**

- `m.text` - Message text content
- `m.sender` - Sender JID
- `m.chat` - Chat JID
- `m.isGroup` - Boolean if from group
- `m.mtype` - Message type (text, image, video, etc.)
- `m.quoted` - Quoted message info
- `m.mentionedJid` - Array of mentioned users
- `m.key` - Message key for operations

### BotUtils

Comprehensive utility functions for WhatsApp bot development.

```javascript
import { BotUtils } from "@bagah/whatsapp-lib";
```

#### Phone Number Utilities

```javascript
// Format phone numbers
const formatted = BotUtils.formatPhone("+1234567890");
// Returns: '1234567890@s.whatsapp.net'

// Validate phone numbers
const isValid = BotUtils.isValidPhone("+1234567890");
// Returns: boolean
```

#### Text Processing

```javascript
// Parse commands from text
const parsed = BotUtils.parseCommand(".help command arg1 arg2");
// Returns: { command: 'help', args: ['command', 'arg1', 'arg2'] }

// Generate random strings
const randomId = BotUtils.generateId(10);
// Returns: random alphanumeric string

// Clean text (remove special characters)
const cleaned = BotUtils.cleanText("Hello @user! #hashtag");
// Returns: cleaned text
```

#### File Utilities

```javascript
// Check if URL is valid
const isValidUrl = BotUtils.isUrl("https://example.com");
// Returns: boolean

// Get file extension
const ext = BotUtils.getFileExt("image.jpg");
// Returns: 'jpg'

// Format file size
const size = BotUtils.formatBytes(1024);
// Returns: '1.0 KB'
```

#### Time Utilities

```javascript
// Format duration
const duration = BotUtils.formatDuration(3661);
// Returns: '1h 1m 1s'

// Get timestamp
const timestamp = BotUtils.timestamp();
// Returns: formatted current timestamp

// Time difference
const diff = BotUtils.timeDiff(date1, date2);
// Returns: formatted time difference
```

### ExifHandler

Advanced image metadata and EXIF data handling for stickers and media.

```javascript
import { ExifHandler } from "@bagah/whatsapp-lib";

const exifHandler = new ExifHandler();
```

#### Add EXIF Data to Images

```javascript
// Add sticker metadata
const stickerWithExif = await exifHandler.addExif(imageBuffer, {
  packname: "My Sticker Pack",
  author: "Bot Creator",
  categories: ["😀", "😎"],
  id: "com.mybot.stickers",
  publisher: "My Bot",
});

// Send as sticker
await sock.sendMessage(jid, {
  sticker: stickerWithExif,
});
```

#### Image Processing

```javascript
// Resize image for sticker
const resized = await exifHandler.resizeImage(imageBuffer, 512, 512);

// Convert to WebP format
const webpBuffer = await exifHandler.toWebP(imageBuffer);

// Add animated sticker data
const animatedSticker = await exifHandler.addAnimatedExif(videoBuffer, {
  packname: "Animated Pack",
  author: "Creator",
});
```

#### EXIF Data Extraction

```javascript
// Extract EXIF data from image
const exifData = await exifHandler.extractExif(imageBuffer);
console.log("EXIF Info:", exifData);

// Get image dimensions
const { width, height } = await exifHandler.getImageDimensions(imageBuffer);

// Check if image has EXIF data
const hasExif = await exifHandler.hasExif(imageBuffer);
```

## 🔧 Advanced Usage

### Complete Bot Setup

```javascript
import {
  createSocket,
  serialize,
  BotUtils,
  ExifHandler
} from '@bagah/whatsapp-lib';
import { Boom } from '@hapi/boom';
import P from 'pino';

// Initialize components
const logger = P({ level: 'silent' });
const exifHandler = new ExifHandler();

async function startBot() {
  const sock = createSocket({
    logger,
    printQRInTerminal: true,
    browser: ['MyBot', 'Chrome', '1.0.0'],
    auth: authState,
    generateHighQualityLinkPreview: true
  });

  // Connection handling
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        startBot(); // Reconnect
      }
    } else if (connection === 'open') {
      console.log('✅ Connected to WhatsApp');
    }
  });

  // Message handling
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const message of messages) {
      const m = serialize(message);

      if (!m.message || m.key.fromMe) continue;

      await handleMessage(m, sock);
    }
  });
}

async function handleMessage(m, sock) {
  const text = m.text || '';
  const command = BotUtils.parseCommand(text);

  switch (command.command) {
    case 'ping':
      await sock.reply(m.chat, 'Pong! 🏓', m);
      break;

    case 'sticker':
      if (m.quoted && m.quoted.mtype === 'imageMessage') {
        const media = await sock.downloadMediaMessage(m.quoted);
        const sticker = await exifHandler.addExif(media, {
          packname: 'My Bot Pack',
          author: 'Bot'
        });
        await sock.sendMessage(m.chat, { sticker }, { quoted: m });
      }
      break;

    case 'admin':
      if (m.isGroup) {
        const admins = await sock.groupAdmin(m.chat);
        const adminList = admins.map(admin => `@${admin.split('@')[0]}`).join('\n');
        await sock.reply(m.chat, `Group Admins:\n${adminList}`, m);
      }
      break;
  }
}
```

const sock = createSocket({
printQRInTerminal: true,
browser: ['MyBot', 'Chrome', '1.0.0'],
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, logger)
},
logger: pino({ level: 'silent' }),
version: [2, 2413, 1],
generateHighQualityLinkPreview: true
});

// Handle connection updates
sock.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update;

if (connection === 'close') {
const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
if (shouldReconnect) {
createSocket(config);
}
} else if (connection === 'open') {
console.log('✅ Connected to WhatsApp');
}
});

````

### Advanced Message Handling

```javascript
import { serialize, BotUtils } from '@bagah/whatsapp-lib';

sock.ev.on('messages.upsert', async ({ messages, type }) => {
  if (type !== 'notify') return;

  for (const message of messages) {
    const m = serialize(message);

    // Skip if no message content or from self
    if (!m.message || m.key.fromMe) continue;

    // Handle different message types
    switch (m.mtype) {
      case 'conversation':
      case 'extendedTextMessage':
        await handleTextMessage(m, sock);
        break;

      case 'imageMessage':
        await handleImageMessage(m, sock);
        break;

      case 'stickerMessage':
        await handleStickerMessage(m, sock);
        break;
    }
  }
});

async function handleTextMessage(m, sock) {
  const text = m.text || '';
  const command = BotUtils.parseCommand(text);

  switch (command.command) {
    case 'help':
      await sock.sendMessageModify(m.chat,
        'Bot Help Menu\\n\\nAvailable commands:\\n• .ping - Test bot\\n• .sticker - Convert image to sticker\\n• .admin - Show group admins',
        m,
        {
          title: 'Bot Help',
          body: 'Command list',
          thumbnail: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64')
        }
      );
      break;

    case 'ping':
      const start = Date.now();
      const msg = await sock.reply(m.chat, 'Pinging...', m);
      const latency = Date.now() - start;
      await sock.sendMessage(m.chat, {
        text: `🏓 Pong!\\nLatency: ${latency}ms`,
        edit: msg.key
      });
      break;
  }
}
````

### Auto-Reply System

```javascript
// Set up auto-reply for specific keywords
const autoReplies = {
  hello: "Hi there! 👋",
  help: "Type .help for command list",
  bot: "Yes, I am a bot! 🤖",
};

sock.ev.on("messages.upsert", async ({ messages }) => {
  for (const message of messages) {
    const m = serialize(message);
    if (!m.message || m.key.fromMe) continue;

    const text = m.text?.toLowerCase() || "";

    for (const [keyword, reply] of Object.entries(autoReplies)) {
      if (text.includes(keyword)) {
        await sock.reply(m.chat, reply, m);
        break;
      }
    }
  }
});
```

## 📝 Type Definitions

This library includes full TypeScript definitions for better development experience.

```typescript
import type {
  WASocket,
  ExtendedWASocket,
  MessageInfo,
  ContactInfo,
  BotUtilsType,
} from "@bagah/whatsapp-lib";

// Extended socket with custom methods
const sock: ExtendedWASocket = createSocket(baseSocket);

// Serialized message type
sock.ev.on("messages.upsert", ({ messages }) => {
  for (const msg of messages) {
    const m: MessageInfo = serialize(msg);
    // m is now fully typed
  }
});
```

### Available Types

- `WASocket` - Base WhatsApp socket interface
- `ExtendedWASocket` - Extended socket with custom methods
- `MessageInfo` - Serialized message object
- `ContactInfo` - Contact information structure
- `ExifData` - EXIF metadata structure
- `BotUtilsType` - Utility functions interface
- `MessageProperties` - Message modification properties

## 🔗 Common Use Cases

### 1. Simple Echo Bot

```javascript
import { createSocket, serialize } from "@bagah/whatsapp-lib";

sock.ev.on("messages.upsert", ({ messages }) => {
  for (const message of messages) {
    const m = serialize(message);
    if (!m.message || m.key.fromMe) continue;

    // Echo the message back
    sock.reply(m.chat, `You said: ${m.text}`, m);
  }
});
```

### 2. Admin-Only Commands

```javascript
const adminJids = ["admin1@s.whatsapp.net", "admin2@s.whatsapp.net"];

sock.ev.on("messages.upsert", async ({ messages }) => {
  for (const message of messages) {
    const m = serialize(message);
    if (!m.message || m.key.fromMe) continue;

    const command = BotUtils.parseCommand(m.text || "");

    if (command.command === "broadcast" && adminJids.includes(m.sender)) {
      const text = command.args.join(" ");
      // Broadcast to all groups
      const groups = Object.keys(await sock.groupFetchAllParticipating());
      for (const group of groups) {
        await sock.sendMessage(group, { text });
      }
    }
  }
});
```

### 3. Media Auto-Sticker

```javascript
import { ExifHandler } from "@bagah/whatsapp-lib";

const exif = new ExifHandler();

sock.ev.on("messages.upsert", async ({ messages }) => {
  for (const message of messages) {
    const m = serialize(message);
    if (m.mtype === "imageMessage" && m.text?.includes("#sticker")) {
      try {
        const media = await sock.downloadMediaMessage(m);
        const sticker = await exif.addExif(media, {
          packname: "Auto Stickers",
          author: "Bot",
        });
        await sock.sendMessage(m.chat, { sticker }, { quoted: m });
      } catch (error) {
        await sock.reply(m.chat, "Failed to create sticker", m);
      }
    }
  }
});
```

### Baileys Integration

This library includes all essential Baileys functions so you don't need to install it separately.

```javascript
import {
  // Core Baileys functions
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  makeWASocket,

  // Message utilities
  generateWAMessage,
  generateWAMessageFromContent,
  downloadContentFromMessage,

  // Helper functions
  jidDecode,
  delay,
  proto,

  // Media functions
  prepareWAMessageMedia,
  extractImageThumb,
  generateThumbnail,

  // Our enhanced functions
  createSocket,
  serialize,
  makeStore,
} from "@bagah/whatsapp-lib";

// Full bot example with Baileys integration
async function createBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");
  const { version, isLatest } = await fetchLatestBaileysVersion();

  console.log(`Using WA v${version.join(".")}, isLatest: ${isLatest}`);

  const store = makeStore({ logLevel: "silent" });

  const sock = createSocket({
    auth: state,
    version,
    printQRInTerminal: true,
    getMessage: async (key) => {
      const msg = await store.loadMessage(key.remoteJid, key.id);
      return msg?.message || { conversation: "hello" };
    },
  });

  // Bind store to save messages automatically
  store.bind(sock.ev);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log("Reconnecting...");
        setTimeout(createBot, 3000);
      }
    } else if (connection === "open") {
      console.log("✅ Connected to WhatsApp!");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages) {
      const m = serialize(sock, msg);
      if (m.text === ".ping") {
        await sock.reply(m.chat, "Pong! 🏓", m);
      }
    }
  });

  return { sock, store };
}

createBot();
```

**Available Baileys Functions:**

- `useMultiFileAuthState` - Multi-device authentication
- `fetchLatestBaileysVersion` - Get latest WhatsApp version
- `DisconnectReason` - Connection status constants
- `makeWASocket` - Create raw Baileys socket (use `createSocket` for enhanced version)
- `generateWAMessage` - Generate WhatsApp message
- `downloadContentFromMessage` - Download media content
- `jidDecode` - Decode WhatsApp JID
- `delay` - Utility delay function
- And many more...

### Store Management

Built-in store functionality for WhatsApp message and contact management.

```javascript
import { makeStore, bindStore, createAndBindStore } from "@bagah/whatsapp-lib";
import { useMultiFileAuthState } from "@whiskeysockets/baileys";

const { state, saveCreds } = await useMultiFileAuthState("session");

// Create store separately
const store = makeStore({
  logLevel: "silent", // 'debug', 'info', 'warn', 'error', 'fatal', 'silent'
  streamName: "store",
});

const sock = createSocket({
  auth: state,
  // other options...
});

// Bind store to socket events
bindStore(store, sock);

// Or create and bind in one step
const store = createAndBindStore(sock, {
  logLevel: "silent",
});
```

#### Store Usage in Bot

```javascript
// Use store in getMessage function for Baileys
const sock = createSocket({
  auth: state,
  getMessage: async (key) => {
    if (store) {
      const msg = await store.loadMessage(key.remoteJid, key.id);
      return msg.message || undefined;
    }
    return { conversation: "hello" };
  },
});

// Bind store to socket events for automatic message saving
store.bind(sock.ev);
```

#### Store Helper Functions

```javascript
import {
  loadMessage,
  getChat,
  getContact,
  hasChat,
  hasContact,
  getAllChats,
  getAllContacts,
} from "@bagah/whatsapp-lib";

// Load specific message
const message = await loadMessage(store, chatJid, messageId);

// Get chat information
const chat = getChat(store, chatJid);

// Get contact information
const contact = getContact(store, contactJid);

// Check if chat/contact exists
const chatExists = hasChat(store, chatJid);
const contactExists = hasContact(store, contactJid);

// Get all chats and contacts
const allChats = getAllChats(store);
const allContacts = getAllContacts(store);
```

#### Complete Store Integration Example

```javascript
import {
  createSocket,
  makeStore,
  bindStore,
  serialize,
  loadMessage,
} from "@bagah/whatsapp-lib";
import { useMultiFileAuthState } from "@whiskeysockets/baileys";

async function createBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  // Create store for message persistence
  const store = makeStore({
    logLevel: "silent",
  });

  const sock = createSocket({
    auth: state,
    printQRInTerminal: true,
    getMessage: async (key) => {
      // Use store to get messages for quote/reply functionality
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg?.message || undefined;
      }
      return { conversation: "hello" };
    },
  });

  // Bind store to automatically save messages
  bindStore(store, sock);

  // Handle deleted messages
  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages) {
      const m = serialize(msg);

      // Check if it's a delete message
      if (
        m.mtype === "protocolMessage" &&
        m.message.protocolMessage.type === 0
      ) {
        const deletedMsg = await loadMessage(
          store,
          m.chat,
          m.message.protocolMessage.key.id
        );
        if (deletedMsg) {
          console.log("Message deleted:", deletedMsg);
          // Handle deleted message (e.g., anti-delete feature)
        }
      }
    }
  });

  // Save credentials when updated
  sock.ev.on("creds.update", saveCreds);

  return { sock, store };
}

createBot();
```

## 🤝 Dependencies

This library is built on top of these excellent packages:

- [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [axios](https://axios-http.com/) - HTTP client
- [chalk](https://github.com/chalk/chalk) - Terminal string styling
- [file-type](https://github.com/sindresorhus/file-type) - File type detection
- [jimp](https://github.com/jimp-dev/jimp) - Image processing

## 🎯 Requirements

- Node.js >= 18.0.0
- TypeScript >= 5.0.0 (for TypeScript projects)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

If you encounter any issues or need support:

1. Check the [documentation](https://github.com/bagah/whatsapp-lib#readme)
2. Search [existing issues](https://github.com/bagah/whatsapp-lib/issues)
3. Create a [new issue](https://github.com/bagah/whatsapp-lib/issues/new)

## 🔄 Changelog

See [releases](https://github.com/bagah/whatsapp-lib/releases) for changelog and version history.

---

Made with ❤️ by [Bagah Dev](https://github.com/bagah)
