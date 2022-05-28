const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const i18n = require('i18n');
const cors = require('cors');
const i18nConfig = require('./config/i18n.config');
const routes = require('./routes/index');
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

//routes
app.use('/api/v1', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
