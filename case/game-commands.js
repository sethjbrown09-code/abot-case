module.exports = async (
  abot,
  m,
  { command, args, text, quoted, mime, from, pushname, isCreator, prefix, q }
) => {
  switch (command) {
    //================ Game Menu ==================//

    case "tebakkata":
      {
        const kataArray = [
          "javascript",
          "programming",
          "whatsapp",
          "bot",
          "coding",
        ];
        const randomKata =
          kataArray[Math.floor(Math.random() * kataArray.length)];

        global.game = global.game || {};
        global.game[m.chat] = {
          type: "tebakkata",
          answer: randomKata,
          timeout: setTimeout(() => {
            m.reply("⏰ Waktu habis! Jawabannya adalah: " + randomKata);
            delete global.game[m.chat];
          }, 60000), // 1 menit
        };

        // Acak huruf untuk clue
        const scrambled = randomKata
          .split("")
          .sort(() => Math.random() - 0.5)
          .join("");

        m.reply(
          `🎮 *TEBAK KATA*\n\nHuruf teracak: *${scrambled}*\nJumlah huruf: ${randomKata.length}\n\nKetik jawabanmu! (60 detik)`
        );
      }
      break;

    case "tebakangka":
      {
        // Game tebak angka 1-100
        const randomNumber = Math.floor(Math.random() * 100) + 1;

        global.game = global.game || {};
        global.game[m.chat] = {
          type: "tebakangka",
          answer: randomNumber,
          attempts: 0,
          timeout: setTimeout(() => {
            m.reply("⏰ Waktu habis! Angkanya adalah: " + randomNumber);
            delete global.game[m.chat];
          }, 120000), // 2 menit
        };

        m.reply(
          `🎯 *TEBAK ANGKA*\n\nTebak angka antara 1-100!\nKamu punya 2 menit dan unlimited percobaan.\n\nKetik angka pilihanmu!`
        );
      }
      break;

    case "suit":
      {
        if (!text) {
          return m.reply(
            `🪨📄✂️ *SUIT*\n\nContoh: ${prefix}suit batu\nPilihan: batu, kertas, gunting`
          );
        }

        const userChoice = text.toLowerCase();
        const validChoices = ["batu", "kertas", "gunting"];

        if (!validChoices.includes(userChoice)) {
          return m.reply(
            "❌ Pilihan tidak valid! Gunakan: batu, kertas, atau gunting"
          );
        }

        const botChoice =
          validChoices[Math.floor(Math.random() * validChoices.length)];

        let result = "";
        if (userChoice === botChoice) {
          result = "🤝 SERI!";
        } else if (
          (userChoice === "batu" && botChoice === "gunting") ||
          (userChoice === "kertas" && botChoice === "batu") ||
          (userChoice === "gunting" && botChoice === "kertas")
        ) {
          result = "🎉 KAMU MENANG!";
        } else {
          result = "🤖 BOT MENANG!";
        }

        const emoji = {
          batu: "🪨",
          kertas: "📄",
          gunting: "✂️",
        };

        m.reply(
          `🪨📄✂️ *SUIT*\n\n👤 Kamu: ${emoji[userChoice]} ${userChoice}\n🤖 Bot: ${emoji[botChoice]} ${botChoice}\n\n${result}`
        );
      }
      break;

    case "caklontong":
      {
        // Array pertanyaan cak lontong
        const questions = [
          {
            question: "Apa yang lebih berat, 1 kg kapas atau 1 kg besi?",
            answer: "sama",
            hint: "Think about it...",
          },
          {
            question: "Binatang apa yang jalan mundur?",
            answer: "kepiting",
            hint: "Ada di laut...",
          },
          {
            question: "Kenapa cicak di langit-langit tidak jatuh?",
            answer: "karena tidak mau jatuh",
            hint: "Logika sederhana...",
          },
        ];

        const randomQ = questions[Math.floor(Math.random() * questions.length)];

        global.game = global.game || {};
        global.game[m.chat] = {
          type: "caklontong",
          answer: randomQ.answer.toLowerCase(),
          hint: randomQ.hint,
          timeout: setTimeout(() => {
            m.reply("⏰ Waktu habis! Jawabannya adalah: " + randomQ.answer);
            delete global.game[m.chat];
          }, 90000), // 90 detik
        };

        m.reply(
          `🧠 *CAK LONTONG*\n\n${randomQ.question}\n\nKetik jawabanmu! (90 detik)\nKetik 'hint' untuk clue`
        );
      }
      break;

    case "stopgame":
      {
        if (global.game && global.game[m.chat]) {
          clearTimeout(global.game[m.chat].timeout);
          delete global.game[m.chat];
          m.reply("🛑 Game dihentikan!");
        } else {
          m.reply("❌ Tidak ada game yang sedang berjalan!");
        }
      }
      break;

    //================ Default case ===============//
    default:
      return false;
  }

  return true;
};
