import { WSRequestType } from "../app/kartik";

export const sendWSRequest = ({
  ws,
  request,
}: {
  ws: WebSocket;
  request: WSRequestType;
}) => {
  ws.send(JSON.stringify(request));
};
