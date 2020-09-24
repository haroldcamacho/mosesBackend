require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
// app.use(express.json());

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

//DB SETUP
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true , useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => console.log('Connected to Database'));


//ROUTES
const translationsRouter =  require('./routes/translations')
app.use('/translations', translationsRouter);

//HOMEPAGE
app.get('/', (req, res) => {
    res.render('main.ejs');
});

//HANDLE INVALID ROUTES
app.get('*', (req, res) => { 
  res.render('error.ejs'); 
});



//SERVER
app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});


