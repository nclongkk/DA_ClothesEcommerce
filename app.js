const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const i18n = require('i18n');
const cors = require('cors');
const socketio = require('socket.io');
const i18nConfig = require('./config/i18n.config');
const routes = require('./routes/index');
const socketHandler = require('./utils/socketHandler');
const app = express();

//load env var
dotenv.config();

// Enable CORS
app.use(cors());

// Setup i18n
i18nConfig();
app.use(i18n.init);

//Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

//ejs
app.set('view engine', 'ejs');
app.set('views', './views');

//public css, js
app.use(express.static('public'));
//routes
app.use('/api/v1', routes);
app.get('/', (req, res) => res.render('dashboard'));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, console.log(`Server running on port ${PORT}`));
const io = socketio(server);
global._emitter = io;
socketHandler(io);
