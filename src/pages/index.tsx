import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>BASC MAP</title>
        <meta
          name="description"
          content="BASC MAP"
          />
<meta property='og:site_name' content='https://map.bascdao.net' />
<meta property='og:url' content='https://map.bascdao.net' />
<meta property='og:type' content='website' />
<meta property='og:image' content='/thumbnail.png' />	

      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
