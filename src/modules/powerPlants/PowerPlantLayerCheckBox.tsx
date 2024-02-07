import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { Feature } from "ol";
import { Point } from "ol/geom";
import React, { useState } from "react";

import { useLayer } from "../map/useLayer";
import { FeatureLike } from "ol/Feature";

const powerPlantLayer = new VectorLayer({
  className: "kraftverk",
  source: new VectorSource({
    url: "kraftverk.json",
    format: new GeoJSON(),
  }),
  style: powerPlantStyle,
});

interface powerPlantProperties {
  vannkraf_2: string;
  vannkraf_3: string;
  maksytelse: number;
}

type powerPlantFeature = {
  getProperties(): powerPlantProperties;
} & Feature<Point>;

function powerPlantStyle(f: FeatureLike) {
  const feature = f as powerPlantFeature;
  const powerPlant = feature.getProperties();
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "white", width: 1 }),
      fill: new Fill({
        color: powerPlant.vannkraf_2 === "Mini" ? "red" : "blue",
      }),
      radius: 3 + powerPlant.maksytelse * 4,
    }),
  });
}

export function PowerPlantLayerCheckBox() {
  const [checked, setChecked] = useState(true);

  useLayer(powerPlantLayer, checked);

  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Show power plants
        {checked ? "Hide" : "Show"} kraftverk
      </label>
    </div>
  );
}
