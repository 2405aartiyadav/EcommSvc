const express=require('express');
const bodyparser=require('body-parser');
const session=require
const cors = require('cors');
const { AuthRouter } = require('./router/AuthRouter');
const mongoConnect=require('./database/mongooseConnection.js')
const app=express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))

app.use(cors({ origin: "http://localhost:5173" }));
app.use('/auth',AuthRouter)
app.get('/test',(req,res)=>{
    console.log("test api");
    res.send("test api")
    
})

app.listen(8080,()=>{
    mongoConnect();
    console.log("Server running on 8080 port");
    
})