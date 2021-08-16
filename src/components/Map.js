import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

const Map = () => {
  const MapEl = useRef(null);

  useEffect(() => {
    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/widgets/Search",
      "esri/tasks/Locator",
    ]).then(([Map, MapView, FeatureLayer, Search, Locator]) => {
      const map = new Map({
        basemap: "dark-gray-vector",
      });

      const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-97, 38], // lon, lat
        scale: 10000000,
      });

      const featureLayerDistricts = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_117th_Congressional_Districts_all/FeatureServer/0",
        popupTemplate: {
          // autocasts as new PopupTemplate()
          title: "Congressional District {DISTRICTID} </br>{NAME}, ({PARTY})",
          overwriteActions: true,
        },
      });

      const featureLayerSenators = new FeatureLayer({
        url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/US_Senators_2020/FeatureServer/0",
        popupTemplate: {
          // autocasts as new PopupTemplate()
          title:
            "<a href={Web_Page} target='_blank'> {Name}</a>, ({Party}-{State}) ",
          overwriteActions: true,
        },
      });

      const searchWidget = new Search({
        view: view,
        allPlaceholder: "District or Senator",
        includeDefaultSources: false,
        sources: [
          {
            layer: featureLayerDistricts,
            searchFields: ["DISTRICTID"],
            displayField: "DISTRICTID",
            exactMatch: false,
            outFields: ["DISTRICTID", "NAME", "PARTY"],
            name: "Congressional Districts",
            placeholder: "example: 3708",
          },
          {
            layer: featureLayerSenators,
            searchFields: ["Name", "Party"],
            suggestionTemplate: "{Name}, Party: {Party}",
            exactMatch: false,
            outFields: ["*"],
            placeholder: "example: Casey",
            name: "Senators",
            zoomScale: 500000,
            resultSymbol: {
              type: "picture-marker", // autocasts as new PictureMarkerSymbol()
              url: "https://developers.arcgis.com/javascript/latest/sample-code/widgets-search-multiplesource/live/images/senate.png",
              height: 36,
              width: 36,
            },
          },
          {
            name: "ArcGIS World Geocoding Service",
            placeholder: "example: Nuuk, GRL",
            apiKey: "%YOUR_API_KEY%",
            singleLineFieldName: "SingleLine",
            locator: new Locator({
              url: "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer",
            }),
          },
        ],
      });

      // Add the search widget to the top left corner of the view
      view.ui.add(searchWidget, {
        position: "top-right",
      });
    });
  }, []);

  return (
    <>
      <div
        id="viewDiv"
        style={{ height: "100vh", width: "100vw" }}
        ref={MapEl}
      ></div>
    </>
  );
};

export default Map;
