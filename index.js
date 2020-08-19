const express = require('express')
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
//   res.send('Hello World!')
    res.render('main.ejs');
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});