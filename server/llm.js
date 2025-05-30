const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config(); // Load .env variables

class LLM {
  constructor(io) {
    this.io = io;
    this.conversations = new Map();
    this.systemPrompt = 'Du er en uhyggelig game-master i en kemi quiz til elever i gymnasiet stx. Følg trin-for-trin, gå aldrig videre før forrige trin er afsluttet, giv aldrig begrebet før eleverne selv har gættet det, giv ledetråde og hints, ingen emojis.';

    this.apiKey = process.env.OPENAI_API_KEY;
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not set in .env');
    }
    this.openai = new OpenAIApi(new Configuration({ apiKey: this.apiKey }));
  }

  startConversation(teamId) {
    this.conversations.set(teamId, [{ role: 'system', content: this.systemPrompt }]);
  }

  getMessages(teamId) {
    if (!this.conversations.has(teamId)) this.startConversation(teamId);
    return this.conversations.get(teamId);
  }

  async handleUserInput({ teamId, playerName, message, socket }) {
    const messages = this.getMessages(teamId);
    messages.push({ role: 'user', content: `${playerName}: ${message}` });
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-4o-mini',
        messages,
        user: teamId
      });
      const botReply = response.data.choices[0].message.content;
      messages.push({ role: 'assistant', content: botReply });
      this.io.to(teamId).emit('llm reply', { playerName: 'GameMaster', message: botReply });
    } catch (error) {
      console.error(error);
      socket.emit('llm reply', { playerName: 'GameMaster', message: 'Der opstod en fejl med AI.' });
    }
  }
}

module.exports = LLM;