const { tools } = require("abot-scraper");

module.exports = async (
  abot,
  m,
  { command, args, text, quoted, mime, from, pushname, isCreator, prefix, q }
) => {
  switch (command) {
    //================ AI Menu ==================//

    case "ai":
    case "chatgpt":
      {
        if (!text) return m.reply(`Example: ${prefix + command} Hello AI`);
        try {
          let result = await tools.chatgpt(text);
          m.reply(result.data || "AI sedang error, coba lagi nanti");
        } catch (e) {
          m.reply("Fitur AI sedang maintenance");
        }
      }
      break;

    case "gemini":
      {
        if (!text) return m.reply(`Example: ${prefix + command} Hello Gemini`);
        try {
          let result = await tools.gemini(text);
          m.reply(result.data || "Gemini sedang error, coba lagi nanti");
        } catch (e) {
          m.reply("Fitur Gemini sedang maintenance");
        }
      }
      break;

    case "blackbox":
      {
        if (!text)
          return m.reply(
            `Example: ${prefix + command} Code something in Python`
          );
        try {
          let result = await tools.blackbox(text);
          m.reply(result.data || "Blackbox sedang error, coba lagi nanti");
        } catch (e) {
          m.reply("Fitur Blackbox sedang maintenance");
        }
      }
      break;

    case "remini":
      {
        if (!quoted || !/image/.test(mime)) {
          return m.reply(
            `Kirim/Reply gambar dengan caption ${prefix + command}`
          );
        }
        try {
          let media = await quoted.download();
          let result = await tools.remini(media);
          abot.sendMessage(
            m.chat,
            { image: { url: result.url } },
            { quoted: m }
          );
        } catch (e) {
          m.reply("Fitur Remini sedang maintenance");
        }
      }
      break;

    //================ Default case ===============//
    default:
      return false;
  }

  return true;
};
