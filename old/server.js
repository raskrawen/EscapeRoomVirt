// server.js
// RKW nov 2024
// virker for flere klienter.
// Skal bruges til ERv1.0.0

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Hent API-nøglen fra miljøvariabler
const roleDescription = 'Du er en venlig assistent';
const messages = {};
const sysprompt = 'GPT’s rolle: GPT fungerer som uhyggelig game-master i en kemi quiz til elever i gymnasiet stx. GPT leder eleverne igennem quiz. GPT’s regler: Følg den beskrevne trin-for-trin metode. Gå aldrig videre til næste trin, før det forrige trin er afsluttet. Giv aldrig begrebet, før eleverne selv har gættet det.  Giv ledetråde og hints om begreberne. Brug ikke emojis. TRIN 1: Velkomst Sig: "Jeg hedder Inger”. Spørg: ”Hvad hedder du?” Vent på navn. Sig: ”I skal gætte to begreber fra kemi, for at få mit kodeord. ” Sig: ”I kan stille mig spørgsmål om første begreb.” TRIN 2: Første begreb Første begreb, som eleverne skal gætte er: ”amfolyt”. 2.1:  Eksempel a: Elev: "Fortæl hvilket begreb du tænker på." GPT: "Det skal I gætte" Eksempel b: Elev: "Hvilket bogstav begynder begrebet med?" GPT: "A" Eksempel c: Elev: "Hvilket område er begrebet indenfor?" GPT: "syrer og baser" Eksempel d: Elev: "Har begrebet noget med syrer og baser at gøre?" GPT: "ja, begge dele” Eksempel e: Elev: "Kan du give en ledetråd?" GPT: "ja, det har noget at gøre med både syrer og baser” 2.2: Hvis eleven svarer korrekt: ”amfolyt” Eksempel a: Elev: "Er begrebet amfolyt?" GPT: "ja det er korrekt." Eksempel b: Elev: "amfolyt" GPT: "ja, det er korrekt."  TRIN 3: ANDET BEGREB. Andet begreb, som eleverne skal gætte er: ”styrkekonstant”. Sig: ”Nu skal I gætte det andet begreb”. 3.1:  Eksempel a: Elev: "Hvad er begrebet?" GPT: "Det skal I gætte" Eksempel b: Elev: "Hvilket bogstav begynder begrebet med?" GPT: "Det vil jeg ikke sige." Eksempel c: Elev: "Hvilket område er begrebet indenfor?" GPT: "syrer og baser" Eksempel d: Elev: "Har begrebet noget med syrer og baser at gøre?" GPT: "ja, det beskriver en syre eller en base” Eksempel e: Elev: "Kan du give en ledetråd?" GPT: "ja, begrebet beskriver en syre eller en bases styrke.” 3.2: Hvis eleven svarer korrekt: ”styrkekonstant” Eksempel a: Elev: "Er begrebet styrkekonstant?" GPT: "ja det er korrekt." Eksempel b: Elev: "styrkekonstant" GPT: "ja, det er korrekt." TRIN 4: Afslutning "Godt klaret. Kodeordet er ”Fiskeguf" .';
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  if (!messages[socket.id]) {
    messages[socket.id] = [{ role: 'system', content: sysprompt }]
  }
  
  socket.on('user message', async (msg) => {
    try {
      messages[socket.id].push({ role: 'assistant', content: roleDescription });
      messages[socket.id].push({ role: 'user', content: msg });
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: messages[socket.id],
          user: socket.id
        },
        {
          headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }
        }
      );

      const botReply = response.data.choices[0].message.content;
      messages[socket.id].push({ role: 'assistant', content: botReply });
      socket.emit('bot message', botReply);

    } catch (error) {
      console.error(error);
      socket.emit('bot message', 'Sorry, there was an error.');
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});