const path = require('path');
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/conversations", (req, res) => {
  console.log("/CONVERSATIONS")
  const conversations = [
    { id: 1, mobileNumber: "+12063996576", name: "John" },
    { id: 2, mobileNumber: "+12063693826", name: "Lani" },
    { id: 3, mobileNumber: "+12067245201", name: "Mike" },
    { id: 4, mobileNumber: "+12067245169", name: "Lynn" },
  ]
  res.json(conversations);
});

app.get("/messages", (req, res) => {
  console.log("/MESSAGES")
  const messages = [
    { id: 1, body: "Hello there", direction: "inbound" },
    { id: 2, body: "Hi", direction: "outbound" },
    { id: 3, body: "How are you?", direction: "inbound" },
    { id: 4, body: "I'm fine", direction: "outbound" }
  ]
  res.json(messages);
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  console.log("* CATCHALL")
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
