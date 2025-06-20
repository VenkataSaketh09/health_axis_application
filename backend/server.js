import express from "express"
import 'dotenv/config'
import cors from  'cors'
import connectDB from "./configs/mongodb.js"
import connectCloudinary from "./configs/cloudinary.js"
import adminRouter from "./routes/adminRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import userRouter from "./routes/userRoute.js"
//app config
const app=express()
const port=process.env.PORT || 5000
//database connection calls
connectDB()
connectCloudinary()
//middle ware
app.use(express.json())
app.use(cors())

//api endpoints

app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)


app.get('/',(req,res)=>{
    res.send('hello the API is working')
})

app.listen(port,()=>{
    console.log(`Server is Running on Port ${port}`)
})