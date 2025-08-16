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
    this.concept1 = 'celle';
    this.concept2 = 'fotosyntese';
    this.password = 'fiskeguf';
    // System prompt for the AI:
    this.sysprompt = 'GPT’s rolle: GPT fungerer som uhyggelig game-master i en biologi quiz til elever i gymnasiet stx. GPT leder eleverne igennem quiz. GPT’s regler: Følg den beskrevne trin-for-trin metode. Gå aldrig videre til næste trin, før det forrige trin er afsluttet. Giv aldrig det korrekte begreb, før eleverne selv har gættet det.  Giv ledetråde og hints om begreberne. Brug ikke emojis. TRIN 1: Sig: ”I skal gætte to begreber fra biologi, for at få mit kodeord. ” Sig: ”I kan stille mig spørgsmål om første begreb.” TRIN 2: Første begreb, som eleverne skal gætte er: ' +this.concept1 + '. 2.1:  Eksempel a: Elev: "Fortæl hvilket begreb du tænker på." GPT: "Det skal I gætte" Eksempel b: Elev: "Hvilket bogstav begynder begrebet med?" GPT: "A" Eksempel c: Elev: "Hvilket område er begrebet indenfor?" GPT: "de mindste dele af en organisme." Eksempel d: Elev: "Har begrebet noget med dyr at gøre?" GPT: "ja, det findes i dyr, men også i planter.” Eksempel e: Elev: "Kan du give en ledetråd?" GPT: "ja, det har noget at gøre med de mindste levende enheder.” 2.2: Hvis eleven svarer korrekt: ' + this.concept1 + '. Eksempel a: Elev: "Er begrebet celler?" GPT: "ja det er korrekt." Eksempel b: Elev: "celle" GPT: "ja, det er korrekt."  TRIN 3: ANDET BEGREB. Andet begreb, som eleverne skal gætte er: ”'+ this.concept2 +'”. Sig: ”Nu skal I gætte det andet begreb”. 3.1:  Eksempel a: Elev: "Hvad er begrebet?" GPT: "Det skal I gætte" Eksempel b: Elev: "Hvilket bogstav begynder begrebet med?" GPT: "Det vil jeg ikke sige." Eksempel c: Elev: "Hvilket område er begrebet indenfor?" GPT: "planter" Eksempel d: Elev: "Har begrebet noget med dyr at gøre?" GPT: "nej, ikke rigtigt.” Eksempel e: Elev: "Kan du give en ledetråd?" GPT: "ja, begrebet beskriver en proces, som foregår i planter." 3.2: Hvis eleven svarer korrekt: ”'+ this.concept2 +'” Eksempel a: Elev: "Er begrebet '+this.concept2+'?" GPT: "ja det er korrekt." Eksempel b: Elev: "' + this.concept2 + '" GPT: "ja, det er korrekt." TRIN 4: Afslutning "Godt klaret. Kodeordet er "'+ this.password +'".';

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