export const regions = [
  {id:"8", name:"Biobío", lat:-36.83, lon:-73.05, incendios:2256, superficie:62290, prioridad:92, recursos:9300, calidad:82},
  {id:"9", name:"La Araucanía", lat:-38.73, lon:-72.59, incendios:1375, superficie:23012, prioridad:78, recursos:6700, calidad:79},
  {id:"7", name:"Maule", lat:-35.43, lon:-71.65, incendios:1161, superficie:19925, prioridad:73, recursos:6100, calidad:86},
  {id:"16", name:"Ñuble", lat:-36.61, lon:-72.10, incendios:841, superficie:13181, prioridad:69, recursos:4800, calidad:75},
  {id:"13", name:"Metropolitana", lat:-33.45, lon:-70.66, incendios:1042, superficie:7040, prioridad:61, recursos:3500, calidad:84},
  {id:"5", name:"Valparaíso", lat:-33.05, lon:-71.62, incendios:1261, superficie:2387, prioridad:58, recursos:4200, calidad:80}
];

export const provincesByRegion = {
  "8":[
    {id:"81",name:"Concepción",lat:-36.83,lon:-73.03,incendios:621,superficie:49100,prioridad:94},
    {id:"83",name:"Biobío",lat:-37.47,lon:-72.35,incendios:812,superficie:10800,prioridad:82},
    {id:"82",name:"Arauco",lat:-37.25,lon:-73.32,incendios:540,superficie:2390,prioridad:71}
  ],
  "9":[
    {id:"91",name:"Cautín",lat:-38.73,lon:-72.59,incendios:760,superficie:9700,prioridad:78},
    {id:"92",name:"Malleco",lat:-37.80,lon:-72.71,incendios:615,superficie:13312,prioridad:84}
  ]
};

export const communesByProvince = {
  "81":[
    {id:"8101",name:"Hualqui",lat:-36.98,lon:-72.94,incendios:109,superficie:13927,prioridad:96},
    {id:"8102",name:"Concepción",lat:-36.82,lon:-73.04,incendios:76,superficie:27748,prioridad:98},
    {id:"8103",name:"Florida",lat:-36.82,lon:-72.67,incendios:58,superficie:7343,prioridad:88},
    {id:"8104",name:"Tomé",lat:-36.62,lon:-72.96,incendios:122,superficie:38,prioridad:62}
  ]
};

export const fires = [
  {id:"805119003",name:"Concepción",regionId:"8",provinceId:"81",communeId:"8102",lat:-36.82,lon:-73.04,ha:13871,estado:"Extinguido",inicio:"17 ene 2026 · 16:43", confianza:86},
  {id:"805149434",name:"Hualqui",regionId:"8",provinceId:"81",communeId:"8101",lat:-36.98,lon:-72.94,ha:6943,estado:"Extinguido",inicio:"17 ene 2026 · 17:55", confianza:84},
  {id:"805221387",name:"Florida",regionId:"8",provinceId:"81",communeId:"8103",lat:-36.82,lon:-72.67,ha:3552,estado:"Extinguido",inicio:"17 ene 2026 · 20:01", confianza:89},
  {id:"805351873",name:"Los Ángeles",regionId:"8",provinceId:"83",communeId:"",lat:-37.47,lon:-72.35,ha:3857,estado:"Extinguido",inicio:"17 ene 2026 · 22:49", confianza:90},
  {id:"811206947",name:"Parral",regionId:"7",provinceId:"",communeId:"",lat:-36.14,lon:-71.83,ha:4519,estado:"Extinguido",inicio:"30 ene 2026 · 08:38", confianza:87}
];

export const baseKpis = [
  {label:"Incendios registrados",value:"9.694",delta:"−12,9%",confidence:"Alta",coverage:"100%",source:"SIDCO · incendio.ince_fecha_inicio"},
  {label:"Superficie registrada",value:"131.891 ha",delta:"−14,0%",confidence:"Media-Alta",coverage:"77,01%",source:"SIDCO · incendio.ince_superficie"},
  {label:"Superficie media",value:"17,67 ha",delta:"+7,4%",confidence:"Media-Alta",coverage:"77,01%",source:"SIDCO · incendio.ince_superficie"},
  {label:"Inicio → Extinción",value:"100 min",delta:"Mediana",confidence:"Alta",coverage:"98,34%",source:"SIDCO · fechas operacionales"},
  {label:"Primer ataque → Control",value:"67 min",delta:"Mediana",confidence:"Media",coverage:"60,45%",source:"SIDCO · fechas operacionales"},
  {label:"Incendios >100 ha",value:"—",delta:"Pendiente cálculo",confidence:"Media-Alta",coverage:"77,01%",source:"SIDCO · superficie"},
  {label:"Territorio prioritario",value:"Biobío",delta:"IPT experimental 92",confidence:"Experimental",coverage:"—",source:"Índice interno de priorización"},
  {label:"Recursos movilizados",value:"1.769",delta:"Recursos distintos",confidence:"Alta",coverage:"Alta",source:"SIDCO · recurso + movimiento"}
];

export const qualityRows = [
  ["Fecha inicio","100%","Alta"],
  ["Fecha extinción","98,34%","Alta"],
  ["Fecha salida","96,01%","Alta"],
  ["Fecha arribo","84,96%","Media-Alta"],
  ["Superficie","77,01%","Media-Alta"],
  ["Coordenadas","76,08%","Media-Alta"],
  ["Primer ataque","66,30%","Media"],
  ["Control","60,45%","Media"]
];
