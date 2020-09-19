require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.set('view engine', 'ejs');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true , useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => console.log('Connected to Database'));


app.use(express.json())

const translationsRouter =  require('./routes/translations')
app.use('/translations', translationsRouter);





app.use('/translate',()=>{
  console.log("This returns the translation");
});


app.get('/', (req, res) => {
//   res.send('Hello World!')
    res.render('main.ejs');
});



app.get('/translate', (req,res)=> {
  res.send('Sentence translated');

});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});