"use client";
import { FunctionComponent, useEffect, useState } from "react";
import { useAuth } from "@/Providers/SessionProvider";
import HomeDashboard from "@/Components/(postclips)/home";

const Home = () => {
  // const { session, user, userRoles, loading } = useAuth();
  // const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  // useEffect(() => {
  //   (async () => {
  //     if (typeof window !== "undefined") {
  //       const newClient = (await import("@/Components/(postclips)/home"))
  //         .default;
  //       setClient(() => newClient);
  //     }
  //   })();
  // }, []);

  // useEffect(() => {
  //   console.log({ session, user, userRoles, loading });
  // }, [session, user, userRoles, loading]);

  // return MyAwesomeMap ? <MyAwesomeMap /> : "";

  return <HomeDashboard />;
};

export default Home;
