import Head from "next/head";
import MapAndLocations from "@/component/MapContianer";
import GoogleMapAndLocations from "@/component/GoogleMapContainer";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Location Mapper</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Location Mapper</h1>
        {/* <MapAndLocations /> */}
        <GoogleMapAndLocations />
      </main>
    </div>
  );
}
