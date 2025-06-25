const fs = require("fs");

const commandCategories = {
  main: {
    name: "Main Menu",
    icon: "🏠",
    commands: ["runtime", "menu", "allmenu", "groupmenu"],
  },
  ai: {
    name: "AI Menu",
    icon: "🤖",
    commands: ["ai", "gemini", "remini", "blackbox"],
  },
  maker: {
    name: "Maker Menu",
    icon: "🎨",
    commands: [
      "toimg",
      "tts",
      "tourl",
      "url",
      "sticker",
      "s",
      "stickergif",
      "sgif",
      "smeme",
      "stickmeme",
    ],
  },
  group: {
    name: "Group Menu",
    icon: "👥",
    commands: [
      "gc",
      "group",
      "promote",
      "demote",
      "revoke",
      "lgc",
      "linkgc",
      "k",
      "kick",
      "hidetag",
      "tag",
      "h",
      "antilink",
      "tagall",
      "c",
    ],
  },
  owner: {
    name: "Owner Menu",
    icon: "👑",
    commands: ["soff", "son", "setppbot", "addprem", "delprem", "listprem"],
  },
  downloader: {
    name: "Downloader Menu",
    icon: "📥",
    commands: [
      "couple",
      "ytmp3",
      "ytmp4",
      "twittervideo",
      "ttnwm",
      "tiktok",
      "ttmp3",
      "quotesanime",
      "facebookdl",
      "fbdl",
      "igdl",
      "tt",
      "tiktoknowm",
      "tt3",
    ],
  },
  search: {
    name: "Search Menu",
    icon: "🔍",
    commands: ["wikimedia", "tiktokstalk", "ytplay", "play", "randomwaifu"],
  },
  game: {
    name: "Game Menu",
    icon: "🎮",
    commands: ["tebakkata", "tebakangka", "suit", "caklontong", "stopgame"],
  },
};

const detectCommands = () => {
  const path = require("path");
  const commandFiles = [
    path.join(__dirname, "command.js"),
    path.join(__dirname, "ai-commands.js"),
    path.join(__dirname, "game-commands.js"),
  ];
  const detectedCommands = {};

  commandFiles.forEach((file) => {
    try {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, "utf8");

        const patterns = [
          /case\s+["']([^"']+)["']:\s*{/g,
          /case\s+["']([^"']+)["']:/g,
          /case\s+"([^"]+)":/g,
          /case\s+'([^']+)':/g,
        ];

        patterns.forEach((pattern) => {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const command = match[1];
            if (command && !detectedCommands[command]) {
              detectedCommands[command] = true;
            }
          }
        });

        console.log(
          `📁 Scanned ${file}: found ${
            Object.keys(detectedCommands).length
          } commands`
        );
      }
    } catch (err) {
      console.log(`❌ Error reading ${file}:`, err.message);
    }
  });

  return Object.keys(detectedCommands);
};

const generateMenu = (
  style,
  isPrefix,
  pushname,
  time2,
  tanggal,
  runtime,
  ucapanWaktu
) => {
  const allCommands = detectCommands();
  console.log("🔍 Detected commands:", allCommands.length, allCommands);

  const message = `${ucapanWaktu} ${pushname}

🤖 *BOT INFORMATION*
🕓 Waktu : ${time2} WIB  
🗓️ Tanggal : ${tanggal}
⏱️ Runtime : ${runtime}
📊 Total Commands : ${allCommands.length}

💫 Pilih kategori menu di bawah ini:`;

  const categories = Object.entries(commandCategories)
    .map(([key, category]) => {
      const availableCommands = category.commands.filter((cmd) =>
        allCommands.includes(cmd)
      );
      return {
        title: `${category.icon} ${category.name}`,
        rowId: `${isPrefix}menutype ${key}`,
        description: `${availableCommands.length} commands tersedia`,
      };
    })
    .filter((cat) => !cat.description.includes("0 commands"));

  return { message, categories };
};

