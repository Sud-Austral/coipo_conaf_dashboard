import {Router} from 'express'
import {dashboard} from '../data/dashboard.js'
const router=Router()
router.get('/dashboard',(_req,res)=>res.json(dashboard))
router.get('/health',(_req,res)=>res.json({ok:true,service:'fw-coipo-inteligencia-incendios-api'}))
export default router
