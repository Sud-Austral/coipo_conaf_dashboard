import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import dashboardRouter from './routes/dashboard.js'
dotenv.config()
const app=express()
const port=Number(process.env.PORT||3001)
app.use(cors()); app.use(express.json())
app.get('/',(_req,res)=>res.json({ok:true,service:'FW Coipo BI',architecture:'React + Node + PostgreSQL'}))
app.use('/api',dashboardRouter)
app.listen(port,()=>console.log(`API Node ejecutándose en http://localhost:${port}`))
