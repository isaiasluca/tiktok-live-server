const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { WebcastPushConnection } = require("tiktok-live-connector");

const app = express();
const PORT = process.env.PORT || 3000;

// Criar servidor HTTP
const server = http.createServer(app);

// Criar WebSocket
const wss = new WebSocket.Server({ server });

// username fixo (para testes)
const tiktokUsername = "seccion303";

// Rota principal
app.get("/", (req, res) => {
    res.send("Servidor TikTok Live rodando com WebSocket!");
});

// Logs de conexões WebSocket
wss.on("connection", (ws) => {
    console.log("🟢 Cliente conectado ao WebSocket");
    ws.send(JSON.stringify({ message: "Conectado ao servidor WebSocket" }));
});

// Envia dados para todos clientes conectados
function broadcast(data) {
    const msg = JSON.stringify(data);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
}

// ===============================
//   Conexão TikTok
// ===============================
const tiktokLive = new WebcastPushConnection(tiktokUsername);

// Evento: conectado
tiktokLive.connect()
    .then((state) => {
        console.log(`📡 Conectado à live de @${state.roomInfo.owner.nickname}`);
    })
    .catch((err) => {
        console.error("❌ Erro ao conectar TikTok:", err);
    });

// Evento: chat
tiktokLive.on("chat", (event) => {
    broadcast({
        type: "chat",
        uniqueId: event.uniqueId,
        comment: event.comment
    });
});

// Evento: like
tiktokLive.on("like", (event) => {
    broadcast({
        type: "like",
        uniqueId: event.uniqueId,
        likeCount: event.likeCount
    });
});

// Evento: presente
tiktokLive.on("gift", (event) => {
    broadcast({
        type: "gift",
        uniqueId: event.uniqueId,
        giftId: event.giftId
    });
});

// ===============================
//   Iniciar servidor
// ===============================
server.listen(PORT, () => {
    console.log(`🚀 Servidor Web + WebSocket no ar na porta ${PORT}`);
});
