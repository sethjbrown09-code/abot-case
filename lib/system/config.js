const { Func } = require("@bagah/whatsapp-lib");
global.botname = `© BAGAH-BOT`;
global.footer = "WHATSAPP BOT BY BAGAH PROJECT";

global.status = Object.freeze({
  wait: Func.texted("bold", "Sedang Di Proses..."),
  invalid: Func.texted("bold", "URL tidak valid"),
  wrong: Func.texted("bold", "Format salah!"),
  notfound: Func.texted("bold", "Data tidak ditemukan!"),
  getdata: Func.texted("bold", "Scraping metadata . . ."),
  fail: Func.texted("bold", "Gagal mendapatkan data!"),
  error: Func.texted("bold", "Fiture sedang error!"),
  errorF: Func.texted("bold", "Sorry this feature is in error."),
  auth: Func.texted(
    "bold",
    "Kamu tidak ada izin untuk menggunakan fiture ini, silahkan chat admin."
  ),
  premium: Func.texted("bold", "Fiture ini khusus untuk premium."),
  vip: Func.texted("bold", "Fiture ini khusus untuk vip."),
  owner: Func.texted("bold", "Fiture ini khusus untuk owner."),
  god: Func.texted("bold", "This command only for Master"),
  group: Func.texted("bold", "Command ini hanyak untuk grup."),
  botAdmin: Func.texted(
    "bold",
    "This command will work when I become an admin."
  ),
  admin: Func.texted("bold", "This command only for group admin."),
});
