const express = require('express');
var path = require('path');
const handlebars = require('express-handlebars');
const open = require('open');

const app = express();
const port = 9000;

//Loads the handlebars module
//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');
//Sets handlebars configurations (we will go through them later on)
app.engine('.hbs', handlebars({
	extname: '.hbs', 
	defaultLayout: '../default'
}));
app.set('views', path.join(__dirname, 'designs'));
app.set('view engine', '.hbs');
//app.use(express.static('assets'));
app.use("/", express.static('assets'));
app.use("/designs", express.static('designs'));
app.get('/', (req, res) => {
	res.render('index');
});

app.listen(port, () => {
	console.log(`App listening to port ${port}`)

	//open('http://localhost:' + port);
});