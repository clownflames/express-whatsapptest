import express from "express";
import { createBot } from "whatsapp-cloud-api";

const app = express();

(async () => {

    const from = '1155502984306846';
    const token = 'EAAY3ylkvza8BRdC1Q9fbNafgLaC3u1Kny1uXm9wqixuJL7BwORaLEPWHlperI5Y1XkjDfhm8nQlx0AqVtKNHKoZCztxVHz9tPfSm7f9V4gGTPmorXPug6yt1LkEgcNsQz4KtVH6YvHHHyYE5XZCg7sTLZAiOc37WuGyWgDmZBXhkpAniCXNP26hcjHfE5QZDZD';
    const to = '6378695548';
    const webhookVerifyToken = 'rohitisbest';

  const bot = createBot(from, token);

  // WhatsApp webhook server
  await bot.startExpressServer({
    webhookVerifyToken,
    webhookPath: "/webhook",
    port: 3000,
  });

  // Custom send route
  app.get("/send", async (req, res) => {
    try {
      let { text, to } = req.query;

      if (!text || !to) {
        return res.json({
          success: false,
          message: "text and to required",
        });
      }

      // Add India country code if missing
      if (!to.startsWith("91")) {
        to = "91" + to;
      }

      const result = await bot.sendText(to, text);

      res.json({
        success: true,
        result,
      });

    } catch (err) {
      console.log(err);

      res.json({
        success: false,
        error: err.message,
      });
    }
  });

  // Start express app
  app.listen(4000, () => {
    console.log("Custom API running on port 4000");
  });

})();