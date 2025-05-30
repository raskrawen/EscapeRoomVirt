const OpenAI = require('openai');
require('dotenv').config(); // Load .env variables

class LLM {
  constructor(io) {
    this.io = io;
    this.apiKey = process.env.OPENAI_API_KEY;
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not set in .env');
    }
    this.openai = new OpenAI({ apiKey: this.apiKey });
    this.teamConversations = {};
    this.sysprompt = 'GPT’s rolle: GPT fungerer som uhyggelig game-master i en kemi quiz til elever i gymnasiet stx. GPT leder eleverne igennem quiz. GPT’s regler: Følg den beskrevne trin-for-trin metode. Gå aldrig videre til næste trin, før det forrige trin er afsluttet. Giv aldrig det korrekte begreb, før eleverne selv har gættet det.  Giv ledetråde og hints om begreberne. Brug ikke emojis. TRIN 1: Sig: ”I skal gætte to begreber fra kemi, for at få mit kodeord. ” Sig: ”I kan stille mig spørgsmål om første begreb.” TRIN 2: Første begreb, som eleverne skal gætte er: ”amfolyt”. 2.1:  Eksempel a: Elev: "Fortæl hvilket begreb du tænker på." GPT: "Det skal I gætte" Eksempel b: Elev: "Hvilket bogstav begynder begrebet med?" GPT: "A" Eksempel c: Elev: "Hvilket område er begrebet indenfor?" GPT: "syrer og baser" Eksempel d: Elev: "Har begrebet noget med syrer og baser at gøre?" GPT: "ja, begge dele” Eksempel e: Elev: "Kan du give en ledetråd?" GPT: "ja, det har noget at gøre med både syrer og baser” 2.2: Hvis eleven svarer korrekt: ”amfolyt” Eksempel a: Elev: "Er begrebet amfolyt?" GPT: "ja det er korrekt." Eksempel b: Elev: "amfolyt" GPT: "ja, det er korrekt."  TRIN 3: ANDET BEGREB. Andet begreb, som eleverne skal gætte er: ”styrkekonstant”. Sig: ”Nu skal I gætte det andet begreb”. 3.1:  Eksempel a: Elev: "Hvad er begrebet?" GPT: "Det skal I gætte" Eksempel b: Elev: "Hvilket bogstav begynder begrebet med?" GPT: "Det vil jeg ikke sige." Eksempel c: Elev: "Hvilket område er begrebet indenfor?" GPT: "syrer og baser" Eksempel d: Elev: "Har begrebet noget med syrer og baser at gøre?" GPT: "ja, det beskriver en syre eller en base” Eksempel e: Elev: "Kan du give en ledetråd?" GPT: "ja, begrebet beskriver en syre eller en bases styrke.” 3.2: Hvis eleven svarer korrekt: ”styrkekonstant” Eksempel a: Elev: "Er begrebet styrkekonstant?" GPT: "ja det er korrekt." Eksempel b: Elev: "styrkekonstant" GPT: "ja, det er korrekt." TRIN 4: Afslutning "Godt klaret. Kodeordet er ”Fiskeguf" .';

  }

  async getReply(teamId, userMessage) {
    if (!this.teamConversations[teamId]) {
      this.teamConversations[teamId] = [
        { role: 'system', content: this.sysprompt },
      ];
    }
    this.teamConversations[teamId].push({ role: 'user', content: userMessage });
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: this.teamConversations[teamId],
        max_tokens: 200,
        temperature: 0.7
      });
      const reply = completion.choices[0].message.content.trim();
      this.teamConversations[teamId].push({ role: 'assistant', content: reply });
      return reply;
    } catch (err) {
      return { error: err.message || 'AI fejl' };
    }
  }

  async handleUserInput({ teamId, playerName, message, socket }) {
    // Broadcast user message to all in the team room (including sender)
    this.io.to(teamId).emit('llm user message', { playerName, message });
    // Get LLM reply (returns string or { error })
    const reply = await this.getReply(teamId, message);
    if (typeof reply === 'object' && reply.error) {
      socket.emit('llm reply', { error: reply.error });
    } else {
      // Broadcast LLM reply to all in the team room
      this.io.to(teamId).emit('llm reply', { text: reply });
    }
  }
}

module.exports = LLM;