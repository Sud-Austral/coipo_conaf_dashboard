import {Navigate,Route,Routes} from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Inteligencia from './pages/Inteligencia.jsx'
import Territorio from './pages/Territorio.jsx'
import Respuesta from './pages/Respuesta.jsx'
import Recursos from './pages/Recursos.jsx'
import Impacto from './pages/Impacto.jsx'
import Evolucion from './pages/Evolucion.jsx'

export default function App(){
 return <Layout><Routes>
  <Route path="/" element={<Inteligencia/>}/>
  <Route path="/territorio" element={<Territorio/>}/>
  <Route path="/respuesta" element={<Respuesta/>}/>
  <Route path="/recursos" element={<Recursos/>}/>
  <Route path="/impacto" element={<Impacto/>}/>
  <Route path="/evolucion" element={<Evolucion/>}/>
  <Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes></Layout>
}
