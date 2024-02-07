import React, { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "../map/mapContext";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";

type powerPlantVectorLayer = VectorLayer<VectorSource<powerPlantFeature>>;

interface powerPlantProperties {
  vannkraf_2: string;
  vannkraf_3: string;
  maksytelse: number;
}

type powerPlantFeature = {
  getProperties(): powerPlantProperties;
} & Feature;

function usePowerPlantFeatures() {
  const { map, layers } = useContext(MapContext);
  const layer = layers.find(
    (l) => l.getClassName() === "kraftverk",
  ) as powerPlantVectorLayer;
  const [features, setFeatures] = useState<powerPlantFeature[]>();
  const [viewExtent, setViewExtent] = useState(
    map.getView().getViewStateAndExtent().extent,
  );
  const visibleFeatures = useMemo(
    () =>
      features?.filter((f) => f.getGeometry()?.intersectsExtent(viewExtent)),
    [features, viewExtent],
  );

  function handleSourceChange() {
    setFeatures(layer?.getSource()?.getFeatures());
  }

  function handleViewChange() {
    setViewExtent(map.getView().getViewStateAndExtent().extent);
  }

  useEffect(() => {
    layer?.getSource()?.on("change", handleSourceChange);
    return () => layer?.getSource()?.un("change", handleSourceChange);
  }, [layer]);

  useEffect(() => {
    map.getView().on("change", handleViewChange);
    return () => map.getView().un("change", handleViewChange);
  }, [map]);

  return { powerPlantLayer: layer, features, visibleFeatures };
}

export function PowerPlantAside() {
  const { visibleFeatures } = usePowerPlantFeatures();

  return (
    <aside className={visibleFeatures?.length ? "visible" : "hidden"}>
      <div>
        <h2>Kraftverk</h2>
        <ul>
          {visibleFeatures?.map((k) => <li>{k.getProperties().vannkraf_3}</li>)}
        </ul>
      </div>
    </aside>
  );
}
