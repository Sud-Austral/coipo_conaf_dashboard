"""
Descarga/caché local de capas territoriales oficiales para Forestin SIDCO Dashboard.

Genera:
frontend/public/data/capas/
  areas_protegidas.geojson
  bosques.geojson
  manifest.json

Fuentes:
- Áreas Protegidas: MMA / SIMBIO FeatureServer layer 0
- Bosque nativo / recursos forestales:
  IDE Minagri RECURSOS_FORESTALES_DESCARGA FeatureServer
  * Layer 4: Maule
  * Layer 0: Biobío
  * Layer 3: La Araucanía

"Otros usos de suelo" se mantiene NO DISPONIBLE en esta versión hasta contar
con una fuente vectorial local compatible/validada. No se vuelve a usar un WMS
silencioso como fallback.

Uso:
    python scripts/descargar_capas_oficiales.py

Dependencia:
    pip install requests
"""

from pathlib import Path
from datetime import datetime
import json
import time
import requests

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "public" / "data" / "capas"
OUT.mkdir(parents=True, exist_ok=True)

TIMEOUT = 60
PAGE_SIZE = 1800
SIMPLIFY_DEG = 0.00035  # aprox. decenas de metros, útil para web.

PROTECTED_URL = (
    "https://arcgis.mma.gob.cl/server/rest/services/"
    "SIMBIO/SIMBIO_AP/FeatureServer/0/query"
)

FOREST_BASE = (
    "https://esri.ciren.cl/server/rest/services/"
    "IDEMINAGRI/RECURSOS_FORESTALES_DESCARGA/FeatureServer"
)

FOREST_LAYERS = {
    "Maule": 4,
    "Biobío": 0,
    "La Araucanía": 3,
}

session = requests.Session()
session.headers.update({
    "User-Agent": "Forestin-SIDCO-Dashboard/2.7.3 local-cache"
})

def get_json(url, params, retries=3):
    last_error = None
    for attempt in range(retries):
        try:
            r = session.get(url, params=params, timeout=TIMEOUT)
            r.raise_for_status()
            payload = r.json()
            if payload.get("error"):
                raise RuntimeError(payload["error"])
            return payload
        except Exception as exc:
            last_error = exc
            if attempt < retries-1:
                time.sleep(2 * (attempt+1))
    raise last_error

def download_feature_layer(url, out_fields="*", extra_props=None):
    features = []
    offset = 0

    while True:
        params = {
            "where": "1=1",
            "outFields": out_fields,
            "returnGeometry": "true",
            "outSR": "4326",
            "f": "geojson",
            "resultOffset": offset,
            "resultRecordCount": PAGE_SIZE,
            "geometryPrecision": 5,
            "maxAllowableOffset": SIMPLIFY_DEG,
        }

        payload = get_json(url, params)
        batch = payload.get("features", [])

        for feat in batch:
            feat.setdefault("properties", {})
            if extra_props:
                feat["properties"].update(extra_props)

        features.extend(batch)
        print(f"  descargados: {len(features)}")

        if len(batch) < PAGE_SIZE:
            break

        offset += PAGE_SIZE

    return {
        "type": "FeatureCollection",
        "features": features,
    }

def save_geojson(name, fc):
    path = OUT / name
    path.write_text(
        json.dumps(fc, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8"
    )
    return path

manifest = {
    "version": "1.0",
    "generated_at": datetime.now().isoformat(),
    "layers": {
        "areas_protegidas": {
            "available": False,
            "file": "areas_protegidas.geojson",
            "label": "Áreas protegidas",
            "source": "MMA · SIMBIO"
        },
        "bosques": {
            "available": False,
            "file": "bosques.geojson",
            "label": "Bosques / vegetación natural",
            "source": "IDE Minagri · Recursos Forestales",
            "coverage": list(FOREST_LAYERS.keys())
        },
        "otros_usos": {
            "available": False,
            "file": "otros_usos.geojson",
            "label": "Otros usos de suelo",
            "source": "CONAF / IDE Minagri",
            "note": "No disponible: pendiente fuente vectorial local validada"
        }
    }
}

print("="*80)
print("1. ÁREAS PROTEGIDAS · MMA / SIMBIO")
print("="*80)
try:
    protected = download_feature_layer(
        PROTECTED_URL,
        out_fields="OBJECTID,NombreOriginal,designacion,categoria,region"
    )
    path = save_geojson("areas_protegidas.geojson", protected)
    manifest["layers"]["areas_protegidas"].update({
        "available": True,
        "features": len(protected["features"]),
        "bytes": path.stat().st_size
    })
    print("OK:", path)
except Exception as exc:
    print("NO DISPONIBLE:", exc)
    manifest["layers"]["areas_protegidas"]["error"] = str(exc)

print()
print("="*80)
print("2. BOSQUES / VEGETACIÓN NATURAL · IDE MINAGRI")
print("="*80)

forest_features = []
forest_errors = {}

for region, layer_id in FOREST_LAYERS.items():
    print()
    print(region, f"(layer {layer_id})")
    url = f"{FOREST_BASE}/{layer_id}/query"
    try:
        fc = download_feature_layer(
            url,
            out_fields="objectid,volbrut_ha,abasal_ha,numarb_ha,biomasa_ha,carbfus_ha",
            extra_props={"region_dashboard": region}
        )
        forest_features.extend(fc["features"])
    except Exception as exc:
        forest_errors[region] = str(exc)
        print("NO DISPONIBLE:", exc)

forest_fc = {"type": "FeatureCollection", "features": forest_features}

if forest_features:
    path = save_geojson("bosques.geojson", forest_fc)
    manifest["layers"]["bosques"].update({
        "available": True,
        "features": len(forest_features),
        "bytes": path.stat().st_size,
        "errors": forest_errors or None
    })
    print()
    print("OK:", path)
else:
    manifest["layers"]["bosques"]["error"] = (
        "No fue posible descargar ninguna región. " + json.dumps(forest_errors, ensure_ascii=False)
    )

manifest_path = OUT / "manifest.json"
manifest_path.write_text(
    json.dumps(manifest, indent=2, ensure_ascii=False),
    encoding="utf-8"
)

print()
print("="*80)
print("LISTO")
print("="*80)
print(manifest_path.resolve())
print()
for key, item in manifest["layers"].items():
    state = "DISPONIBLE" if item.get("available") else "NO DISPONIBLE"
    print(f"{item['label']}: {state}")
