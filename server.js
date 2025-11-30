const express = require("express");
const { WebcastPushConnection } = require("tiktok-live-connector-2");
const app = express();

const username = process.env.TIKTOK_USERNAME;

if (!username) {
  console.error("❌ ERRO: Variável TIKTOK_USERNAME não foi configurada no Render.");
  process.exit(1);
}

app.get("/", (req, res) => {
  res.send("Servidor TikTok Live está rodando! ✔");
});

// Inicia conexão com TikTok Live
const tiktok = new WebcastPushConnection(username, {
  enableExtendedGiftInfo: true,
});

// Conectar ao vivo
tiktok.connect()
  .then(state => {
    console.log("🔗 Conectado ao TikTok Live!");
    console.log("📌 Room ID:", state.roomId);
  })
  .catch(err => {
    console.error("❌ Erro ao conectar:", err);
  });

// Evento de chat
tiktok.on("chat", data => {
  console.log(`💬 ${data.uniqueId}: ${data.comment}`);
});

// Evento de gift
tiktok.on("gift", data => {
  console.log(`🎁 Gift de ${data.uniqueId}: ${data.giftName}`);
});

// Porta Render
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🔥 Servidor rodando na porta ${port}`);
});
