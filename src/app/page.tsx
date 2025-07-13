'use client'
import { Join } from "@/components/Join";
import { fetchAudio } from "@/lib/utils";
import { useGlobalStore } from "@/store/global";
import { useRoomStore } from "@/store/room";
import { useEffect } from "react";
import SocketAudioPlayer from "./SocketAudioPlayer";
import VisualizerCanvas from "@/components/VisualizerCanvas";

export default async function Home() {

  const resetGlobalStore = useGlobalStore((state) => state.resetStore);
  const resetRoomStore = useRoomStore((state) => state.reset);

  useEffect(() => {
      // console.log("resetting stores");
      resetGlobalStore();
      resetRoomStore();
    }, [resetGlobalStore, resetRoomStore]);

    const handlePlay = async () => {
      // fetchAudio({
      //   public_id:"so26h4ndly0r0pjqjxsk",
      //   room_id:'123456'
      // }).then((audis)=>{
      //   console.log("audis came: ",audis)
      //   if (!audis) return;

      //   const url = URL.createObjectURL(audis);
      //   const audio = new Audio(url);
      //   audio.play().catch(console.warn);
      // })
    };
    return(
      <div>  
        <Join />
        {/* <Check />
        <SocketAudioPlayer /> */}
        <h1>PulseCast 🎧</h1>
        <button onClick={handlePlay}>Play Audio</button>
    </div>
    )
}
