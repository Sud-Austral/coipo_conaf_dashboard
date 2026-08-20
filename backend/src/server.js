import express from "express";
import cors from "cors";
import bitacora from "./routes/bitacora.js";
const app=express();
app.use(cors());
app.use(express.json());
app.get("/health",(_req,res)=>res.json({ok:true,version:"2.3.0"}));
app.use("/api/bitacora",bitacora);
app.listen(process.env.PORT||3001,()=>console.log("SIDCO API v2.3 activa"));
