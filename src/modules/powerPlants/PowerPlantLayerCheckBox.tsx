import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { Feature } from "ol";
import { Point } from "ol/geom";
import React, { useState } from "react";

import { useLayer } from "../map/useLayer";

const powerPlantLayer = new VectorLayer({
  source: new VectorSource({
    url: "kraftverk.json",
    format: new GeoJSON(),
  }),
  style: powerPlantStyle,
});

interface powerPlantProperties {
  vannkraf_3: string;
}

type powerPlantFeature = {
  getProperties(): powerPlantProperties;
} & Feature<Point>;

function powerPlantStyle() {
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "white", width: 1 }),
      fill: new Fill({
        color: "blue",
      }),
      radius: 3,
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
