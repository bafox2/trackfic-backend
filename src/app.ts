import express from "express";
import config from 'config'

const port = config.get<string>("port");
const app = express();

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

  
