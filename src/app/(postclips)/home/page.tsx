"use client";
import { FunctionComponent, useEffect, useState } from "react";
import { useAuth } from "@/Providers/SessionProvider";
const Home = () => {
  const { session, user, userRoles, loading } = useAuth();
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (await import("@/Components/(postclips)/home"))
          .default;
        setClient(() => newClient);
      }
    })();
  }, []);

  useEffect(() => {
    console.log({ session, user, userRoles, loading });
  }, [session, user, userRoles, loading]);

  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default Home;
