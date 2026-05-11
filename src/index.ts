import express from "express";
import dotenv from "dotenv";
import { WhatsAppClient } from "@kapso/whatsapp-cloud-api";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const PHONE_ID = process.env.PHONE_ID
const token = process.env.TOKEN



const client = new WhatsAppClient({
  accessToken: process.env.TOKEN!
});



app.use(express.json());

/*
|--------------------------------------------------------------------------
| CUSTOM FUNCTIONS
|--------------------------------------------------------------------------
*/

// Message Handler
async function onMessage(message: string, from: string, type: string, rawData: string) {
  console.log("==============");
  console.log("FROM :", from);
  console.log("TYPE :", type);
  console.log("MESSAGE :", message);
  console.log("==============");


  // main code

  client.messages.sendText({
    phoneNumberId: PHONE_ID!,
    to: from,
    body: "hello client"
  })










  if (message === "hi") {
    console.log("User said hi");
  }
}

// Status Handler
async function onStatus(statusData: string) {
  console.log("STATUS UPDATE");
  console.log(statusData);
}

// Error Handler
function onError(error: string) {
  console.log("ERROR:");
  console.log(error);
}

/*
|--------------------------------------------------------------------------
| WEBHOOK VERIFY
|--------------------------------------------------------------------------
*/

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];


  client.messages.sendText({
    phoneNumberId: PHONE_ID!,
    to: "6378695548",
    body: "Someone visit the webhook GET"
  })

  if (
    mode === "subscribe" &&
    token === process.env.VERIFY_TOKEN
  ) {
    console.log("Webhook Verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});


app.get("/", function (req, res) {
  res.send("Hello user")
})

/*
|--------------------------------------------------------------------------
| WEBHOOK RECEIVE
|--------------------------------------------------------------------------
*/

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    client.messages.sendText({
      phoneNumberId: PHONE_ID!,
      to: "6378695548",
      body: "Someone visit the webhook POST"
    })

    if (!body.object) {
      return res.sendStatus(404);
    }

    const value =
      body?.entry?.[0]?.changes?.[0]?.value;

    /*
    |--------------------------------------------------------------------------
    | RECEIVE MESSAGE
    |--------------------------------------------------------------------------
    */

    const incomingMessage = value?.messages?.[0];

    if (incomingMessage) {
      const from = incomingMessage.from;

      const type = incomingMessage.type;

      let message = null;

      // TEXT
      if (type === "text") {
        message = incomingMessage.text.body;
      }

      // IMAGE
      else if (type === "image") {
        message = incomingMessage.image;
      }

      // VIDEO
      else if (type === "video") {
        message = incomingMessage.video;
      }

      // DOCUMENT
      else if (type === "document") {
        message = incomingMessage.document;
      }

      // AUDIO
      else if (type === "audio") {
        message = incomingMessage.audio;
      }

      // LOCATION
      else if (type === "location") {
        message = incomingMessage.location;
      }

      // BUTTON
      else if (type === "button") {
        message = incomingMessage.button;
      }

      // INTERACTIVE
      else if (type === "interactive") {
        message = incomingMessage.interactive;
      }

      // DEFAULT
      else {
        message = incomingMessage;
      }

      // CALL CUSTOM FUNCTION
      await onMessage(
        message,
        from,
        type,
        incomingMessage
      );
    }

    /*
    |--------------------------------------------------------------------------
    | STATUS UPDATE
    |--------------------------------------------------------------------------
    */

    const status = value?.statuses?.[0];

    if (status) {
      await onStatus(status);
    }

    return res.sendStatus(200);
  } catch (error) {
    onError(error);
    return res.sendStatus(500);
  }
});

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/
export default app;