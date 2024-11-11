import express from "express"
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import db from "./config/Database.js"
import router from "./routes/index.js"
// import Users from "./models/UserModel.js"
dotenv.config();
const app = express();
const port = 5000

try{
    await db.authenticate();
    console.log('databases connected');
    // await Users.sync() // untuk membuat tabel users secara otomatis jika tidak ada
}catch (error){
    console.log(error);
}

app.use(cors({credentials:true, origin:'http://localhost:3000'}))
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(port, () => {
console.log(`server running at port ${port}`)
})