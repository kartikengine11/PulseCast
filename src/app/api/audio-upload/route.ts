import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

const bufferToStream = (buffer: Buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

export async function POST(req: Request) {
  try {
    const { fileBase64, roomId } = await req.json();

    if (!fileBase64 || !roomId) {
      return new Response(JSON.stringify({ error: 'Missing file or roomId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const buffer = Buffer.from(fileBase64.split(',')[1], 'base64');

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `pulseCast/${roomId}`,
          resource_type: 'video',
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      bufferToStream(buffer).pipe(uploadStream);
    });
    const url = (result as any).secure_url;
    return new Response(JSON.stringify({ 
      url
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
