const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey: process.env.MAILER_API_KEY,
});

const app = express();
app.use(cors());

//read the bodys
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json("Hi ✋");
});

app.post("/connection", async (req, res) => {
  try {
    const { firstName, name, email, subject, message } = req.body;

    const sentFrom = new Sender(
      "vincent@trial-neqvygmq9p540p7w.mlsender.net",
      "Vincent"
    );

    const recipients = [new Recipient(email, firstName + " " + name)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setHtml(`<strong>${message}</strong>`)
      .setText(message);

    const sendedMail = await mailerSend.email
      .send(emailParams)
      .catch((error) => {
        console.log(error);

        throw {
          status: 500,
          message:
            error +
            "Problème lors de l'envoi du mail, veuillez essayer de nouveau",
        };
      });

    console.log(sendedMail);

    res.status(200).json("Email envoyé avec succès");
  } catch (error) {
    res
      .status(500 || error.status)
      .json({ message: error.message || "Internal server error" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is runnin'");
});
