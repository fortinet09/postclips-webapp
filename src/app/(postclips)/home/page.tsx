"use client";
import { FunctionComponent, useEffect, useState } from "react";
import { useAuth } from "@/Hooks/auth/useAuth";
const Home = () => {
  const { session, user } = useAuth();
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
    console.log({ session, user });
  }, [session, user]);

  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default Home;
