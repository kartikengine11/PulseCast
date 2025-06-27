'use client'
import { Join } from "@/components/Join";
import { useGlobalStore } from "@/store/global";
import { useRoomStore } from "@/store/room";
import Image from "next/image";
import { useEffect } from "react";


export default function Home() {
  const resetGlobalStore = useGlobalStore((state) => state.resetStore);
  const resetRoomStore = useRoomStore((state) => state.reset);

  useEffect(() => {
    console.log("resetting stores");
    resetGlobalStore();
    resetRoomStore();
  }, [resetGlobalStore, resetRoomStore]);

  return <Join />;
}
