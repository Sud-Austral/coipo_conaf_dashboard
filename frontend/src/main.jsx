import React from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import {SolicitudProvider} from './context/SolicitudContext.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SolicitudProvider>
        <App/>
      </SolicitudProvider>
    </BrowserRouter>
  </React.StrictMode>
)
