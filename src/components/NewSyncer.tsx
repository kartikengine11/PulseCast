"use client";
import { generateName } from "@/lib/randomNames";
import { useRoomStore } from "@/store/room";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Dashboard } from "./Dashboard";
import WebSocketManager from "./WebSocketManager";
import { SpatialAudioBackground } from "./SpatialAudioBackground";
// import { WebSocketManager } from "./room/WebSocketManager";

export const NewSyncer = ({roomId} : {roomId:string}) => {
  const setUsername = useRoomStore((state) => state.setUsername);
  const setRoomId = useRoomStore((state) => state.setRoomId);
  const username = useRoomStore((state) => state.username);

  useEffect(() => {
    setRoomId(roomId);
    if (!username) {
      setUsername(generateName());
    }
  }, [setUsername, username, roomId, setRoomId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* WebSocket connection manager (non-visual component) */}
      <WebSocketManager roomId={roomId} username={username} />

      {/* Spatial audio background effects */}
      {/* <SpatialAudioBackground /> */}

      <Dashboard roomId={roomId} />
    </motion.div>
  );
};