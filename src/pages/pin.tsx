import type { NextPage } from "next";
import Head from "next/head";
import { PinView } from "../views";

const Pin: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Create Pin</title>
        <meta
          name="description"
          content="Create marker for BASC holders"
        />
      </Head>
      <PinView />
    </div>
  );
};

export default Pin;
