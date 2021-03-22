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

const config = { 
	site: {
		logo: '/designs/images/logo.png',
		title: 'Impact'
	},
	title: "Lorem ipsum dolor sit amet",
	primary_tag: {
		url: "#",
		name: "Updates"
	},
	custom_excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus gravida quis blandit turpis cursus in hac. ",
	content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus gravida quis blandit turpis cursus in hac. Amet commodo nulla facilisi nullam vehicula ipsum a arcu. Velit dignissim sodales ut eu sem integer vitae justo eget. Amet mattis vulputate enim nulla aliquet porttitor. Aenean euismod elementum nisi quis eleifend quam adipiscing vitae. Aenean pharetra magna ac placerat vestibulum lectus mauris ultrices eros. Ultrices vitae auctor eu augue. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus. Varius morbi enim nunc faucibus. Vestibulum lectus mauris ultrices eros in.<br/><br/>Viverra ipsum nunc aliquet bibendum enim facilisis gravida. Cras adipiscing enim eu turpis egestas pretium. Ultrices sagittis orci a scelerisque purus semper eget duis. Posuere ac ut consequat semper viverra. Mi proin sed libero enim sed faucibus turpis. Vitae ultricies leo integer malesuada nunc vel. Fames ac turpis egestas integer eget aliquet nibh. Laoreet non curabitur gravida arcu ac tortor dignissim convallis. Tortor at auctor urna nunc id cursus metus aliquam eleifend. Egestas sed sed risus pretium quam vulputate. Tempor id eu nisl nunc mi ipsum faucibus.<br/><br/>Massa ultricies mi quis hendrerit dolor magna eget est lorem. Laoreet id donec ultrices tincidunt arcu non sodales. Feugiat in ante metus dictum. Etiam non quam lacus suspendisse faucibus interdum posuere lorem. Enim ut tellus elementum sagittis vitae. Et odio pellentesque diam volutpat commodo sed egestas. Sit amet facilisis magna etiam. Sollicitudin tempor id eu nisl nunc mi ipsum faucibus. Cursus turpis massa tincidunt dui ut ornare lectus. Natoque penatibus et magnis dis parturient montes nascetur ridiculus mus. Fusce id velit ut tortor. Ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget gravida. Sit amet dictum sit amet. Amet consectetur adipiscing elit duis.<br/><br/>Sed pulvinar proin gravida hendrerit. Curabitur vitae nunc sed velit dignissim sodales ut eu. Urna id volutpat lacus laoreet. Sit amet tellus cras adipiscing enim eu. Faucibus interdum posuere lorem ipsum dolor sit amet. Libero id faucibus nisl tincidunt eget nullam non. Euismod nisi porta lorem mollis aliquam ut porttitor. Arcu cursus euismod quis viverra nibh cras pulvinar. Etiam erat velit scelerisque in dictum non consectetur a. Mattis nunc sed blandit libero volutpat sed. Ultrices gravida dictum fusce ut placerat orci nulla. Aenean pharetra magna ac placerat vestibulum lectus mauris ultrices eros. Placerat in egestas erat imperdiet sed euismod.<br/><br/>Ut tortor pretium viverra suspendisse. Consequat mauris nunc congue nisi. Facilisi nullam vehicula ipsum a arcu cursus vitae congue mauris. Tristique senectus et netus et malesuada fames ac. Mattis molestie a iaculis at. Vulputate eu scelerisque felis imperdiet proin fermentum leo. Diam quam nulla porttitor massa id neque. Amet tellus cras adipiscing enim. Vel orci porta non pulvinar neque laoreet suspendisse. Dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in. Tortor aliquam nulla facilisi cras fermentum odio. Suspendisse potenti nullam ac tortor vitae purus faucibus. At urna condimentum mattis pellentesque id nibh tortor id aliquet.",
	authors: `<a href="/author/eduardo/">Eduardo Chiaro</a>`,
	date: "Feb 23, 2019",
	reading_time: "3 min"
}

app.get('/', (req, res) => {
	res.render('index', { 
		...config, 
		body_class: "home-template",
	});
});
app.get('/post', (req, res) => {
	res.render('post', {
		...config, 
		body_class: "post-template",
	});
});

app.listen(port, () => {
	console.log(`App listening to port ${port}`)

	//open('http://localhost:' + port);
});