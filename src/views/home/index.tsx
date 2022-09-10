import Head from "next/head";
import { FC, useEffect, useState, useCallback } from "react";
import useSWR from "swr";
import { addDataLayer } from "../../map/addDataLayer";
import { initializeMap } from "../../map/initializeMap";
import {FormPin} from "../../components/FormButton";
import useWalletNFTs, { NFT } from "../../hooks/useWalletNFTs";
import useStakedNFTs, { sNFT } from "../../hooks/useStakedNFTs";
import { useWallet } from "@solana/wallet-adapter-react";
import "../../styles/Home.module.css";

const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

export const HomeView: FC = ({}) => {
  const [pageIsMounted, setPageIsMounted] = useState(false);
  const [Map, setMap] = useState();

  const fetcher = async (
    input: RequestInfo,
    init: RequestInit,
    ...args: any[]
  ) => {
    const res = await fetch(input, init);
    return res.json();
  };

  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_API_KEY,
    fetcher
  );

  const allPoints = [];

  if (data) {
    var size = data.length;
    const initData = {
      type: "FeatureCollection",
      features: [],
    };
    for (var j = 0; j < size; j++) {
      var lat = parseFloat(data[j].country.latitude);
      var lon = parseFloat(data[j].country.longitude);
      var name = data[j].name;
      var twit = data[j].twitter;
      var disc = data[j].discord;
      var pfp = data[j].pfp;

      initData.features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lon, lat],
        },
        properties: {
          cluster: false,
          event_count: 1,
          name: name,
          twitter: twit,
          discord: disc,
          pfp: pfp,
        },
      });
      var check = allPoints.length;
      if (check === 0) {
        allPoints.push(initData);
      }
    }
  }
  console.log(allPoints);

  const { publicKey } = useWallet();
  const { walletNFTs } = useWalletNFTs();
  const { stakedNFTs } = useStakedNFTs();

  if (publicKey) {
    if (walletNFTs === null && stakedNFTs === null) {
      console.log("No BASC");
    }
    if (walletNFTs !== null || stakedNFTs !== null) {
      console.log(walletNFTs);
      console.log(stakedNFTs);
    }
  }
//process.env.NEXT_PUBLIC_MAPBOX_PK
  mapboxgl.accessToken = "pk.eyJ1Ijoid2FubmFkYyIsImEiOiJjazBja2M1ZzYwM2lnM2dvM3o1bmF1dmV6In0.50nuNnApjrJYkMfR2AUpXA";

  useEffect(() => {
    setPageIsMounted(true);

    let map = new mapboxgl.Map({
      container: "my-map",
      //style: "mapbox://styles/exxempt/cl3klweqn001m14p0qfc9jpcr", //Flat
      style: "mapbox://styles/exxempt/cl7wi59ps000414rz79tmykhj", //Globe
      center: [-57.02, 38.887],
      latitude: 33.950357,
      longitude: -45.604661,
      position: "absolute",
      zoom: 2.22,
      pitch: 20,
      maxZoom: 12,
      minZoom: 2.22,
    });

    // disable map rotation using right click + drag
    map.dragRotate.disable();
    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();
    initializeMap(mapboxgl, map);
    setMap(map);
 /*
    map.on('mousemove', (e) => {
      document.getElementById('pin').innerHTML =
      // `e.point` is the x, y coordinates of the `mousemove` event
      // relative to the top-left corner of the map.
      //JSON.stringify(e.point) +
      //'<br />' +
      // `e.lngLat` is the longitude, latitude geographical position of the event.
      JSON.stringify(e.lngLat.wrap());
      });
*/
  }, []);

  useEffect(() => {
    if (pageIsMounted && data) {

      Map.on("load", function () {
        Map.loadImage(
          "/apemarkerblk.png",
          (error, image) => {
            if (error) throw error;
            Map.addImage("custom-marker", image);
          }
        );
        addDataLayer(Map, allPoints[0]);
      });
    }
  }, [pageIsMounted, setMap, data, Map]);

  return (
    <div className="fixed flex-col h-full" >
      <Head>
        <title>BASC MAP</title>
        <link rel="icon" href="/favicon.png" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
        <main className="relative flex-col h-full">
        <pre id="info"></pre>
        <div id="my-map" style={{height: "100vh" , width: "100vw" }} />
        {walletNFTs !== null && walletNFTs.length > 0 &&
        <FormPin/>
        }
        {stakedNFTs !== null && stakedNFTs.length > 0 &&
        <FormPin/>
        }
      </main>
    </div>
  );
};
