const fs = require("fs");

const categoryIcons = {
  main: "🏠",
  ai: "🤖",
  maker: "🎨",
  group: "👥",
  owner: "👑",
  downloader: "📥",
  search: "🔍",
  game: "🎮",
  default: "📋",
};

const detectCommandsAndCategories = () => {
  const path = require("path");
  const commandFiles = [
    path.join(__dirname, "command.js"),
    path.join(__dirname, "ai-commands.js"),
    path.join(__dirname, "game-commands.js"),
  ];

  const categories = {};
  let allCommands = [];

  commandFiles.forEach((file) => {
    try {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, "utf8");
        const sections = content.split(/\/\/=+[^=]*Menu[^=]*=+\/\//i);
        const categoryMatches =
          content.match(/\/\/=+\s*([^=]*?Menu[^=]*?)\s*=+\/\//gi) || [];

        console.log(`📁 Scanning ${path.basename(file)}...`);
        for (let i = 1; i < sections.length; i++) {
          const section = sections[i];
          const categoryHeader = categoryMatches[i - 1];

          if (categoryHeader) {
            const categoryNameMatch = categoryHeader.match(
              /\/\/=+\s*([^=]*?)\s*=+\/\//i
            );
            if (categoryNameMatch) {
              let categoryName = categoryNameMatch[1].trim().toLowerCase();
              categoryName = categoryName.replace(/\s*menu\s*/gi, "").trim();
              if (categoryName === "group menu") categoryName = "group";
              const commandPatterns = [
                /case\s+["']([^"']+)["']:\s*{/g,
                /case\s+["']([^"']+)["']:/g,
                /case\s+"([^"]+)":/g,
                /case\s+'([^']+)':/g,
              ];

              const sectionCommands = [];
              commandPatterns.forEach((pattern) => {
                let match;
                while ((match = pattern.exec(section)) !== null) {
                  const command = match[1];
                  if (command && !sectionCommands.includes(command)) {
                    sectionCommands.push(command);
                    if (!allCommands.includes(command)) {
                      allCommands.push(command);
                    }
                  }
                }
              });

              if (sectionCommands.length > 0) {
                if (!categories[categoryName]) {
                  categories[categoryName] = {
                    name:
                      categoryName.charAt(0).toUpperCase() +
                      categoryName.slice(1) +
                      " Menu",
                    icon: categoryIcons[categoryName] || categoryIcons.default,
                    commands: [],
                  };
                }
                sectionCommands.forEach((cmd) => {
                  if (!categories[categoryName].commands.includes(cmd)) {
                    categories[categoryName].commands.push(cmd);
                  }
                });

                console.log(
                  `  🔹 ${categoryName}: ${
                    sectionCommands.length
                  } commands - ${sectionCommands.join(", ")}`
                );
              }
            }
          }
        }

        const foundCategories = Object.keys(categories).length;

        if (
          foundCategories === 0 ||
          (file.includes("ai-commands.js") && !categories.ai)
        ) {
          const filename = path.basename(file, ".js");
          let categoryName = "other";

          if (filename.includes("ai")) {
            categoryName = "ai";
          } else if (filename.includes("game")) {
            categoryName = "game";
          }

          const commandPatterns = [
            /case\s+["']([^"']+)["']:\s*{/g,
            /case\s+["']([^"']+)["']:/g,
            /case\s+"([^"]+)":/g,
            /case\s+'([^']+)':/g,
          ];

          const fileCommands = [];
          commandPatterns.forEach((pattern) => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
              const command = match[1];
              if (command && !fileCommands.includes(command)) {
                fileCommands.push(command);
                if (!allCommands.includes(command)) {
                  allCommands.push(command);
                }
              }
            }
          });

          if (fileCommands.length > 0) {
            if (!categories[categoryName]) {
              categories[categoryName] = {
                name:
                  categoryName.charAt(0).toUpperCase() +
                  categoryName.slice(1) +
                  " Menu",
                icon: categoryIcons[categoryName] || categoryIcons.default,
                commands: [],
              };
            }

            fileCommands.forEach((cmd) => {
              if (!categories[categoryName].commands.includes(cmd)) {
                categories[categoryName].commands.push(cmd);
              }
            });
          }
        }
      }
    } catch (err) {
      console.log(`❌ Error reading ${file}:`, err.message);
    }
  });

  return { categories, allCommands };
};

const detectCommands = () => {
  const { allCommands } = detectCommandsAndCategories();
  return allCommands;
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
  const { categories, allCommands } = detectCommandsAndCategories();
  console.log("🔍 Auto-detected categories:", Object.keys(categories));
  console.log("🔍 Auto-detected commands:", allCommands.length, allCommands);

  const message = `${ucapanWaktu} ${pushname}

🤖 *BOT INFORMATION*
🕓 Waktu : ${time2} WIB  
🗓️ Tanggal : ${tanggal}
⏱️ Runtime : ${runtime}
📊 Total Commands : ${allCommands.length}

💫 Pilih kategori menu di bawah ini:`;

  const categoryList = Object.entries(categories)
    .map(([key, category]) => {
      return {
        title: `${category.icon} ${category.name}`,
        rowId: `${isPrefix}menutype ${key}`,
        description: `${category.commands.length} commands tersedia`,
      };
    })
    .filter((cat) => !cat.description.includes("0 commands"));

  return { message, categories: categoryList };
};

const generateCategoryMenu = (category, style, isPrefix) => {
  const { categories } = detectCommandsAndCategories();
  const categoryData = categories[category];

  if (!categoryData) {
    return null;
  }

  const availableCommands = categoryData.commands;

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
  const { categories, allCommands } = detectCommandsAndCategories();

  let print = `${ucapanWaktu} ${pushname}

🤖 *BOT INFORMATION*
🕓 Waktu : ${time2} WIB  
🗓️ Tanggal : ${tanggal}
⏱️ Runtime : ${runtime}
📊 Total Commands : ${allCommands.length}

- Subs Yt : @aldevvv`;

  print += "\n" + String.fromCharCode(8206).repeat(4001);

  Object.entries(categories).forEach(([key, category]) => {
    const availableCommands = category.commands;

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
  detectCommands,
  detectCommandsAndCategories,
  generateMenu,
  generateCategoryMenu,
  generateFullMenu,
};
