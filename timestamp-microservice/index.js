// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/api', (req, res) => {
  try {
    const date = new Date(Date.now())

    if (isNaN(date.getTime())) {
      return res.json({ error : "Invalid Date" })
    }

    const utc = date.toUTCString()
  
    return res.json({
      unix: parseInt(date.getTime()),
      utc
    })
  }
  catch (err) {
    console.error(`Error: ${err.message}`) 
  }
})

app.get("/api/:date", (req, res) => {
  try {
    //console.log(req.params)
    if (!req.params.date) {
      req.params.date = Date.now()
    }

    if (!isNaN(req.params.date))
      req.params.date = parseInt(req.params.date)
    
    const date = new Date(req.params.date)

    if (isNaN(date.getTime())) {
      return res.json({ error : "Invalid Date" })
    }

    const utc = date.toUTCString()
  
    return res.json({
      unix: parseInt(date.getTime()),
      utc
    })
  }
  catch (err) {
    console.error(`Error: ${err.message}`) 
  }
})

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
