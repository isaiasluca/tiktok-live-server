const express = require("express");
const { WebcastPushConnection } = require("tiktok-live-connector");

const app = express();
const PORT = process.env.PORT || 3000;

const tiktokUsername = process.env.TIKTOK_USERNAME;

// Rota básica
app.get("/", (req, res) => {
    res.send("Servidor TikTok Live conectado!");
});

// Conectar ao TikTok
const connection = new WebcastPushConnection(tiktokUsername, {
    enableExtendedGiftInfo: true
});

// Evento: Conectou
connection.connect()
    .then(state => {
        console.log(`🎉 Conectado ao TikTok Live de @${state.roomInfo.owner.nickname}`);
    })
    .catch(err => {
        console.error("❌ Erro ao conectar:", err);
    });

// Evento: Comentário
connection.on("chat", data => {
    console.log(`💬 ${data.uniqueId}: ${data.comment}`);
});

// Evento: Like
connection.on("like", data => {
    console.log(`❤️ ${data.uniqueId} deu ${data.likeCount} likes`);
});

// Evento: Gift
connection.on("gift", data => {
    console.log(`🎁 ${data.uniqueId} enviou ${data.giftName}`);
});

// Inicia servidor Express
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
