import { v2 as cloudinary } from 'cloudinary';
import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});


const bufferToStream = (buffer: Buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileBase64, roomId } = req.body;

    if (!fileBase64 || !roomId) {
      return res.status(400).json({ error: 'Missing file or roomId' });
    }

    const buffer = Buffer.from(fileBase64.split(',')[1], 'base64');

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `pulseCast/${roomId}`,
          resource_type: 'auto',
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      bufferToStream(buffer).pipe(uploadStream);
    });

    return res.status(200).json({ url: (result as any).secure_url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