const generateCategoryMenu = (category, style, isPrefix) => {
  const allCommands = detectCommands();
  const categoryData = commandCategories[category];

  if (!categoryData) {
    return null;
  }

  const availableCommands = categoryData.commands.filter((cmd) =>
    allCommands.includes(cmd)
  );

  if (availableCommands.length === 0) {
    return `🚩 Tidak ada command tersedia untuk kategori ${categoryData.name}`;
  }

  let print = `${categoryData.icon} *${categoryData.name.toUpperCase()}*\n\n`;

  switch (style) {
    case 1:
    case 3:
      print += availableCommands
        .sort()
        .map((v, i) => {
          if (style === 3) {
            if (i === 0) {
              return `┌  ◦  ${isPrefix}${v}`;
            } else if (i === availableCommands.length - 1) {
              return `└  ◦  ${isPrefix}${v}`;
            } else {
              return `│  ◦  ${isPrefix}${v}`;
            }
          } else {
            return `◦  ${isPrefix}${v}`;
          }
        })
        .join("\n");
      break;

    case 2:
    case 4:
    case 5:
    case 6:
    case 7:
    default:
      print += availableCommands
        .sort()
        .map((v, i) => {
          if (style === 4 || style === 5) {
            if (i === 0) {
              return `┌  ◦  ${isPrefix}${v}`;
            } else if (i === availableCommands.length - 1) {
              return `└  ◦  ${isPrefix}${v}`;
            } else {
              return `│  ◦  ${isPrefix}${v}`;
            }
          } else if (style === 6) {
            return `   ✨ ${isPrefix}${v}`;
          } else if (style === 7) {
            return `   🔸 ${isPrefix}${v}`;
          } else {
            return `	◦  ${isPrefix}${v}`;
          }
        })
        .join("\n");
      break;
  }

  return print;
};

const generateFullMenu = (
  style,
  isPrefix,
  pushname,
  time2,
  tanggal,
  runtime,
  ucapanWaktu
) => {
  const allCommands = detectCommands();

  let print = `${ucapanWaktu} ${pushname}

🤖 *BOT INFORMATION*
🕓 Waktu : ${time2} WIB  
🗓️ Tanggal : ${tanggal}
⏱️ Runtime : ${runtime}
📊 Total Commands : ${allCommands.length}

- Subs Yt : @aldevvv`;

  print += "\n" + String.fromCharCode(8206).repeat(4001);

  Object.entries(commandCategories).forEach(([key, category]) => {
    const availableCommands = category.commands.filter((cmd) =>
      allCommands.includes(cmd)
    );

    if (availableCommands.length > 0) {
      let categoryTitle = "";

      switch (style) {
        case 2:
          categoryTitle = `\n\n乂  *${category.name
            .toUpperCase()
            .split("")
            .join(" ")}*\n\n`;
          break;
        case 4:
        case 5:
          categoryTitle = `\n\n –  *${category.name
            .toUpperCase()
            .split("")
            .join(" ")}*\n\n`;
          break;
        case 6:
          categoryTitle = `\n\n🎯 *${category.name
            .toUpperCase()
            .split("")
            .join(" ")}*\n\n`;
          break;
        case 7:
          categoryTitle = `\n\n⚡ *${category.name
            .toUpperCase()
            .split("")
            .join(" ")}*\n\n`;
          break;
        default:
          categoryTitle = `\n\n${
            category.icon
          } *${category.name.toUpperCase()}*\n\n`;
      }

      print += categoryTitle;

      print += availableCommands
        .sort()
        .map((v, i) => {
          if (style === 4 || style === 5) {
            if (i === 0) {
              return `┌  ◦  ${isPrefix}${v}`;
            } else if (i === availableCommands.length - 1) {
              return `└  ◦  ${isPrefix}${v}`;
            } else {
              return `│  ◦  ${isPrefix}${v}`;
            }
          } else if (style === 6) {
            return `   ✨ ${isPrefix}${v}`;
          } else if (style === 7) {
            return `   🔸 ${isPrefix}${v}`;
          } else {
            return `	◦  ${isPrefix}${v}`;
          }
        })
        .join("\n");
    }
  });

  return print;
};

module.exports = {
  commandCategories,
  detectCommands,
  generateMenu,
  generateCategoryMenu,
  generateFullMenu,
};
