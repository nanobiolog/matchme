const express = require('express');
const path = require('path');
const app = express();

app.get('/download', function(req, res){
    const file = path.resolve(__dirname, 'movies.json');
    res.download(file); // Set disposition and send it.
});

app.listen(3000, function () {
    console.log('App is listening on port 3000!');
});