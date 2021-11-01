

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@cluster0.qubsi.mongodb.net/Mydata');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
	console.log("connection succeeded");
})

