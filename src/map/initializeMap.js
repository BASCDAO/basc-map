export function initializeMap(mapboxgl, map) {
    map.on("click", "data", function (e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ["data"],
      });
      var clusterId = features[0].properties.cluster_id;
      map
        .getSource("basc.users")
        .getClusterExpansionZoom(clusterId, function (err, zoom) {
          if (err) return;
          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    });
  
    map.on("click", "unclustered-point", function (e) {
      var coordinates = e.features[0].geometry.coordinates.slice();
      var nam = e.features[0].properties.name;
      var twt = e.features[0].properties.twitter;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      new mapboxgl.Popup({ className: "card-popup" })
        .setLngLat(coordinates)
        .setHTML(
          "<p style='color:white; font-size:30px; text-align: center;'>"+nam+"</p>" + "<br><div class='image'><div class='overlay'><a style='outline: none;' href='https://twitter.com/"+twt+"' target='_blank'><img src='/twitter.png' class='pull-left'></a></div><img src="+e.features[0].properties.pfp+" class='rounded-corners'></div>"
          )
        .addTo(map);
    });
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );
  
    map.on("mouseenter", "data", function () {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "data", function () {
      map.getCanvas().style.cursor = "";
    });
  }