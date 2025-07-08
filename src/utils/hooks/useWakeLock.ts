import { useEffect } from "react";

export function useWakeLock(enabled : boolean){
    useEffect(()=>{
        let wakeLock : WakeLockSentinel | null = null;
        let dummyVideo : HTMLVideoElement | null = null;
        async function requestWakeLock(){
            try{
                if("wakeLock" in navigator){
                    wakeLock = await (navigator as any).wakeLock.request("screen");
                }
                else{
                    dummyVideo = document.createElement("video");
                    dummyVideo.src =
                        "data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAG1wNDFtcDQyaXNvbQ==";
                    dummyVideo.loop = true;
                    dummyVideo.muted = true;
                    dummyVideo.playsInline = true;
                    dummyVideo.style.display = "none";
                    document.body.appendChild(dummyVideo);
                    await dummyVideo.play();
                }
            } 
            catch(err){
                console.error("Wake lock failed:", err);
            }
        }
        if(enabled){
            requestWakeLock();
        }
        return () => {
      wakeLock?.release?.();
      wakeLock = null;

      if (dummyVideo) {
        dummyVideo.pause();
        dummyVideo.remove();
        dummyVideo = null;
      }
    };
  }, [enabled]);
}