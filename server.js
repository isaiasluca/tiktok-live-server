const express = require("express");
const TikTokLive = require("tiktok-live");
const app = express();

const username = process.env.TIKTOK_USERNAME;

app.get("/", (req, res) => {
  res.send("Servidor TikTok Live funcionando! ✔");
});

// cria conexão
let tiktok = new TikTokLive(username, {
  enableWebsocket: true,
});

// conecta
tiktok.connect()
  .then(() => console.log("🔥 Conectado ao TikTok Live!"))
  .catch(err => console.error("❌ Erro ao conectar:", err));

// eventos
tiktok.on("chat", msg => {
  console.log(`💬 ${msg.uniqueId}: ${msg.comment}`);
});

tiktok.on("gift", gift => {
  console.log(`🎁 Gift: ${gift.giftName} x${gift.repeatCount}`);
});

tiktok.on("like", like => {
  console.log(`❤️ Like: ${like.uniqueId} (${like.likeCount})`);
});

// Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server ON na porta ${PORT}`));
