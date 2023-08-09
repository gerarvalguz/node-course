const { connection } = require("./database/connection");
const express  = require("express");
const cors  = require("cors");

//Intialize app message
console.log("DB trying to connect...");

//Connect to DB
connection();

//Create Node server
const app = express();
const port = 3900;

//Config CORS
app.use(cors());

//Convert body to js object / url encoded
app.use(express.json()); // content type app/json
app.use(express.urlencoded({extended:true})); // form-url-encoded

//Create routes
const articles_routes = require("./routes/Article");

//routes prefix
app.use("/api", articles_routes);

app.get("/test",(req, res) => {
    console.log("Inside test route");
    return res.status(200).json({
        course: "PHP",
        author: "Gera",
        url: "google.mx"
    })
});

app.get("/", (req,res)=>{
    return res.status(200).json({
        course: "Welcome",
        author: "Gera VG",
        url: "google.mx"
    })
})

//Create server and listen http requests
app.listen(port,()=>{
    console.log("Server runing on port: " + port);
})