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
  {label:"Incendios >400 ha",value:"—",delta:"Pendiente cálculo",confidence:"Media-Alta",coverage:"77,01%",source:"SIDCO · superficie"},
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


// v2.4.0 · KPI real validado desde SIDCO
export const largeFireKpi = {
  thresholdHa: 400,
  current: 48,
  previous: 88,
  variationPct: -45.45,
  surfaceCoveragePct: 76.98,
  firesWithSurface: 7439,
  firesTotal: 9664
};

export const territorialPriority = [
  {id:8, name:"Biobío", ipt:92, superficie:96, frecuencia:81, grandes:76, operacion:83, variacion:58},
  {id:9, name:"La Araucanía", ipt:78, superficie:77, frecuencia:73, grandes:71, operacion:69, variacion:62},
  {id:7, name:"Maule", ipt:73, superficie:72, frecuencia:68, grandes:66, operacion:70, variacion:55},
  {id:13, name:"Metropolitana", ipt:61, superficie:54, frecuencia:67, grandes:58, operacion:64, variacion:49},
  {id:5, name:"Valparaíso", ipt:57, superficie:51, frecuencia:63, grandes:49, operacion:61, variacion:46}
];


// v2.5.0 · datos demo para Vista 3 / Replay operacional
export const operationalSummary = {
  recursosMovilizados: 1769,
  personalMovilizado: 179969,
  incendiosAtendidos: 8279,
  medianaDespachoArribo: 18,
  medianaArriboCombate: 2,
  medianaPrimerAtaqueControl: 67
};

export const operationalReplayFires = [
  {
    id:"805149434",
    name:"Hualqui",
    region:"Biobío",
    lat:-36.925556,
    lon:-72.888056,
    ha:6943.1881,
    status:"Extinguido",
    resources:[
      {
        id:"BR-01",
        name:"Brigada terrestre 01",
        type:"brigada",
        combatants:18,
        base:[-36.82,-73.05],
        destination:[-36.925556,-72.888056],
        events:[
          {t:0, label:"Despacho", time:"17:58"},
          {t:15, label:"Salida", time:"18:13"},
          {t:44, label:"Arribo", time:"18:42"},
          {t:50, label:"Inicio combate", time:"18:48"},
          {t:180, label:"Fin combate", time:"20:58"},
          {t:220, label:"Retiro", time:"21:38"}
        ]
      },
      {
        id:"HEL-02",
        name:"Helicóptero 02",
        type:"aereo",
        combatants:2,
        base:[-36.77,-73.06],
        destination:[-36.925556,-72.888056],
        events:[
          {t:8, label:"Despacho", time:"18:06"},
          {t:18, label:"Salida", time:"18:16"},
          {t:34, label:"Arribo", time:"18:32"},
          {t:38, label:"Inicio combate", time:"18:36"},
          {t:145, label:"Fin combate", time:"20:23"},
          {t:170, label:"Retiro", time:"20:48"}
        ]
      },
      {
        id:"CAM-08",
        name:"Recurso terrestre 08",
        type:"terrestre",
        combatants:6,
        base:[-36.88,-72.96],
        destination:[-36.925556,-72.888056],
        events:[
          {t:12, label:"Despacho", time:"18:10"},
          {t:20, label:"Salida", time:"18:18"},
          {t:58, label:"Arribo", time:"18:56"},
          {t:64, label:"Inicio combate", time:"19:02"},
          {t:205, label:"Fin combate", time:"21:23"},
          {t:238, label:"Retiro", time:"21:56"}
        ]
      }
    ]
  },
  {
    id:"805119003",
    name:"Concepción",
    region:"Biobío",
    lat:-36.815556,
    lon:-72.918333,
    ha:13871.5418,
    status:"Extinguido",
    resources:[
      {
        id:"BR-11",
        name:"Brigada terrestre 11",
        type:"brigada",
        combatants:22,
        base:[-36.83,-73.03],
        destination:[-36.815556,-72.918333],
        events:[
          {t:0,label:"Despacho",time:"16:48"},
          {t:7,label:"Salida",time:"16:55"},
          {t:25,label:"Arribo",time:"17:13"},
          {t:29,label:"Inicio combate",time:"17:17"},
          {t:210,label:"Fin combate",time:"20:18"},
          {t:250,label:"Retiro",time:"20:58"}
        ]
      }
    ]
  }
];


// v2.6.0 · Vista 4 · cifras obtenidas en exploración SIDCO 2025/26
// daño clasificado: public.dano, periodo 2025-07-01 a 2026-07-01
export const damageSummary202526 = {
  incendiosTotal: 9664,
  incendiosConDano: 5287,
  coberturaDanoPct: 54.71,
  superficieDanoCaracterizada: 79596.4893,
  largeFires: 48,
  surfaceCoveragePct: 76.98,
  source: "SIDCO · public.dano + public.incendio"
};

export const damageByCategory202526 = [
  // Plantaciones = suma de códigos 1–5
  {key:"plantaciones", label:"Plantaciones", codes:[1,2,3,4,5], ha:28076.0286},
  {key:"arbolado", label:"Arbolado", codes:[6], ha:15241.9390},
  {key:"matorral", label:"Matorral", codes:[7], ha:13785.2107},
  {key:"pastizal", label:"Pastizal", codes:[8], ha:12708.6589},
  {key:"agricola", label:"Agrícola", codes:[9], ha:3963.7701},
  {key:"desechos", label:"Desechos", codes:[10], ha:5821.8820}
];

export const damageByGrade202526 = [
  {grade:0, registros:10149, ha:31486.3202},
  {grade:25, registros:943, ha:2771.5080},
  {grade:50, registros:1372, ha:6187.5896},
  {grade:75, registros:1076, ha:5495.4449},
  {grade:100, registros:4715, ha:33655.6266}
];

export const damageTerritoriesDemo = [
  {id:"8", name:"Biobío", ha:39800, damageHa:34400, fires:2256, coverage:61, urbanDistanceKm:2.8},
  {id:"9", name:"La Araucanía", ha:23012, damageHa:15180, fires:1375, coverage:56, urbanDistanceKm:4.1},
  {id:"7", name:"Maule", ha:19925, damageHa:12840, fires:1161, coverage:53, urbanDistanceKm:3.6},
  {id:"16", name:"Ñuble", ha:13181, damageHa:9100, fires:841, coverage:51, urbanDistanceKm:5.2},
  {id:"13", name:"Metropolitana", ha:7040, damageHa:4320, fires:1042, coverage:48, urbanDistanceKm:1.7},
  {id:"5", name:"Valparaíso", ha:2387, damageHa:2180, fires:1261, coverage:45, urbanDistanceKm:1.3}
];
