export function narrarBitacora(datos){
  const hechos=[];
  if(datos.inicio) hechos.push(`El incendio se inició el ${datos.inicio}.`);
  if(Number.isFinite(datos.superficieHa)) hechos.push(`La superficie registrada alcanzó aproximadamente ${datos.superficieHa.toLocaleString("es-CL")} hectáreas.`);
  if(datos.estado) hechos.push(`El estado final registrado es ${datos.estado}.`);
  return {titulo:`Incendio ${datos.inceId}`,resumen:hechos.join(" "),hechos,calidad:datos.calidad ?? "Pendiente"};
}
