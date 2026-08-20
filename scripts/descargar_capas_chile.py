from pathlib import Path
from datetime import datetime
import json, re, time, unicodedata
import requests

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"frontend"/"public"/"data"/"capas"
OUT.mkdir(parents=True,exist_ok=True)

TIMEOUT=90
PAGE_SIZE=1500
session=requests.Session()
session.headers.update({"User-Agent":"Forestin-SIDCO-Dashboard/2.8.0 local-cache"})

PROTECTED="https://arcgis.mma.gob.cl/server/rest/services/SIMBIO/SIMBIO_AP/FeatureServer/0/query"
FOREST_SERVICE="https://esri.ciren.cl/server/rest/services/IDEMINAGRI/RECURSOS_FORESTALES_DESCARGA/FeatureServer"
URBAN="https://services.arcgis.com/r7t1P5pnkoOLRdhr/ArcGIS/rest/services/L%C3%ADmite_Royalty_Minero_2025/FeatureServer/9/query"
RURAL="https://services.arcgis.com/r7t1P5pnkoOLRdhr/ArcGIS/rest/services/Microdatos_Censo_2024/FeatureServer/1/query"

def slug(s):
    s="".join(c for c in unicodedata.normalize("NFD",str(s or "sin_region")) if unicodedata.category(c)!="Mn")
    return re.sub(r"[^a-z0-9]+","_",s.lower()).strip("_")

def get(url,params=None,retries=4):
    err=None
    for n in range(retries):
        try:
            r=session.get(url,params=params,timeout=TIMEOUT)
            r.raise_for_status()
            d=r.json()
            if d.get("error"): raise RuntimeError(str(d["error"]))
            return d
        except Exception as e:
            err=e
            time.sleep(2*(n+1))
    raise err

def query_all(url,out_fields="*",extra=None):
    feats=[]; off=0
    while True:
        p={"where":"1=1","outFields":out_fields,"returnGeometry":"true","outSR":"4326",
           "f":"geojson","resultOffset":off,"resultRecordCount":PAGE_SIZE,
           "geometryPrecision":5,"maxAllowableOffset":0.00045}
        d=get(url,p)
        batch=d.get("features",[])
        for f in batch:
            f.setdefault("properties",{})
            if extra: f["properties"].update(extra)
        feats.extend(batch)
        print("   ",len(feats))
        if len(batch)<PAGE_SIZE: break
        off+=PAGE_SIZE
    return feats

def bbox_feature(f):
    coords=[]
    def walk(x):
        if isinstance(x,list):
            if len(x)>=2 and isinstance(x[0],(int,float)) and isinstance(x[1],(int,float)):
                coords.append((x[0],x[1]))
            else:
                for y in x: walk(y)
    walk((f.get("geometry") or {}).get("coordinates",[]))
    if not coords:return None
    xs=[x for x,y in coords]; ys=[y for x,y in coords]
    return [min(xs),min(ys),max(xs),max(ys)]

def bbox_fc(features):
    boxes=[bbox_feature(f) for f in features]
    boxes=[b for b in boxes if b]
    if not boxes:return None
    return [min(b[0] for b in boxes),min(b[1] for b in boxes),max(b[2] for b in boxes),max(b[3] for b in boxes)]

def save_partition(layer,groups,source):
    base=OUT/layer
    base.mkdir(parents=True,exist_ok=True)
    entries=[]
    for region,features in groups.items():
        fn=f"{slug(region)}.geojson"
        path=base/fn
        path.write_text(json.dumps({"type":"FeatureCollection","features":features},ensure_ascii=False,separators=(",",":")),encoding="utf-8")
        entries.append({"region":region,"file":f"{layer}/{fn}","features":len(features),"bbox":bbox_fc(features)})
    return {"available":bool(entries),"source":source,"entries":entries}

manifest={"version":"2.0","generated_at":datetime.now().isoformat(),"strategy":"lazy viewport / regional partitions","layers":{}}

# Áreas protegidas: national request then partition by region property
print("1. Áreas protegidas MMA/SIMBIO")
try:
    feats=query_all(PROTECTED,"OBJECTID,NombreOriginal,designacion,categoria,region")
    groups={}
    for f in feats:
        reg=(f.get("properties") or {}).get("region") or "Chile"
        groups.setdefault(str(reg),[]).append(f)
    manifest["layers"]["areas_protegidas"]=save_partition("areas_protegidas",groups,"MMA · SIMBIO")
except Exception as e:
    manifest["layers"]["areas_protegidas"]={"available":False,"error":str(e),"entries":[]}

# Bosques: introspect all FeatureServer polygon layers, each layer usually corresponds to territory/catastro
print("2. Recursos forestales IDE Minagri")
try:
    meta=get(FOREST_SERVICE,{"f":"json"})
    groups={}
    for layer in meta.get("layers",[]):
        lid=layer["id"]; name=layer.get("name",f"layer_{lid}")
        print("  ",lid,name)
        try:
            layer_meta=get(f"{FOREST_SERVICE}/{lid}",{"f":"json"})
            if "polygon" not in str(layer_meta.get("geometryType","")).lower():
                continue
            feats=query_all(f"{FOREST_SERVICE}/{lid}/query","*",{"region_dashboard":name})
            if feats: groups[name]=feats
        except Exception as le:
            print("    omitida:",le)
    manifest["layers"]["bosques"]=save_partition("bosques",groups,"IDE Minagri / CONAF · Recursos Forestales")
except Exception as e:
    manifest["layers"]["bosques"]={"available":False,"error":str(e),"entries":[]}

# Urbano
print("3. Zonas urbanas")
try:
    feats=query_all(URBAN,"OBJECTID,URBANO,COMUNA,PROVINCIA,REGION,CUT_COM")
    groups={}
    for f in feats:
        p=f.get("properties") or {}
        reg=p.get("REGION") or p.get("PROVINCIA") or "Chile"
        groups.setdefault(str(reg),[]).append(f)
    manifest["layers"]["urbano"]=save_partition("urbano",groups,"INE / servicio ArcGIS publicado")
except Exception as e:
    manifest["layers"]["urbano"]={"available":False,"error":str(e),"entries":[]}

# Rural
print("4. Localidades/entidades rurales")
try:
    feats=query_all(RURAL,"OBJECTID,NOM_REGION,NOM_PROVINCIA,NOM_COMUNA,NOM_LOCALIDAD,NOM_ENTIDAD,TIPO_CATEGORIA,n_per")
    groups={}
    for f in feats:
        p=f.get("properties") or {}
        reg=p.get("NOM_REGION") or p.get("NOM_PROVINCIA") or "Chile"
        groups.setdefault(str(reg),[]).append(f)
    manifest["layers"]["rural"]=save_partition("rural",groups,"INE · Microdatos Censo 2024")
except Exception as e:
    manifest["layers"]["rural"]={"available":False,"error":str(e),"entries":[]}

# Otros usos: explicit unavailable until vector source validated
manifest["layers"]["otros_usos"]={
    "available":False,"source":"CONAF / IDE Minagri",
    "error":"Pendiente fuente vectorial local validada","entries":[]
}

(OUT/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf-8")
print("\nLISTO:",OUT/"manifest.json")
for k,v in manifest["layers"].items():
    print(k, "DISPONIBLE" if v.get("available") else "NO DISPONIBLE", len(v.get("entries",[])))
