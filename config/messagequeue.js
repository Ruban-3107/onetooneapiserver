const amqp = require("amqplib");
let channel;
let connection;
const msgExchange = "Notification";
const config = require('./config');

class MessageQueue {
  constructor() {}

  connect() {
    return new Promise((resolve, reject) => {
      amqp
        .connect(
         config.message_queue
        )
        .then((conn) => {
          connection = conn;
          return conn.createChannel();
        })
        .then((ch) => {
          channel = ch;

          return ch
            .assertExchange(msgExchange, "fanout", { durable: false })
            .then((ok) => {
              console.log("MessageQueue -> constructor -> ok", ok);
              resolve();
            });
        })
        .catch((error) => {
          console.error("MessageQueue -> constructor -> error", error);
          reject(error);
        });
    });
  }

  send(message) {
    try {
      channel.publish(msgExchange, "", Buffer.from(message));
      console.log(" [x] Sent %s", message);
    } catch (error) {
      console.log("MessageQueue -> send -> error", error);
    } finally {
      setTimeout(() => {
        connection.close();
      }, 500);

    }
  }
}

module.exports = MessageQueue;
