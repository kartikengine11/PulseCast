import { NewSyncer } from '@/components/NewSyncer';
import { validateFullRoomId } from '@/lib/validators';
import React from 'react';

export default async function Page(props: {
  params: Promise<{ room_id: string }>; 
}) {
  const { room_id } = await props.params;
  if (!validateFullRoomId(room_id)) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-2">
      <div>
        Invalid room ID: <span className="font-bold">{room_id}</span>.
      </div>
        <div className="text-sm text-gray-500">
          Please enter a valid 6-digit numeric code.
        </div>
      </div>
    );
  }
  return <NewSyncer roomId={room_id} />;
}
