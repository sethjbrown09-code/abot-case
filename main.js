require("./config/setting");
const {
  createSocket,
  serialize,
  makeStore,
  bindStore,
  useMultiFileAuthState,
  delay,
  Func,
  DisconnectReason,
  fetchLatestBaileysVersion,
  PHONENUMBER_MCC,
} = require("@bagah/whatsapp-lib");
const pino = require("pino");
const fs = require("fs");
const chalk = require("chalk");
const spinnies = new (require("spinnies"))();

const store = makeStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

const config = require("./config/config.json");

global.API = (name, path = "/", query = {}, apikeyqueryname) =>
  (name in global.APIs ? global.APIs[name] : name) +
  path +
  (query || apikeyqueryname
    ? "?" +
      new URLSearchParams(
        Object.entries({
          ...query,
          ...(apikeyqueryname
            ? {
                [apikeyqueryname]:
                  global.APIKeys[
                    name in global.APIs ? global.APIs[name] : name
                  ],
              }
            : {}),
        })
      )
    : "");

global.db = JSON.parse(fs.readFileSync("./function/database/database.json"));
global.db.data = {
  users: {},
  chats: {},
  sticker: {},
  database: {},
  game: {},
  settings: {},
  others: {},
  ...(global.db.data || {}),
};

async function startabot() {
  const { state, saveCreds } = await useMultiFileAuthState(global.sessionName);
  let { version, isLatest } = await fetchLatestBaileysVersion();
  const options = {
    auth: state,
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal:
      config.pairing && config.pairing.state && config.pairing.number
        ? false
        : true,
    getMessage: async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg?.message || undefined;
      }
      return { conversation: "hello" };
    },
    patchMessageBeforeSending: (message) => {
      const requiresPatch = !!(
        message.buttonsMessage ||
        message.templateMessage ||
        message.listMessage
      );
      if (requiresPatch) {
        message = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadataVersion: 2,
                deviceListMetadata: {},
              },
              ...message,
            },
          },
        };
      }
      return message;
    },
    browser: ["Mac OS", "Safari", "10.15.7"],
  };
  const abot = createSocket(options);

  spinnies.add("start", {
    text: "Connecting . . .",
  });
  bindStore(store, abot);

  if (
    config.pairing &&
    config.pairing.state &&
    !abot.authState.creds.registered
  ) {
    var phoneNumber = config.pairing.number;
    if (
      !Object.keys(PHONENUMBER_MCC).some((v) =>
        String(phoneNumber).startsWith(v)
      )
    ) {
      spinnies.fail("start", {
        text: `Invalid number, start with country code (Example : 62xxx)`,
      });
      process.exit(0);
    }
    setTimeout(async () => {
      try {
        let code = await abot.requestPairingCode(phoneNumber);
        code = code.match(/.{1,4}/g)?.join("-") || code;
        console.log(
          chalk.black(chalk.bgGreen(` Your Pairing Code `)),
          " : " + chalk.black(chalk.white(code))
        );
      } catch {}
    }, 3000);
  }

  abot.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      for (let mek of chatUpdate.messages) {
        if (!mek.message) return;
        mek.message =
          Object.keys(mek.message)[0] === "ephemeralMessage"
            ? mek.message.ephemeralMessage.message
            : mek.message;
        if (mek.key && mek.key.remoteJid == "status@broadcast") return;
        if (!abot.public && !mek.key.fromMe && chatUpdate.type === "notify")
          return;
        if (mek.key.id && mek.key.id.length === 16) return;
        if (mek.key.id.startsWith("3EB0") && mek.key.id.length === 12) return;
        var m = serialize(abot, mek);
        require("./case/case")(abot, m, chatUpdate, store);
      }
    } catch (err) {
      console.log(err);
    }
  });

  abot.ev.process(async (events) => {
    if (events["messages.upsert"]) {
      const upsert = events["messages.upsert"];
      for (let msg of upsert.messages) {
        if (msg.key.remoteJid === "status@broadcast") {
          if (msg.message?.protocolMessage) return;
          console.log(
            `Lihat status ${msg.pushName} ${msg.key.participant.split("@")[0]}`
          );
          await abot.readMessages([msg.key]);
          await delay(1000);
          return await abot.readMessages([msg.key]);
        }
      }
    }

    if (events["creds.update"]) {
      await saveCreds();
    }
  });

  abot.ev.on("contacts.update", (update) => {
    for (let contact of update) {
      let id = abot.decodeJid(contact.id);
      if (store && store.contacts)
        store.contacts[id] = { id, name: contact.notify };
    }
  });

  abot.ev.on("group-participants.update", async (room) => {
    console.log(room);
    try {
      let metadata = await await abot.groupMetadata(room.id);
      let member = room.participants[0];

      const reSize = async (buffer, ukur1, ukur2) => {
        return new Promise(async (resolve, reject) => {
          let jimp = require("jimp");
          var baper = await jimp.read(buffer);
          var ab = await baper
            .resize(ukur1, ukur2)
            .getBufferAsync(jimp.MIME_JPEG);
          resolve(ab);
        });
      };

      try {
        var pic = await Func.fetchBuffer(
          await abot.profilePictureUrl(member, "image")
        );
      } catch {
        var pic = await Func.fetchBuffer(
          await abot.profilePictureUrl(room.id, "image")
        );
      }
      //templete
      let butwel = [
        { buttonId: "list", buttonText: { displayText: "WELCOME" }, type: 1 },
      ];
      let butleav = [
        {
          buttonId: "donasi",
          buttonText: { displayText: "Bye Beban👋" },
          type: 1,
        },
      ];
      let butselamat = [
        { buttonId: "", buttonText: { displayText: "SELAMAT" }, type: 1 },
      ];
      let butsebar = [
        { buttonId: "", buttonText: { displayText: "SABAR" }, type: 1 },
      ];
      let nyoutube = "//";
      let filsj = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/pdf",
      ];
      let filsk = filsj[Math.floor(Math.random() * filsj.length)];
      let groupMetadata = metadata;
      let username = `@${member.split("@")[0]}`;
      let txwel = `Halo Kak ${username}\n*Selamat Datang Di Grup*\n*${metadata.subject}\n*Semoga Betah DiGroup\n*Deskripsi : ${metadata.desc}`;
      if (room.action == "add") {
        abot.sendMessage(room.id, {
          caption: txwel,
          location: { jpegThumbnail: await reSize(pic, 250, 250) },
          buttons: butwel,
          footer: nyoutube,
          mentions: [member],
        });
      } else if (room.action == "remove") {
        let txlev = `Selamat Tinggal Kak @${
          member.split("@")[0]
        }\n*Semoga Tenang Di Alam Sana*\n*Balik Lagi Gua Sumpahin Mandul Lu*\n_~Admin_`;
        abot.sendMessage(room.id, {
          caption: txlev,
          location: { jpegThumbnail: await reSize(pic, 250, 250) },
          buttons: butleav,
          footer: nyoutube,
          mentions: [member],
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  abot.setStatus = (status) => {
    abot.query({
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "set",
        xmlns: "status",
      },
      content: [
        {
          tag: "status",
          attrs: {},
          content: Buffer.from(status, "utf-8"),
        },
      ],
    });
    return status;
  };

  abot.public = true;

  abot.serializeM = (m) => serialize(m);

  abot.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
        ? startabot()
        : "";
    } else if (connection === "open") {
      spinnies.succeed("start", {
        text: `Terkoneksi, kamu login dengan ${
          abot.user.name || abot.user.verifiedName || "WhatsApp Bot"
        }`,
      });
    }
  });

  return abot;
}

startabot();

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.yellowBright(`Update File Terbaru ${__filename}`));
  delete require.cache[file];
  require(file);
});
