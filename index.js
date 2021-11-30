const express = require('express');
const db = require('./config/db/index');
const route = require('./routes/index');
const app = express();
const cors = require('cors');
require("dotenv").config();
const bodyParser=require('body-parser');

//Connect db
db.connect();
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 5000;


route(app);

app.listen(PORT, () => console.log(`Server chạy trên rồi đó :http://localhost:${PORT}/api`))