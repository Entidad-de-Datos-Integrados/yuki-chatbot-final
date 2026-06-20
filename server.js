// ─── Importaciones y configuración ───────────────────────────────
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const OPENAI_KEY = process.env.OPENAI_API_KEY;

// Puedes agregar varias claves de ElevenLabs (para respaldo)
//const ELEVEN_API_KEYS = [
  //process.env.ELEVEN_API_KEY_1,
  //process.env.ELEVEN_API_KEY_2,
  //process.env.ELEVEN_API_KEY_3,
]//.filter(Boolean); // filtra las vacías

// Carpeta para guardar audios cacheados
//const voicesDir = path.join(process.cwd(), "voices");
//if (!fs.existsSync(voicesDir)) fs.mkdirSync(voicesDir);

//let chatHistory = [];

// ─── CHAT ─────────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  chatHistory.push({ role: "user", content: userMessage });
  if (chatHistory.length > 6) chatHistory = chatHistory.slice(-6);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Eres Yuki Nagato. Responde con lógica, calma y sin exageraciones.`,
          },
          ...chatHistory,
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Lo siento, no puedo sincronizarme con entidad de datos integrados";
    chatHistory.push({ role: "assistant", content: reply });
    res.json({ reply });
  } catch (error) {
    console.error("❌ Error /api/chat:", error);
    res.status(500).json({ error: "Error al conectar con OpenAI" });
  }
});

// ─── VOZ (ElevenLabs con cache y respaldo) ───────────────────────
//app.post("/api/voice", async (req, res) => {
  //const { text } = req.body;
  //if (!text) return res.status(400).send("Falta texto para sintetizar.");

  //try {
    // Convertir texto a nombre de archivo seguro
    //const safeFileName =
      //text.toLowerCase().replace(/[^a-z0-9áéíóúüñ]+/gi, "_").slice(0, 60) + ".mp3";
    //const filePath = path.join(voicesDir, safeFileName);

    // Si ya existe en caché, lo devolvemos directamente
    //if (fs.existsSync(filePath)) {
      //console.log(`🎧 Audio en caché encontrado: ${safeFileName}`);
      //res.set("Content-Type", "audio/mpeg");
      //return fs.createReadStream(filePath).pipe(res);
    }

    //console.log("🗣️ Solicitando voz a ElevenLabs...");

    //let audioBuffer = null;
    //let success = false;

    // Intentar con cada API key hasta que funcione
    //for (const key of ELEVEN_API_KEYS) {
      //try {
        //const response = await fetch(
          //"https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB/stream", // voz predeterminada
          //{
            //method: "POST",
            //headers: {
              //"xi-api-key": key,
              //"Content-Type": "application/json",
            },
            //body: JSON.stringify({
              //text,
              //voice_settings: {
                //stability: 0.5,
                //similarity_boost: 0.8,
              },
            }),
          }
        );

        //if (!response.ok) {
          //const errorText = await response.text();
          //console.warn(`⚠️ Error con token: ${key.slice(0, 10)}...`);
          //console.warn(`→ Respuesta: ${errorText}`);
          //continue; // probar siguiente token
        }

        //audioBuffer = await response.arrayBuffer();
        //fs.writeFileSync(filePath, Buffer.from(audioBuffer)); // guardar en caché
        //console.log(`✅ Voz generada y guardada como: ${safeFileName}`);
        //success = true;
        //break;
      } //catch (err) {
        //console.warn("⚠️ Error con una API key, probando siguiente...", err);
      }
    }

    //if (!success) throw new Error("Ninguna API key funcionó para generar voz.");

    //res.set("Content-Type", "audio/mpeg");
    //res.send(Buffer.from(audioBuffer));

  } //catch (error) {
    //console.error("❌ Error al generar la voz:", error);
    //res.status(500).send("Error generando voz con ElevenLabs");
  }
});

// ─── Inicio del servidor ─────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor activo en http://localhost:${PORT}`)
);
