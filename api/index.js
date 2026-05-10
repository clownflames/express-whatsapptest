import { createBot } from 'whatsapp-cloud-api';

(async () => {
  try {
     const from = '1155502984306846';
    const token = 'EAAY3ylkvza8BRdC1Q9fbNafgLaC3u1Kny1uXm9wqixuJL7BwORaLEPWHlperI5Y1XkjDfhm8nQlx0AqVtKNHKoZCztxVHz9tPfSm7f9V4gGTPmorXPug6yt1LkEgcNsQz4KtVH6YvHHHyYE5XZCg7sTLZAiOc37WuGyWgDmZBXhkpAniCXNP26hcjHfE5QZDZD';
    const to = '6378695548';
    const webhookVerifyToken = 'rohitisbest';

    const bot = createBot(from, token);

    // Start server FIRST
    await bot.startExpressServer({
      webhookVerifyToken,
      webhookPath: "/webhook",
      port: 3000
    });

    console.log("Server running");

    // Text message listener
    bot.on("text", async (message) => {
      console.log(message);

      await bot.sendText(
        message.from,
        "Your text message received"
      );
    });

    // All message listener
    bot.on("message", async (message) => {
      console.log(message);

      await bot.sendText(
        message.from,
        `Message type: ${message.type}`
      );
    });

  } catch (err) {
    console.log(err);
  }
})();