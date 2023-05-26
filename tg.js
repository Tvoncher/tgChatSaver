import * as tg from "telegram";
import input from "input";
import fs from "fs";

export const messagesArray = [];

const messagesJsonPath = "messages.json";

//enter your own apiId and apiHash
const apiId = 1000;
const apiHash = "string";

// fill this later with the value from session.save() to avoid logging in
const stringSession = new tg.sessions.StringSession("enter_string_here");

const phoneNumber = "+number";
const password = "enter_your_own_pw";

//id of chat that you wanna save
const chatId = 00000000000;

(async () => {
  const client = new tg.TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await phoneNumber,
    password: async () => await password,
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  //enter this string to avoid logging in again
  console.log(client.session.save());

  const chat = await client.getMessages(-chatId, {
    limit: undefined,
  });

  chat.forEach(async (m, i) => {
    if (m.fromId.userId && m.text) {
      const author = await client.getEntity(m.fromId.userId);
      const text = m.message;
      const date = m.date;

      if (author.username && text) {
        messagesArray.push({
          author: author.username,
          text: text,
          date: date,
          id: m.id,
        });
        const jsonMessages = JSON.stringify(messagesArray);
        fs.writeFile(messagesJsonPath, jsonMessages, (err) => console.log(err));
      }
    }
  });
})();
