/**
 * SIDCO · Catálogo de daño / uso de suelo
 * v2.6.0
 *
 * Validación ejecutiva:
 * - códigos 1–5 = Plantaciones (subtipos individuales pendientes)
 * - 6 = Arbolado
 * - 7 = Matorral
 * - 8 = Pastizal
 * - 9 = Agrícola
 * - 10 = Desechos
 *
 * El frontend nunca debe dispersar números "mágicos".
 * Cuando exista catálogo oficial por BD/API, reemplazar esta fuente
 * manteniendo el mismo contrato de datos.
 */
export const DANO_USO_SUELO = {
  1: { grupo:"Plantaciones", detalle:null, tipo:1, estado:"subtipo_pendiente" },
  2: { grupo:"Plantaciones", detalle:null, tipo:1, estado:"subtipo_pendiente" },
  3: { grupo:"Plantaciones", detalle:null, tipo:1, estado:"subtipo_pendiente" },
  4: { grupo:"Plantaciones", detalle:null, tipo:1, estado:"subtipo_pendiente" },
  5: { grupo:"Plantaciones", detalle:null, tipo:1, estado:"subtipo_pendiente" },
  6: { grupo:"Arbolado", detalle:"Arbolado", tipo:2, estado:"validado" },
  7: { grupo:"Matorral", detalle:"Matorral", tipo:2, estado:"validado" },
  8: { grupo:"Pastizal", detalle:"Pastizal", tipo:2, estado:"validado" },
  9: { grupo:"Agrícola", detalle:"Agrícola", tipo:3, estado:"validado" },
  10:{ grupo:"Desechos", detalle:"Desechos", tipo:3, estado:"validado" }
};

export const DANO_GRUPOS = {
  PLANTACIONES:[1,2,3,4,5],
  ARBOLADO:[6],
  MATORRAL:[7],
  PASTIZAL:[8],
  AGRICOLA:[9],
  DESECHOS:[10]
};

export const DANO_GRADO = {
  0:"0",
  25:"25",
  50:"50",
  75:"75",
  100:"100"
};

export function traducirUsoSuelo(codigo){
  const n=Number(codigo);
  return DANO_USO_SUELO[n] || {
    grupo:"Sin clasificar",
    detalle:null,
    tipo:null,
    estado:"desconocido"
  };
}

export function consolidarDano(registros=[]){
  const grupos = {};
  for(const registro of registros){
    const item=traducirUsoSuelo(registro.dano_uso_suelo);
    grupos[item.grupo]=(grupos[item.grupo]||0)+Number(registro.dano_superficie||0);
  }
  return grupos;
}
