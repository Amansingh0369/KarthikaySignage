import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configure the S3 client
const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadFileToS3(file: File, key: string): Promise<string> {
  try {
    console.log("S3 Upload - Starting upload process");
    console.log("Bucket:", process.env.S3_BUCKET_NAME);
    console.log("Region:", process.env.S3_REGION);
    console.log("File name:", file.name);
    console.log("File size:", file.size);
    console.log("File type:", file.type);
    
    // Check if required environment variables are set
    if (!process.env.S3_BUCKET_NAME) {
      throw new Error("S3_BUCKET_NAME environment variable is not set");
    }
    
    if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
      throw new Error("S3 credentials are not properly configured");
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log("S3 Upload - File converted to buffer");
    
    // Upload parameters
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME || "",
      Key: key,
      Body: buffer,
      ContentType: file.type,
    };

    console.log("S3 Upload - Upload parameters prepared");
    
    // Upload the file
    const command = new PutObjectCommand(uploadParams);
    console.log("S3 Upload - PutObjectCommand created");
    
    const result = await s3Client.send(command);
    console.log("S3 Upload - File uploaded successfully", result);
    
    // Return the public URL of the uploaded file using the correct S3 URL format
    // For AWS S3, the format is: https://bucket-name.s3.region.amazonaws.com/key
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
  } catch (error: any) {
    console.error("Error uploading file to S3:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    
    // Throw a more specific error message
    if (error.name === "CredentialsProviderError") {
      throw new Error("Invalid S3 credentials. Please check your AWS credentials.");
    } else if (error.name === "NoSuchBucket") {
      throw new Error(`S3 bucket '${process.env.S3_BUCKET_NAME}' not found.`);
    } else if (error.code === "Forbidden") {
      throw new Error("Access denied to S3 bucket. Please check your permissions.");
    } else if (error.code === "InvalidAccessKeyId") {
      throw new Error("Invalid AWS Access Key ID. Please check your credentials.");
    } else if (error.code === "SignatureDoesNotMatch") {
      throw new Error("Invalid AWS Secret Access Key. Please check your credentials.");
    }
    
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
}