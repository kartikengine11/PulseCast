import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
}

export async function POST(req: NextRequest) {
  // console.log("inside post request");
  try {
    const formData = await req.formData();
    // console.log("formData: ",formData);
    const file = formData.get("file") as File | null;
    const room = formData.get("room_id") as string | null;

    if (!file || !room) {
      return NextResponse.json({ error: "Missing file or room_id" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      // console.log("uploaded file on cloudinary: ",result);
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `pulseCast/${room}`,
          resource_type: "video",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as CloudinaryUploadResult);
          }
        }
      );
      uploadStream.end(buffer);
    });
    
    const url = result.secure_url;
    // Notify server that upload completed successfully
    // console.log("from frontend : ",
    //   result.secure_url," :: ",
    //   file.name," ::: ",
    //   room
    // )
    // console.log("urls: ",`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-complete`)
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-complete`,{
        publicUrl: url,
        originalName: file.name,
        roomId : room
    })
    return NextResponse.json(
      {
        publicId: result.public_id,
        url: result.secure_url,
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
