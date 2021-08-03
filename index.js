const express = require('express');
const session = require('express-session');

const fs = require('fs');

var app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(session({ 		//Usuage
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

const PORT = 5000;

app.get('/', function (req, res) {
  res.send('Hello World!');
});


app.use(/\/proxy\/.*/,
  (req, res, next) => {
    if(req.session) {
        next();
    }
  }
);

app.post('/proxy/save/:id', function (req, res) {
    const id = req.params.id;
    const jsonData = JSON.stringify(req.body, null, 2);

    fs.writeFile(`${id}.json`, jsonData, (error) => {
        if(error) {
            res.status(404).json({ message: error });
        } else {
            res.status(200).json("File written successfully\n");
        }
    });
});

app.get('/proxy/fetch/:id', function (req, res) {
    const id = req.params.id;

    try { 
        const data = JSON.parse(fs.readFileSync(`${id}.json`));
        res.status(200).json(data);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

app.listen(5000, function () {
  console.log(`Server running  on port  ${PORT}`);
});