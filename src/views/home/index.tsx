import Head from "next/head";
import { FC, useEffect, useState } from "react";
import useSWR from "swr";
import { addDataLayer } from "../../map/addDataLayer";
import { initializeMap } from "../../map/initializeMap";
import {FormPin} from "../../components/FormButton";
//import { fetcher } from "../../utils/fetcher";
import styles from "../../styles/Home.module.css";
import useWalletNFTs, { NFT } from "../../hooks/useWalletNFTs";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import "../../styles/Home.module.css";
import { WalletDisconnectedError } from "@solana/wallet-adapter-base";

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

  //const { data, error } = useSWR("/api/liveMusic", fetcher);
  //const fetcher2 = (...args) => fetch(...args).then((res) => res.json());
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

  if (publicKey) {
    if (walletNFTs === null) {
      console.log("No BASC");
    }
    if (walletNFTs !== null) {
      console.log(walletNFTs);
    }
  }

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PK;

  useEffect(() => {
    setPageIsMounted(true);

    let map = new mapboxgl.Map({
      container: "my-map",
      style: "mapbox://styles/exxempt/cl3klweqn001m14p0qfc9jpcr",
      //center: [-77.02, 38.887],
      latitude: 8.950357,
      longitude: -20.604661,
      position: "absolute",
      zoom: 2.22,
      //pitch: 45,
      /*maxBounds: [
        [-77.875588, 38.50705], // SouthWest coordinates
        [-76.15381, 39.548764], // NorthEast coordinates
      ],*/
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
      document.getElementById('info').innerHTML =
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
        <link rel="icon" href="/favicon.ico" />
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
      </main>
    </div>
  );
};
