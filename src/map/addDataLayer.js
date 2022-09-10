export function addDataLayer(map, data) {
  if (!map.getSource("basc.users")) {
    map.addSource("basc.users", {
      type: "geojson",
      data: data,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
      clusterProperties: {
        sum: ["+", ["get", "event_count"]],
      },
    });
  } else {
    map.getSource("basc.users").setData(data);
  }

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "basc.users",
    filter: ["has", "point_count"],
    paint: {
      //"circle-color": "rgb(229, 36, 59)",
      "circle-color": "rgb(0, 0, 0)",
      //"circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      "circle-radius": ["step", ["get", "point_count"], 30, 100, 30, 750, 40],
      "circle-opacity": 0.75,
      "circle-stroke-width": 4,
      "circle-stroke-color": "#fff",
      "circle-stroke-opacity": 0.5,
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "basc.users",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{sum}",
      "text-font": ["Open Sans Bold"],
      //"text-size": 16,
      "text-size": 18,
    },
    paint: {
      "text-color": "white",
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "basc.users",
    filter: ["!", ["has", "point_count"]],
    paint: {
      //"circle-radius": ["step", ["get", "event_count"], 20, 100, 30, 750, 40],
      "circle-radius": ["step", ["get", "event_count"], 30, 100, 30, 750, 40],
      //"circle-color": "rgb(229, 36, 59)",
      "circle-color": "rgb(255, 255, 255)",
      "circle-opacity": 0.85,
      "circle-stroke-width": 4,
      "circle-stroke-color": "#fff",
      "circle-stroke-opacity": 0.5,
    },
  });

  map.addLayer({
    id: "event-count",
    type: "symbol",
    source: "basc.users",
    filter: ["!", ["has", "point_count"]],
    layout: {
      'icon-image': 'custom-marker',
      //"text-field": "{event_count}",
      //"text-field": "{event_count}",
      //"text-font": ["Open Sans Bold"],
      //"text-size": 16,
    },
    paint: {
      "text-color": "white",
    },
  });
}
