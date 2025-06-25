const fs = require("fs");
const { exec } = require("child_process");
const { tools, downloader } = require("abot-scraper");
const { Func } = require("@bagah/whatsapp-lib");
const {
  runtime,
  getBuffer,
  jsonformat,
  getRandom,
} = require("../lib/functions");
const moment = require("moment-timezone");
const menuHelper = require("./menu-helper");

module.exports = async (
  abot,
  m,
  {
    command,
    args,
    text,
    quoted,
    mime,
    from,
    pushname,
    isCreator,
    isGroupAdmins,
    isAdmins,
    isBotAdmins,
    participants,
    groupMetadata,
    prefix,
    time2,
    tanggal,
    ucapanWaktu,
    repPy,
    sticWait,
    sticAdmin,
    sticOwner,
    sticSukses,
    sticBanLu,
    groupon,
    SiGroupadmin,
    q,
  }
) => {
  switch (command) {
    //================ Main Menu ==================//

    case "runtime":
      {
        m.reply(` BOT AKTIF SELAMA : ${runtime(process.uptime())} `);
      }
      break;

    case "menu":
      {
        const { message, categories } = menuHelper.generateMenu(
          1,
          prefix,
          pushname,
          time2,
          tanggal,
          runtime(process.uptime()),
          ucapanWaktu
        );

        abot.sendList(
          m.chat,
          "",
          message,
          "🤖 abot",
          "📋 Pilih Menu",
          [
            {
              rows: categories,
            },
          ],
          m
        );
      }
      break;

    case "menutype":
      {
        if (!text) {
          return m.reply("❌ Kategori tidak ditemukan!");
        }

        const categoryMenu = menuHelper.generateCategoryMenu(
          text.toLowerCase(),
          1,
          prefix
        );

        if (!categoryMenu) {
          return m.reply("❌ Kategori tidak ditemukan!");
        }

        m.reply(categoryMenu);
      }
      break;

    case "allmenu":
      {
        const allCommands = menuHelper.detectCommands();
        let fullMenu = `${ucapanWaktu} ${pushname}

🤖 *BOT INFORMATION*
🕓 Waktu : ${time2} WIB  
🗓️ Tanggal : ${tanggal}
⏱️ Runtime : ${runtime(process.uptime())}
📊 Total Commands : ${allCommands.length}

📋 *SEMUA MENU*\n`;

        Object.entries(menuHelper.commandCategories).forEach(
          ([key, category]) => {
            const availableCommands = category.commands.filter((cmd) =>
              allCommands.includes(cmd)
            );

            if (availableCommands.length > 0) {
              fullMenu += `\n${
                category.icon
              } *${category.name.toUpperCase()}*\n`;
              fullMenu +=
                availableCommands
                  .sort()
                  .map((cmd) => `   ◦ ${prefix}${cmd}`)
                  .join("\n") + "\n";
            }
          }
        );

        fullMenu += "\n© abot - WhatsApp Bot";
        abot.sendMessage(m.chat, { text: fullMenu }, { quoted: m });
      }
      break;

    case "groupmenu":
      {
        const groupMenu = menuHelper.generateCategoryMenu("group", 3, prefix);
        abot.sendMessage(
          m.chat,
          { text: groupMenu + `\n\n𝗥𝗨𝗡𝗧𝗜𝗠𝗘\n${runtime(process.uptime())}` },
          { quoted: m }
        );
      }
      break;

    //================ Maker Menu ==================//

    case "toimage":
    case "toimg":
      {
        if (!quoted) throw "Reply Image";
        if (!/webp/.test(mime))
          throw `Balas sticker dengan caption *${prefix + command}*`;
        let media = await abot.downloadAndSaveMediaMessage(quoted);
        let ran = await getRandom(".png");
        exec(`ffmpeg -i ${media} ${ran}`, (err) => {
          fs.unlinkSync(media);
          if (err) throw err;
          let buffer = fs.readFileSync(ran);
          abot.sendMessage(from, { image: buffer }, { quoted: m });
          fs.unlinkSync(ran);
        });
      }
      break;

    case "url":
    case "tourl":
      {
        if (!quoted)
          throw `Kirim/Reply Image Dengan Caption ${prefix + command}`;
        if (!/image/.test(mime))
          throw `Kirim/Reply Image Dengan Caption ${prefix + command}`;
        sticWait(from);
        let { TelegraPh } = require("../lib/uploader");
        let media = await abot.downloadAndSaveMediaMessage(quoted);
        let anu = await TelegraPh(media);
        try {
          abot.sendMessage(m.chat, {
            text: `${anu}\n\n 🖨️ Nih Link Nya`,
          });
        } catch (e) {
          m.reply(
            `Mohon Maaf Kemungkinan Server Telegraph Sedang Eror\nCoba Lakukan Beberapa Menit Lagi`
          );
        }
      }
      break;

    case "smeme":
    case "stickmeme":
    case "stikmeme":
    case "stickermeme":
    case "stikermeme":
      {
        if (!/webp/.test(mime) && /image/.test(mime)) {
          atas = text.split("|")[0] ? text.split("|")[0] : "-";
          bawah = text.split("|")[1] ? text.split("|")[1] : "-";
          mee = await quoted.download();
          mem = await scrap.uploadImageV2(mee);
          let smeme = `https://api.memegen.link/images/custom/${encodeURIComponent(
            atas
          )}/${encodeURIComponent(bawah)}.png?background=${mem.data.url}`;
          await abot.sendSticker(m.chat, smeme, m, {
            packname: global.packname,
            author: global.author,
          });
        } else {
          m.reply(
            `Kirim/reply image dengan caption ${prefix + command} text1|text2`
          );
        }
      }
      break;

    case "sticker":
    case "s":
    case "stickergif":
    case "sgif":
      {
        if (!quoted)
          throw `Balas Video/Image Dengan Caption ${prefix + command}`;
        if (/image/.test(mime)) {
          let media = await quoted.download();
          await abot.sendSticker(m.chat, media, m, {
            packname: global.packname,
            author: global.author,
          });
        } else if (/video/.test(mime)) {
          if ((quoted.msg || quoted).seconds > 11)
            return m.reply("Maksimal 10 detik!");
          let media = await quoted.download();
          let encmedia = await abot.sendSticker(m.chat, media, m, {
            packname: global.packname,
            author: global.author,
          });
        } else {
          throw `Kirim Gambar/Video Dengan Caption ${
            prefix + command
          }\nDurasi Video 1-9 Detik`;
        }
      }
      break;

    //================== GROUP MENU ==================//

    case "promote":
      {
        if (!m.isGroup) throw groupon(from);
        if (!isBotAdmins) throw sticAdmin(from);
        if (!isAdmins) throw sticAdmin(from);
        let users = m.mentionedJid[0]
          ? m.mentionedJid
          : m.quoted
          ? [m.quoted.sender]
          : [text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"];
        await abot
          .groupParticipantsUpdate(m.chat, users, "promote")
          .then((res) => m.reply(jsonformat(res)))
          .catch((err) => m.reply(jsonformat(err)));
      }
      break;

    case "demote":
      {
        if (!m.isGroup) throw groupon(from);
        if (!isBotAdmins) throw sticAdmin(from);
        if (!isAdmins) throw sticAdmin(from);
        let users = m.mentionedJid[0]
          ? m.mentionedJid
          : m.quoted
          ? [m.quoted.sender]
          : [text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"];
        await abot
          .groupParticipantsUpdate(m.chat, users, "demote")
          .then((res) => m.reply(jsonformat(res)))
          .catch((err) => m.reply(jsonformat(err)));
      }
      break;

    case "leave":
      {
        if (!isCreator) throw sticOwner(from);
        await abot
          .groupLeave(m.chat)
          .then((res) => m.reply(jsonformat(res)))
          .catch((err) => m.reply(jsonformat(err)));
      }
      break;

    case "k":
    case "kick":
      {
        if (!isGroupAdmins)
          return m.reply("Perintah ini hanya bisa digunakan oleh Admin Grup");
        m.reply(`otw kick`);
        let users = m.mentionedJid[0]
          ? m.mentionedJid[0]
          : m.quoted
          ? m.quoted.sender
          : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        await abot
          .groupParticipantsUpdate(m.chat, [users], "remove")
          .then((res) => m.reply(jsonformat(res)))
          .catch((err) => m.reply(jsonformat(err)));
      }
      break;

    case "h":
    case "hidetag":
    case "tag":
      {
        if (!isGroupAdmins && !isCreator)
          return m.reply("Perintah ini hanya bisa digunakan oleh Admin Grup");
        abot.sendMessage(
          m.chat,
          { text: q ? q : "", mentions: participants.map((a) => a.id) },
          { quoted: repPy }
        );
      }
      break;

    case "tagall":
      if (!isGroupAdmins && !isCreator) return sticAdmin(from);
      if (!q) return m.reply(`Teksnya apa?`);
      let teks_tagall = `══✪〘 *Tag Semua* 〙✪══\n\n${q ? q : ""}\n\n`;
      for (let mem of participants) {
        teks_tagall += `⚘ @${mem.id.split("@")[0]}\n`;
      }
      abot.sendMessage(from, {
        text: teks_tagall,
        mentions: participants.map((a) => a.id),
      });
      break;

    case "c":
      if (!m.isGroup)
        return m.reply("Perintah ini hanya bisa digunakan digrup");
      if (!isGroupAdmins)
        return m.reply("Perintah ini hanya bisa digunakan oleh Admin Grup");
      abot.groupSettingUpdate(from, "announcement");
      m.reply(`succes`);
      break;

    case "linkgroup":
    case "linkgc":
    case "lgc":
      {
        if (!m.isGroup) throw groupon(from);
        if (!isBotAdmins) throw SiGroupadmin(from);
        await m.reply(
          "https://chat.whatsapp.com/" + (await abot.groupInviteCode(m.chat))
        );
      }
      break;

    case "gc":
    case "group":
      if (!isGroupAdmins)
        return m.reply("Perintah ini hanya bisa digunakan oleh Admin Grup");
      if (!q)
        return m.reply(
          `Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`
        );
      if (args[0] == "c") {
        abot.groupSettingUpdate(from, "announcement");
        m.reply(
          `Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`
        );
      } else if (args[0] == "o") {
        abot.groupSettingUpdate(from, "not_announcement");
        m.reply(
          `Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`
        );
      } else {
        m.reply(
          `Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`
        );
      }
      break;

    //================ Owner Menu ===============//

    case "soff":
      {
        if (!isCreator) return m.reply("🦆");
        abot.public = true;
        m.reply("```Sukses Mematikan Mode Seleb```");
      }
      break;

    case "son":
      {
        if (!isCreator) return m.reply("🦆");
        abot.public = false;
        m.reply("```Sukses Aktifkan Mode Seleb```");
      }
      break;

    case "setppbot":
      {
        if (!isCreator) return;
        if (!quoted)
          return m.reply(
            `Kirim/Reply Image Dengan Caption ${prefix + command}`
          );
        if (!/image/.test(mime))
          return m.reply(
            `Kirim/Reply Image Dengan Caption ${prefix + command}`
          );
        if (/webp/.test(mime))
          return m.reply(
            `Kirim/Reply Image Dengan Caption ${prefix + command}`
          );
        var medis = await abot.saveMediaMessage(quoted);
        const botNumber = await abot.decodeJid(abot.user.id);

        // Generate profile picture function
        const generateProfilePicture = async (buffer) => {
          const Jimp = require("jimp");
          const jimp_1 = await Jimp.read(buffer);
          const resz =
            jimp_1.getWidth() > jimp_1.getHeight()
              ? jimp_1.resize(550, Jimp.AUTO)
              : jimp_1.resize(Jimp.AUTO, 650);
          const jimp_2 = await Jimp.read(
            await resz.getBufferAsync(Jimp.MIME_JPEG)
          );
          return {
            img: await resz.getBufferAsync(Jimp.MIME_JPEG),
          };
        };

        if (args[0] == `/full`) {
          var { img } = await generateProfilePicture(medis);
          await abot.query({
            tag: "iq",
            attrs: {
              to: botNumber,
              type: "set",
              xmlns: "w:profile:picture",
            },
            content: [
              {
                tag: "picture",
                attrs: { type: "image" },
                content: img,
              },
            ],
          });
          fs.unlinkSync(medis);
          m.reply(`Sukses`);
        } else {
          var memeg = await abot.updateProfilePicture(botNumber, {
            url: medis,
          });
          fs.unlinkSync(medis);
          m.reply(`Sukses`);
        }
      }
      break;

    case "addprem":
      if (!isCreator) return m.reply("```Only Owner!!!```");
      if (!args[0])
        return m.reply(
          `Penggunaan ${prefix + command} nomor\nContoh ${
            prefix + command
          } 6285775869360`
        );
      bnnd = q.split("|")[0].replace(/[^0-9]/g, "");
      let ceknye = await abot.onWhatsApp(bnnd + `@s.whatsapp.net`);
      if (ceknye.length == 0)
        return m.reply(
          `Masukkan Nomor Yang Valid Dan Terdaftar Di WhatsApp!!!`
        );
      const owner = JSON.parse(
        fs.readFileSync("./function/database/owner.json")
      );
      owner.push(bnnd);
      fs.writeFileSync("./function/database/owner.json", JSON.stringify(owner));
      m.reply(`Nomor ${bnnd} Sudah Terdaftar Ke Premium!!!`);
      break;

    case "delprem":
      if (!isCreator) return m.reply("```Only Owner!!!```");
      if (!args[0])
        return m.reply(
          `Penggunaan ${prefix + command} nomor\nContoh ${
            prefix + command
          } 6285775869360`
        );
      yaki = q.split("|")[0].replace(/[^0-9]/g, "");
      const ownerList = JSON.parse(
        fs.readFileSync("./function/database/owner.json")
      );
      unp = ownerList.indexOf(yaki);
      ownerList.splice(unp, 1);
      fs.writeFileSync(
        "./function/database/owner.json",
        JSON.stringify(ownerList)
      );
      m.reply(`Nomor ${yaki} Telah Di Hapus Dari Daftar Premium!!!`);
      break;

    case "listprem":
      if (!isCreator) return m.reply("```Only Owner!!!```");
      const ownerData = JSON.parse(
        fs.readFileSync("./function/database/owner.json")
      );
      teksooo = "*List Owner*\n\n";
      for (let abotOwner of ownerData) {
        teksooo += `- ${abotOwner}\n`;
      }
      teksooo += `\n*Total : ${ownerData.length}*`;
      abot.sendMessage(from, { text: teksooo.trim() }, "extendedTextMessage", {
        quoted: m,
        contextInfo: { mentionedJid: ownerData },
      });
      break;

    //================ Downloader Menu ===============//

    case "couple":
      {
        let result = await Func.fetchJson(
          "https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json"
        );

        for (let i = 0; i < 3; i++) {
          let random = result[Math.floor(Math.random() * result.length)];
          abot.sendFile(m.chat, random.male, "", `Couple Male`, m);
          abot.sendFile(m.chat, random.female, "", `Couple Female`, m);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
      break;

    case "ttnwm":
    case "tiktoknowm":
    case "tt":
      {
        if (!text)
          throw `Example : ${prefix + command} https://vt.tiktok.com/ZSwWCk5o/`;
        let json = await downloader.tiktokDownloader(text);
        if (!json.status) throw `Fitur Sedang Error`;
        try {
          let caption = `乂  *T I K T O K*\n\n`;
          caption += `	◦  *Caption* : ${json.result.title || "-"}\n`;
          abot.sendFile(m.chat, json.result.video, "video.mp4", caption, m);
        } catch (e) {
          m.reply(`Url Invalid`);
        }
      }
      break;

    case "facebookdl":
    case "fbdl":
      {
        if (!q)
          throw `Example : ${
            prefix + command
          } https://www.facebook.com/UstazAzharIdrusFansClub/videos/813224618838631`;
        let json = await downloader.facebook(q);
        if (!json.status) throw `Fitur Sedang Error`;
        try {
          abot
            .sendMessageModify(m.chat, "nih", m, {
              largeThumb: true,
              thumbnail: await Func.fetchBuffer(json.result.thumbnail),
            })
            .then(async () => {
              await abot.sendFile(
                m.chat,
                json.result.videoUrl,
                "video.mp4",
                "",
                m
              );
            });
        } catch (e) {
          m.reply(`Fiture sedang error`);
        }
      }
      break;

    case "tt3":
    case "ttmp3":
      try {
        if (!text)
          return m.reply(
            `Example : ${prefix + command} https://vt.tiktok.com/ZS82urPBa/`
          );
        if (text.includes("https://vt.tiktok.com/")) {
          var link = args[0];
        } else if (text.includes("https://vm.tiktok.com/")) {
          var link = args[0];
        } else if (text.includes("https://www.tiktok.com/")) {
          var link = args[0];
        } else m.reply("Error Link");
        let json = await downloader.tiktokDownloader(link);
        abot.sendFile(m.chat, json.result.audio, "audio.mp3", "", m);
      } catch {
        m.reply(
          "Maaf Kak Fitur Sedang Error Silahkan Chat Owner Agar Segera Di Perbaiki"
        );
      }
      break;

    //================ Default case for unknown commands ===============//
    default:
      return false; // Return false if command not found
  }

  return true; // Return true if command was handled
};
