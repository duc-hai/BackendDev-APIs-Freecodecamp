var express = require('express');
var cors = require('cors');
const multer = require('multer')
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null , file.originalname)
  },
})

const upload = multer({ storage: storage })

app.post('/api/fileanalyse', upload.single("upfile"), (req, res) => {
  try {
    if(!req.file)
      return res.json({ status: 'error', message: 'please upload a file'})
    
    return res.json({
      name: req.file.filename,
      type: req.file.mimetype,
      size: req.file.size
    })
  }
  catch (err) {
    console.error(`Error: ${err.message}`)
    return res.json({ error: `Error: ${err.message}` })
  }
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
