export async function getDashboard(){
 const url=import.meta.env.VITE_API_URL || 'http://localhost:3001/api/dashboard'
 const r=await fetch(url)
 if(!r.ok) throw new Error('No fue posible obtener los datos del backend')
 return r.json()
}
