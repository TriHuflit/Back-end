const express = require('express');
const db = require('./config/db/index');
const route = require('./routes/index');
const app = express();
const cors = require('cors');
require("dotenv").config();


//Connect db
db.connect();
app.use(
    express.urlencoded({
        extended: true,
        limit:'50mb'
    }),
);

app.use(express.json({limit:'50mb'}));
app.use(cors());


const PORT = process.env.PORT || 5000;


route(app);

app.listen(PORT, () => console.log(`Server chạy trên rồi đó :http://localhost:${PORT}/api`))