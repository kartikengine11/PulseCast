"use client"
import { io, Socket } from 'socket.io-client';
import { WSResponseSchema, epochNow, NTPResponseMessageType } from '../app/kartik';
import { fetchAudio } from '@/lib/utils';
import { trimFileName } from '@/lib/utils';
import { RawAudioSource } from '@/lib/localtypes';
import { useEffect } from 'react';
import { useRoomStore } from '@/store/room';
import { useGlobalStore } from '@/store/global';
import { toast } from 'sonner';

interface NTPMeasurement {
  t0: number;
  t1: number;
  t2: number;
  t3: number;
  roundTripDelay: number;
  clockOffset: number;
}

// Helper function for NTP response handling
const handleNTPResponse = (response: NTPResponseMessageType) => {
  const t3 = epochNow();
  const { t0, t1, t2 } = response;

  // Calculate round-trip delay and clock offset
  // See: https://en.wikipedia.org/wiki/Network_Time_Protocol#Clock_synchronization_algorithm
  const clockOffset = (t1 - t0 + (t2 - t3)) / 2;
  const roundTripDelay = t3 - t0 - (t2 - t1);

  const measurement: NTPMeasurement = {
    t0,
    t1,
    t2,
    t3,
    roundTripDelay,
    clockOffset,
  };

  return measurement;
};

interface WebSocketManagerProps {
  roomId: string;
  username: string;
}

const WebSocketManager = ({ roomId, username }: WebSocketManagerProps) => {
    const isLoadingRoom = useRoomStore((state) => state.isLoadingRoom);
    const socket = useGlobalStore((state) => state.socket);
    const setConnectedClients = useGlobalStore((state) => state.setConnectedClients);
    const hasDownloadedAudio = useGlobalStore((state) => state.hasDownloadedAudio);
    const addAudioSource = useGlobalStore((state) => state.addAudioSource);
    const schedulePlay = useGlobalStore((state) => state.schedulePlay);
    const schedulePause = useGlobalStore((state) => state.schedulePause);
    const setSocket = useGlobalStore((state) => state.setSocket);
    const setUserId = useRoomStore((state) => state.setUserId);
    const sendNTPRequest = useGlobalStore((state) => state.sendNTPRequest);
    const addNTPMeasurement = useGlobalStore((state) => state.addNTPMeasurement);
    const processSpatialConfig = useGlobalStore((state)=>state.processSpatialConfig);
    const isSpatialAudioEnabled = useGlobalStore((state)=>state.isSpatialAudioEnabled);
    const setIsSpatialAudioEnabled = useGlobalStore((state)=>state.setIsSpatialAudioEnabled);
    const processStopSpatialAudio = useGlobalStore((state)=>state.processStopSpatialAudio);
    const isSynced = useGlobalStore((state)=>state.isSynced);
    useEffect(()=>{
        if (
            isLoadingRoom || 
            !roomId || !username) return;
            console.log(`📡 Connecting to WebSocket for ${roomId} / ${username}`);
        // Don't create a new connection if we already have one
        if(socket){
            return;
        }
        const newSocket: Socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
          query: { roomId, username },
        });
        setSocket(newSocket);
        newSocket.on('connect',()=>{
            console.log('Connected to the server');
            // start sync
            sendNTPRequest();

        })
        newSocket.on('disconnect',()=>{
            console.log('Disconnected to the server');
            
        })
        newSocket.on('message',async (data)=>{
            const response = WSResponseSchema.parse(data);
            console.log('Received message from server',response);
            if(response.type === "NTP_RESPONSE"){
                const ntpMeasurement = handleNTPResponse(data);
                addNTPMeasurement(ntpMeasurement);
                // Check that we have not exceeded the max and then send another NTP request
                setTimeout(() => {
                    sendNTPRequest();
                }, 30); // 30ms delay to not overload
            }
            else if (response.type === "ROOM_EVENT"){
                const { event } = response;
                console.log("Room event:", event);
                if(event.type === "CLIENT_CHANGE"){
                    setConnectedClients(event.clients);
                } 
                else if (event?.type === "NEW_AUDIO_SOURCE") {
                    console.log("Received new audio source:", event);
                    const title = event?.title;
                    const id = event?.id;
                    if (!title || !id) {
                        console.warn("Missing title or id in NEW_AUDIO_SOURCE event");
                        return;
                    }
                    if (hasDownloadedAudio(id)) {
                        console.log(`Audio file ${id} already downloaded, skipping fetch`);
                        return;
                    }
                    toast.promise(
                        fetchAudio(id)
                        .then(async (blob) => {
                            console.log("Audio fetched successfully:", id);
                            try {
                                if(!blob) {
                                    console.log("blob is null");
                                    return;
                                }
    
                            const arrayBuffer = await blob.arrayBuffer();
                            console.log("ArrayBuffer created successfully");

                            const audioSource: RawAudioSource = {
                                name: trimFileName(title),
                                audioBuffer: arrayBuffer,
                                id,
                            };

                            return addAudioSource(audioSource);
                            } catch (error) {
                            console.error("Error processing audio data:", error);
                            throw new Error("Failed to process audio data");
                            }
                        })
                        .catch((error) => {
                            console.error("Error fetching audio:", error);
                            throw error;
                        }),
                        {
                        loading: "Loading audio...",
                        success: `Added: ${title}`,
                        error: "Failed to load audio",
                        }
                    );
                }
            }
            else if (response.type === "SCHEDULED_ACTION") {
                console.log("Received scheduled action:", response);
                const {scheduledAction,serverTimeToExecute} = response;
                if(scheduledAction.type === "PLAY") {
                    schedulePlay({
                    trackTimeSeconds: scheduledAction.trackTimeSeconds,
                    targetServerTime: serverTimeToExecute,
                    audioId: scheduledAction.audioId,
                    });
                } 
                else if(scheduledAction.type === "PAUSE") {
                    schedulePause({
                        targetServerTime: serverTimeToExecute,
                    });
                } 
                else if(scheduledAction.type === "SPATIAL_CONFIG") {
                    processSpatialConfig(scheduledAction);
                    if (!isSpatialAudioEnabled) {
                        setIsSpatialAudioEnabled(true);
                    }
                } 
                else if(scheduledAction.type === "STOP_SPATIAL_AUDIO") {
                    processStopSpatialAudio();
                }
            }
            else if(response.type === "SET_CLIENT_ID"){
                setUserId(response.clientId);
            }

            else{
                console.error("Unknown response type:", response);
            }
        })
        return ()=>{
            console.log("🔌 Cleaning up Socket.IO connection");
            newSocket.disconnect();
        }

    },[isLoadingRoom,roomId,username])
    return null;
}
export default WebSocketManager;
