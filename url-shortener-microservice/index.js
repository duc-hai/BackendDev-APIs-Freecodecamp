require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let storageArray = []

app.post('/api/shorturl', (req, res) => {
  try {
    // if (!req || !req.body || !req.body.url) {
    //   return res.json({
    //     error: 'invalid url'
    //   })
    // }
    const url = req?.body?.url
    console.log(url)
    // const urlRegex = /^http?\:\/\/([a-zA-Z0-9]+\.)?[a-zA-Z0-9]+\.[a-zA-Z0-9]+\/?[\w\/\-\.\_\~\!\$\&\'\(\)\*\+\,\;\=\:\@\%]+?$/
    // if(urlRegex.test(url)) {
    //   return res.json({
    //     error: 'invalid url'
    //   })
    // }
    if (!url.includes('https')) {
      return res.json({
        error: 'invalid url'
      })
    }
    const id = parseInt(storageArray.length + 1)
    storageArray.push({ id, url })
    // console.log(storageArray)

    return res.json({
      original_url: url,
      short_url: id
    })
  }
  catch (err) {
    console.error(`Error: ${err.message}`)
    return res.json({
      error: `Error: ${err.message}`
    })
  }
})

app.get('/api/shorturl/:shortUrl', (req, res) => {
  try {
    const id = parseInt(req?.params?.shortUrl)

    const element = storageArray.find(value => {
      return value.id == id
    })
    // console.log(element)
    return res.redirect(element.url)
  }
  catch (err) {
    console.error(`Error: ${err.message}`)
    return res.json({
      'error': `${err.message}`
    })
  }
})

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
