// server.js
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
app.use(express.urlencoded({ extended: true }));

app.post('/export', (req, res) => {
  const username = req.body.username;
  exec(`node letterboxd-export.js ${username}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
  res.send('Export started');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});