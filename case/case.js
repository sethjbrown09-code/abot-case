require("../config/setting");
const fs = require("fs");
const chalk = require("chalk");
const moment = require("moment-timezone");
const config = require("../config.json");
const util = require("util");
const { getBuffer } = require("../lib/functions");

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
    const isCreator = [botNumber, ...config.owner]
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

    const commandHandler = require("./command");

    if (isCmd) {
      let commandResult = await commandHandler(abot, m, {
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
      });

      if (!commandResult) {
        // console.log(`Unknown command: ${command}`);
      }
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
