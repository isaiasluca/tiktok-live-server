const express = require("express");
const { WebcastPushConnection } = require("tiktok-live-connector");

const app = express();
const PORT = process.env.PORT || 3000;

// Usuário do TikTok vindo das variáveis do Render
const tiktokUser = process.env.TIKTOK_USERNAME;

// Verificação básica
if (!tiktokUser) {
    console.error("❌ ERRO FATAL: variável TIKTOK_USERNAME não definida.");
    process.exit(1);
}

app.get("/", (req, res) => {
    res.send("🔥 Servidor TikTok Territory rodando ✔️");
});

const connection = new WebcastPushConnection(tiktokUser, {
    enableExtendedGiftInfo: true
});

// Conecta
connection.connect()
    .then(state => {
        console.log(`🎉 Conectado à live de ${state.roomInfo.owner.nickname}`);
    })
    .catch(err => {
        console.error("❌ Erro ao conectar:", err);
    });

// Comentários
connection.on("chat", data => {
    console.log(`💬 ${data.uniqueId}: ${data.comment}`);
});

// Likes
connection.on("like", data => {
    console.log(`❤️ ${data.uniqueId} deu ${data.likeCount} likes`);
});

// Gifts
connection.on("gift", data => {
    console.log(`🎁 ${data.uniqueId} enviou ${data.giftName}`);
});

// Servidor Express
app.listen(PORT, () => {
    console.log(`🚀 Server ON na porta ${PORT}`);
});
