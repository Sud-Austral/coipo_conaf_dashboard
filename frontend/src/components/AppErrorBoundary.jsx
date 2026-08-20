import React from "react";

export default class AppErrorBoundary extends React.Component {
  constructor(props){
    super(props);
    this.state={error:null};
  }

  static getDerivedStateFromError(error){
    return {error};
  }

  componentDidCatch(error,info){
    console.error("Dashboard runtime error",error,info);
  }

  render(){
    if(this.state.error){
      return (
        <div style={{
          minHeight:"100vh",
          background:"#f3f5f3",
          color:"#26342e",
          display:"grid",
          placeItems:"center",
          padding:"32px",
          fontFamily:"system-ui, sans-serif"
        }}>
          <div style={{
            width:"min(760px, 100%)",
            background:"#fff",
            border:"1px solid #d5ddd8",
            borderRadius:"14px",
            padding:"24px",
            boxShadow:"0 8px 30px rgba(0,0,0,.08)"
          }}>
            <small style={{fontWeight:800,letterSpacing:".08em"}}>COIPO · DASHBOARD SIDCO</small>
            <h1 style={{fontSize:"22px",margin:"8px 0"}}>No fue posible cargar una vista</h1>
            <p style={{lineHeight:1.5}}>
              El dashboard encontró un dato o componente incompatible. La aplicación ya no queda en negro:
              este mensaje permite identificar el problema desde la consola del navegador.
            </p>
            <pre style={{
              whiteSpace:"pre-wrap",
              overflowWrap:"anywhere",
              background:"#f6f7f6",
              padding:"12px",
              borderRadius:"8px",
              fontSize:"12px"
            }}>{String(this.state.error?.message || this.state.error)}</pre>
            <button
              onClick={()=>window.location.reload()}
              style={{
                marginTop:"10px",
                border:"0",
                borderRadius:"8px",
                padding:"10px 14px",
                cursor:"pointer",
                fontWeight:700
              }}
            >Recargar dashboard</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
