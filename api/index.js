import { createBot } from 'whatsapp-cloud-api';
// or if using require:
// const { createBot } = require('whatsapp-cloud-api');

(async () => {
  try {
    // replace the values below
    const from = '1155502984306846';
    const token = 'EAAY3ylkvza8BRdC1Q9fbNafgLaC3u1Kny1uXm9wqixuJL7BwORaLEPWHlperI5Y1XkjDfhm8nQlx0AqVtKNHKoZCztxVHz9tPfSm7f9V4gGTPmorXPug6yt1LkEgcNsQz4KtVH6YvHHHyYE5XZCg7sTLZAiOc37WuGyWgDmZBXhkpAniCXNP26hcjHfE5QZDZD';
    const to = '6378695548';
    const webhookVerifyToken = 'rohitisbest';

    // Create a bot that can send messages
    const bot = createBot(from, token);

    // Send text message
    // const result = await bot.sendText(to, 'Hello world');

    // Start express server to listen for incoming messages
    // NOTE: See below under `Documentation/Tutorial` to learn how
    // you can verify the webhook URL and make the server publicly available
    const server = await bot.startExpressServer({
      webhookVerifyToken,
      webhookPath:"/webhook",
    });


    server.app.get("/send-text", async (req, res) => {
      const { to, text } = req.query;
      if (!to || !text) {
        return res.status(400).send("Missing 'to' or 'text' query parameter");
      } 
      try {
        await bot.sendText(to, text);
        res.send(`Message sent to ${to}`);
      } catch (err) {
        console.error(err);
        res.status(500).send('Failed to send message');
      }
    });


    

    // Listen to ALL incoming messages
    // NOTE: remember to always run: await bot.startExpressServer() first
    bot.on('message', async (msg) => {
      console.log(msg);

      if (msg.type === 'text') {
        await bot.sendText(msg.from, 'Received your text message!');
      } else if (msg.type === 'image') {
        await bot.sendText(msg.from, 'Received your image!');
      }
    });
  } catch (err) {
    console.log(err);
  }



})();