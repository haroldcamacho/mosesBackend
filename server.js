require('dotenv').config()
const PORT = process.env.PORT || 3000;
const express = require('express');
const mongoose = require('mongoose');
const translationsRouter =  require('./routes/translations')
const methodOverride = require('method-override')
const app = express();
const bodyParser = require('body-parser');

//DB SETUP
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true , useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => console.log('Connected to Database'));

//APP SETUP
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: false })); 
// app.use(methodOverride('_method'))

//ROUTES

//HOMEPAGE
app.get('/', async(req, res) => {
    res.render('main.ejs');
});

app.use('/translations', translationsRouter);

//HANDLE INVALID ROUTES
app.get('*', (req, res) => { 
  res.render('error.ejs'); 
});



//SERVER
app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});


