export function construirHechos(datos) {
  const hechos = [];

  if (datos.inicio) {
    hechos.push({
      tipo: "inicio",
      texto: `El incendio se inició el ${datos.inicio}.`
    });
  }

  if (Number.isFinite(datos.minInicioDeteccion)) {
    hechos.push({
      tipo: "deteccion",
      texto: `El incendio fue detectado ${datos.minInicioDeteccion} minutos después de su inicio.`
    });
  }

  if (Number.isFinite(datos.superficieHa)) {
    hechos.push({
      tipo: "impacto",
      texto: `La superficie registrada alcanzó aproximadamente ${datos.superficieHa.toLocaleString("es-CL")} hectáreas.`
    });
  }

  if (Number.isFinite(datos.recursosDistintos)) {
    hechos.push({
      tipo: "recursos",
      texto: `Durante la emergencia participaron ${datos.recursosDistintos} recursos distintos.`
    });
  }

  return hechos;
}

export function narrarBitacora(datos) {
  const hechos = construirHechos(datos);

  return {
    titulo: `Incendio ${datos.inceId}`,
    ubicacion: [datos.comuna, datos.region].filter(Boolean).join(" · "),
    hechos,
    resumen: hechos.map((h) => h.texto).join(" "),
    calidad: datos.calidad ?? "Pendiente"
  };
}
