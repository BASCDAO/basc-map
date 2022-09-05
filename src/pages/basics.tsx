import type { NextPage } from "next";
import Head from "next/head";
import { BasicsView } from "../views";

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Create Marker</title>
        <meta
          name="description"
          content="Create marker for BASC holders"
        />
      </Head>
      <BasicsView />
    </div>
  );
};

export default Basics;
