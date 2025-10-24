const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDb = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes =require("./routes/categoryRoutes")
const productRoutes =require("./routes/productRoutes")
const orderRoutes = require("./routes/orderRoutes")
const path =require("path");
const middlemanRoutes = require('./routes/middlemanRoutes');

const cors = require("cors");
const bodyParser = require('body-parser');

const fs = require('fs');



 
dotenv.config();

connectDb();

const app = express();

// middleware
// app.use(cors());
app.use(cors({
    
        origin: "http://localhost:3000", // or '*' to allow all origins, but this is less secure
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        // allowedHeaders: ['Content-Type', 'Authorization'],
   
    
  }));
  app.use(bodyParser.json({ limit: '10mb' }));  // For JSON bodies
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(morgan("dev"));
app.use(express.json());


// routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/product',productRoutes);
app.use('/api/v1/order',orderRoutes);
app.use('/api/v1/middleman', middlemanRoutes);

// REST API 
app.get("/", (req, res) => {
    res.send({ msg: "<h1>this is me! roshan</h1>" });
});


const PORT = process.env.PORT || 8000;

// If a built React app exists in client/build, serve it as static assets so
// visiting http://localhost:8000 will return the front-end. This also allows
// serving the app in production from the same Express server.
const clientBuildPath = path.join(__dirname, 'client', 'build');
if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    // Serve index.html for any unknown route (client-side routing)
    app.get('*', (req, res) => {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`server started at the port ${PORT} `.bgYellow.green.bold.underline);
});

