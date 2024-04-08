require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
let store = [];
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// my code
app.post('/api/shorturl', (req, res) => {
  let url;
  try {
    url = new URL(req.body.url);
  } catch (error) {
    // If the URL is invalid, respond with an error
    return res.json({ error: 'invalid url' });
  }
  let hostName = url.hostname;
  console.log(hostName);
  dns.lookup(hostName, (err, address, family) => {
    if (err) {
      console.log("i am here");
      return res.json({ error: 'invalid url'});
    }
    let number = Math.floor((Math.random() *100) + 1);
    let response = {
      original_url: req.body.url,
      short_url: number
    };
    store.push(response);
    res.json(response);
  });
});


app.get('/api/shorturl/:short_url', (req, res) => {
  let number = Number(req.params.short_url)
  console.log(number);
  let url;
  store.forEach(element => {
    if (element.short_url == number) 
      url = element.original_url;
  })
  console.log(url);
  res.redirect(url);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
