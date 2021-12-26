const path = require('path');
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/messages", (req, res) => {
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
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
