import { Socket } from "socket.io-client";
import { WSRequestType } from "../app/kartik"; // Adjust path as needed

export const sendWSRequest = ({
  socket,
  request,
}: {
  socket: Socket;
  request: WSRequestType;
}) => {
  socket.emit("message", request); 
};
