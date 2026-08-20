import {Router} from "express";
import {narrarBitacora} from "../services/bitacoraService.js";
const router=Router();
router.get("/:id",(req,res)=>{
  res.json(narrarBitacora({
    inceId:req.params.id,
    inicio:"17 de enero de 2026",
    superficieHa:6943,
    estado:"Extinguido",
    calidad:"Media-Alta"
  }));
});
export default router;
