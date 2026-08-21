const express = require('express');
const app = express();

var website = require('./Routes/website.js');
var admin = require('./Routes/admin.js');

app.use('/',website);
app.use('/admin',admin)

app.use(express.static('public'))
app.listen(3002)  