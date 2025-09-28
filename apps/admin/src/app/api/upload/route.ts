import { NextRequest, NextResponse } from "next/server";
import { uploadFileToS3 } from "../../lib/s3-upload";

export async function POST(request: NextRequest) {
  try {
    console.log("Upload API - Received upload request");
    
    // Get the file from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log("Upload API - No file provided");
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    console.log("Upload API - File received:", {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Generate a unique key for the file
    const fileName = `neon-signs/${Date.now()}-${file.name}`;
    console.log("Upload API - Generated file name:", fileName);
    
    // Upload the file to S3
    console.log("Upload API - Starting S3 upload");
    const imageUrl = await uploadFileToS3(file, fileName);
    console.log("Upload API - S3 upload completed, URL:", imageUrl);
    
    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error: any) {
    console.error("Upload API - Error uploading file:", error);
    console.error("Upload API - Error details:", {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to upload file",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}