require("../config/setting");
const fs = require("fs");
const { Func } = require("@bagah/whatsapp-lib");
const chalk = require("chalk");
const crypto = require("crypto");
const { exec } = require("child_process");
const moment = require("moment-timezone");
const Jimp = require("jimp");
const { tools, downloader } = require("abot-scraper");
const util = require("util");
const {
  runtime,
  getBuffer,
  jsonformat,
  getRandom,
} = require("./lib/functions");

module.exports = abot = async (abot, m) => {
  try {
    const body =
      m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype == "imageMessage"
        ? m.message.imageMessage.caption
        : m.mtype == "videoMessage"
        ? m.message.videoMessage.caption
        : m.mtype == "extendedTextMessage"
        ? m.message.extendedTextMessage.text
        : m.mtype == "buttonsResponseMessage"
        ? m.message.buttonsResponseMessage.selectedButtonId
        : m.mtype == "listResponseMessage"
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : m.mtype == "templateButtonReplyMessage"
        ? m.message.templateButtonReplyMessage.selectedId
        : m.mtype === "messageContextInfo"
        ? m.message.buttonsResponseMessage?.selectedButtonId ||
          m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
          m.text
        : "";
    const budy = typeof m.text == "string" ? m.text : "";
    const prefix = /^[°#*+,.?=''():√%!¢£¥€π¤ΠΦ_&`™©®Δ^βα¦|/\\©^]/.test(body)
      ? body.match(/^[°#*+,.?=''():√%¢£¥€π¤ΠΦ_&!`™©®Δ^βα¦|/\\©^]/gi)
      : ".";
    const chath =
      m.mtype === "conversation" && m.message.conversation
        ? m.message.conversation
        : m.mtype == "imageMessage" && m.message.imageMessage.caption
        ? m.message.imageMessage.caption
        : m.mtype == "documentMessage" && m.message.documentMessage.caption
        ? m.message.documentMessage.caption
        : m.mtype == "videoMessage" && m.message.videoMessage.caption
        ? m.message.videoMessage.caption
        : m.mtype == "extendedTextMessage" && m.message.extendedTextMessage.text
        ? m.message.extendedTextMessage.text
        : m.mtype == "buttonsResponseMessage" &&
          m.message.buttonsResponseMessage.selectedButtonId
        ? m.message.buttonsResponseMessage.selectedButtonId
        : m.mtype == "templateButtonReplyMessage" &&
          m.message.templateButtonReplyMessage.selectedId
        ? m.message.templateButtonReplyMessage.selectedId
        : m.mtype == "listResponseMessage"
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : m.mtype == "messageContextInfo"
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : "";
    const content = JSON.stringify(m.message);
    const { type, quotedMsg, mentioned, now, fromMe } = m;
    const isImage = type == "imageMessage";
    const isQuotedMsg = type == "extendedTextMessage";
    const isQuotedImage = isQuotedMsg
      ? content.includes("imageMessage")
        ? true
        : false
      : false;
    const isCmd = body.startsWith(prefix);
    const from = m.key.remoteJid;
    const command = body
      .replace(prefix, "")
      .trim()
      .split(/ +/)
      .shift()
      .toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";
    const botNumber = await abot.decodeJid(abot.user.id);
    const isCreator = [botNumber, ...global.ownerNumber]
      .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
      .includes(m.sender);
    const itsMe = m.sender == botNumber ? true : false;
    const text = (q = args.join(" "));
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || "";
    const isMedia = /image|video|sticker|audio/.test(mime);
    const { chats } = m;

    const tanggal = moment.tz("Asia/Makassar").format("DD/MM/YY");
    const isGroup = m.key.remoteJid.endsWith("@g.us");
    const sender = m.isGroup
      ? m.key.participant
        ? m.key.participant
        : m.participant
      : m.key.remoteJid;
    const groupMetadata = m.isGroup
      ? await abot.groupMetadata(m.chat).catch((e) => {})
      : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";
    const participants = m.isGroup ? await groupMetadata.participants : "";
    const groupAdmins = m.isGroup
      ? await participants.filter((v) => v.admin !== null).map((v) => v.id)
      : "";
    const groupOwner = m.isGroup ? groupMetadata.owner : "";
    const groupMembers = m.isGroup ? groupMetadata.participants : "";
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
    const isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;

    if (!abot.public) {
      if (!m.key.fromMe) return;
    }

    if (isCmd && m.isGroup) {
      console.log(
        chalk.bold.rgb(
          255,
          178,
          102
        )("\x1b[1;31m~\x1b[1;37m> [\x1b[1;32mCMD\x1b[1;37m]"),
        chalk.bold.rgb(153, 255, 153)(command),
        chalk.bold.rgb(204, 204, 0)("from"),
        chalk.bold.rgb(153, 255, 204)(pushname),
        chalk.bold.rgb(204, 204, 0)("in"),
        chalk.bold.rgb(255, 178, 102)("Group Chat"),
        chalk.bold("[" + args.length + "]")
      );
    }
    if (isCmd && !m.isGroup) {
      console.log(
        chalk.bold.rgb(
          255,
          178,
          102
        )("\x1b[1;31m~\x1b[1;37m> [\x1b[1;32mCMD\x1b[1;37m]"),
        chalk.bold.rgb(153, 255, 153)(command),
        chalk.bold.rgb(204, 204, 0)("from"),
        chalk.bold.rgb(153, 255, 204)(pushname),
        chalk.bold.rgb(204, 204, 0)("in"),
        chalk.bold.rgb(255, 178, 102)("Private Chat"),
        chalk.bold("[" + args.length + "]")
      );
    }

    try {
      ppuser = await abot.profilePictureUrl(m.sender, "image");
    } catch (err) {
      ppuser =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60";
    }
    ppnyauser = await getBuffer(ppuser);

    const generateProfilePicture = async (buffer) => {
      const jimp_1 = await Jimp.read(buffer);
      const resz =
        jimp_1.getWidth() > jimp_1.getHeight()
          ? jimp_1.resize(550, Jimp.AUTO)
          : jimp_1.resize(Jimp.AUTO, 650);
      const jimp_2 = await Jimp.read(await resz.getBufferAsync(Jimp.MIME_JPEG));
      return {
        img: await resz.getBufferAsync(Jimp.MIME_JPEG),
      };
    };

    const clean = (data) => {
      let regex = /(<([^>]+)>)/gi;
      data = data.replace(/(<br?\s?\/>)/gi, " \n");
      return data.replace(regex, "");
    };

    const antilink = true;
    if (budy.match("http://") || budy.match("https://")) {
      if (m.isGroup && !m.key.fromMe && !isAdmins && antilink) {
        if (!isBotAdmins) return;
        if (budy.match(`https://`)) {
          abot.sendMessage(
            m.chat,
            {
              text: `*Antilink Group Terdeteksi*\n\nKamu Akan Dikeluarkan Dari Group ${groupMetadata.subject}`,
            },
            { quoted: m }
          );
          abot.groupParticipantsUpdate(m.chat, [sender], "remove");
        }
      }
    }

    const createSerial = (size) => {
      return crypto.randomBytes(size).toString("hex").slice(0, size);
    };

    function randomNomor(min, max = null) {
      if (max !== null) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      } else {
        return Math.floor(Math.random() * min) + 1;
      }
    }
    function monospace(string) {
      return "```" + string + "```";
    }

    const pickRandom = (arr) => {
      return arr[Math.floor(Math.random() * arr.length)];
    };

    //=================================================//
    var sticWait = () => {
      ano = fs.readFileSync("./function/image/wait.webp");
      abot.sendImageAsSticker(m.chat, ano, m, {
        packname: global.packname,
        author: global.author,
      });
    };
    var sticAdmin = () => {
      ano = fs.readFileSync("./function/image/BotAdman.webp");
      abot.sendImageAsSticker(m.chat, ano, m, {
        packname: global.packname,
        author: global.author,
      });
    };
    var sticOwner = () => {
      ano = fs.readFileSync("./function/image/owner.webp");
      abot.sendImageAsSticker(m.chat, ano, m, {
        packname: global.packname,
        author: global.author,
      });
    };
    var sticSukses = () => {
      ano = fs.readFileSync("./function/image/SuksesCok.webp");
      abot.sendImageAsSticker(m.chat, ano, m, {
        packname: global.packname,
        author: global.author,
      });
    };
    var sticBanLu = (hehe) => {
      ano = fs.readFileSync("./function/image/BanLu.webp");
      abot.sendImageAsSticker(m.chat, ano, m, {
        packname: global.packname,
        author: global.author,
      });
    };
    var groupon = (hehe) => {
      ano = fs.readFileSync("./function/image/groupon.webp");
      abot.sendImageAsSticker(m.chat, ano, m, {
        packname: global.packname,
        author: global.author,
      });
    };
    var SiGroupadmin = (hehe) => {
      ano = fs.readFileSync("./function/image/SiGroupadmin.webp");
      abot.sendImageAsSticker(m.chat, ano, m, {
        packname: global.packname,
        author: global.author,
      });
    };

    //=================================================//
    const time2 = moment().tz("Asia/Jakarta").format("HH:mm:ss");
    if (time2 < "23:59:00") {
      var ucapanWaktu = "Selamat Malam";
    }
    if (time2 < "19:00:00") {
      var ucapanWaktu = "Selamat Petang";
    }
    if (time2 < "18:00:00") {
      var ucapanWaktu = "Selamat Sore";
    }
    if (time2 < "15:00:00") {
      var ucapanWaktu = "Selamat Siang";
    }
    if (time2 < "11:00:00") {
      var ucapanWaktu = "Selamat Pagi";
    }
    if (time2 < "05:00:00") {
      var ucapanWaktu = "Selamat Malam";
    }
    moment.tz.setDefault("Asia/Jakarta").locale("id");
    //=================================================//

    const fkontak = {
      key: {
        participant: `0@s.whatsapp.net`,
        ...(m.chat ? { remoteJid: `status@broadcast` } : {}),
      },
      message: {
        contactMessage: {
          displayName: "Abott",
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;AADad\nFN:Abott\nitem1.TEL;waid=0:0\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
          jpegThumbnail: thumb,
          thumbnail: thumb,
          sendEphemeral: true,
        },
      },
    };
    const reply = (teks) => {
      abot.sendMessage(
        m.chat,
        {
          text: teks,
          contextInfo: {
            forwardingScore: 9999999,
            isForwarded: true,
          },
        },
        { quoted: repPy }
      );
    };

    const repPy = {
      key: {
        remoteJid: "0@s.whatsapp.net",
        fromMe: false,
        id: `${global.namabot}`,
        participant: "0@s.whatsapp.net",
      },
      message: {
        requestPaymentMessage: {
          currencyCodeIso4217: "USD",
          amount1000: 999999999,
          requestFrom: "0@s.whatsapp.net",
          noteMessage: {
            extendedTextMessage: {
              text: `${global.namabot}`,
            },
          },
          expiryTimestamp: 999999999,
          amount: {
            value: 91929291929,
            offset: 1000,
            currencyCode: "USD",
          },
        },
      },
    };

    // Auto Block +212
    if (m.sender.startsWith("212")) {
      return abot.updateBlockStatus(m.sender, "block");
    }

    global.addUserPanel = (email, username, expired, _db) => {
      var obj_add = {
        email: email,
        username: username,
        expired: expired,
      };
      _db.push(obj_add);
      fs.writeFileSync(
        "./function/database/user.json",
        JSON.stringify(_db, null, 3)
      );
    };

    switch (command) {
      //================ Main Menu ==================//

      case "runtime":
        {
          m.reply(` BOT AKTIF SELAMA : ${runtime(process.uptime())} `);
        }
        break;

      case "menu":
        {
          var menu_nya = `${ucapanWaktu} ${pushname}
  Info Bot
  🕓 Waktu : ${time2} WIB
  🗓️ Tanggal : ${tanggal}
  ⏱️ Runtime : ${runtime(process.uptime())}

  - Subs Yt : @aldevvv
  
  Jangan Lupa Donasi Kepada Bot
  
  MAIN MENU
  ⿻ !runtime
  ⿻ !menu 
  ⿻ !allmenu
  ⿻ !groupmenu

  AI MENU
  ⿻ !ai
  ⿻ !gemini
  ⿻ !remini
  ⿻ !blackbox

  MAKER MENU
  ⿻ !toimg
  ⿻ !tts
  ⿻ !tourl / url
  ⿻ !sticker / s / stickergif /sgif
  
  GROUP MENU
  ⿻ !Gc o/c
  ⿻ !promote
  ⿻ !demote
  ⿻ !Revoke/R
  ⿻ !Lgc 
  ⿻ !k/kick @
  ⿻ !Hidetag/tag
  ⿻ !Antilink
  ⿻ !Tagall text

  Owner Menu
  ⿻ !soff
  ⿻ !soon
  ⿻ !setppbot
  ⿻ !addprem
  ⿻ !delprem
  ⿻ !listprem

  Downloader Menu
  ⿻ !couple
  ⿻ !ytmp3
  ⿻ !ytmp4
  ⿻ !twittervideo
  ⿻ !ttnwm
  ⿻ !tiktok
  ⿻ !ttmp3
  ⿻ !quotesanime
  ⿻ !facebokdl
  ⿻ !igdl

  Search Menu
  ⿻ !wikimedia
  ⿻ !tiktokstalk
  ⿻ !ytplay
  ⿻ !play
  ⿻ !randomwaifu
  
  RUNTIME
  ${runtime(process.uptime())}
  `;
          abot.sendMessage(from, { text: menu_nya }, { quoted: m });
        }
        break;

      case "groupmenu":
        {
          const more = String.fromCharCode(8206);
          const readmore = more.repeat(4001);
          var footer_nya = `© abot`;
          var menu_nya = `Halo ${m.pushName} 
   𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨 
   ⿻ !Gc o/c
   ⿻ !Revoke/R
   ⿻ !Lgc 
   ⿻ !k/kick @
   ⿻ !Add 628xx
   ⿻ !Hidetag/tag
   ⿻ !block @
   ⿻ !unblock @
   ⿻ !Tagall text
   ⿻ !S / Sticker
   ⿻ !Toimg
  
  𝗥𝗨𝗡𝗧𝗜𝗠𝗘
  ${runtime(process.uptime())}
  `;
          abot.sendMessage(from, { text: menu_nya }, { quoted: m });
        }
        break;

      //================ Main Menu ==================//

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
          let { TelegraPh } = require("./lib/uploader");
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
            reply(
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

      //=================================================//

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
        if (!isGroupAdmins && !isOwner) return sticAdmin(from);
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
        if (!isGroup)
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
          await abot.reply(
            m.chat,
            "https://chat.whatsapp.com/" + (await abot.groupInviteCode(m.chat)),
            m
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

      //=================================================//

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
        owner.push(bnnd);
        fs.writeFileSync(
          "./function/database/owner.json",
          JSON.stringify(owner)
        );
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
        unp = owner.indexOf(yaki);
        owner.splice(unp, 1);
        fs.writeFileSync(
          "./function/database/owner.json",
          JSON.stringify(owner)
        );
        m.reply(`Nomor ${yaki} Telah Di Hapus Dari Daftar Premium!!!`);
        break;

      case "listprem":
        if (!isCreator) return m.reply("```Only Owner!!!```");
        teksooo = "*List Owner*\n\n";
        for (let abot of owner) {
          teksooo += `- ${owner.length}\n`;
        }
        teksooo += `\n*Total : ${owner.length}*`;
        abot.sendMessage(
          from,
          { text: teksooo.trim() },
          "extendedTextMessage",
          { quoted: m, contextInfo: { mentionedJid: owner } }
        );
        break;

      //=================================================//

      //================ Downlaoder Menu ===============//

      case "couple":
        {
          let result = await Func.fetchJson(
            "https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json"
          );

          for (let i = 0; i < 3; i++) {
            let random = result[Math.floor(Math.random() * result.length)];
            abot.sendFile(m.chat, random.male, "", `Couple Male`, m);
            abot.sendFile(m.chat, random.female, "", `Couple Female`, m);
            Func.delay(2000);
          }
        }
        break;

      case "ttnwm":
      case "tiktoknowm":
      case "tt":
        {
          if (!text)
            throw `Example : ${
              prefix + command
            } https://vt.tiktok.com/ZSwWCk5o/`;
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

      //================ Downloader Menu ===============//

      default:
    }
    if (budy.startsWith(">")) {
      if (!isCreator)
        return m.reply(`Maaf Command Tersebut Khusus Developer Bot WhatsApp`);
      try {
        let evaled = await eval(budy.slice(2));
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        await m.reply(evaled);
      } catch (err) {
        m.reply(String(err));
      }
    }
  } catch (err) {
    m.reply(util.format(err));
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.yellowBright(`Update File Terbaru ${__filename}`));
  delete require.cache[file];
  require(file);
});
