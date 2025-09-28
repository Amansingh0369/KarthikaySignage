import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  // Check if the request is for file upload by examining the content type
  const contentType = request.headers.get('content-type') || '';
  
  if (contentType.includes('multipart/form-data')) {
    // Handle multipart form data for file uploads
    // For now, we'll keep the existing implementation for JSON data
    // In a real implementation, you would parse the multipart data here
    // This is where you would integrate with formidable or similar library
  }
  
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      type, // Add the type field
      imageUrl, // Add the imageUrl field
      minWidthFeet, 
      minHeightFeet, 
      basePrice, 
      discountType, 
      discountValue 
    } = body;

    // Convert feet to inches for storage
    const minWidth = parseFloat(minWidthFeet) * 12;
    const minHeight = parseFloat(minHeightFeet) * 12;

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        category: "NEON_SIGN",
        isActive: true,
      },
    });

    // Create neon sign configuration
    const neonSign = await prisma.neonSign.create({
      data: {
        productId: product.id,
        minWidth,
        minHeight,
        basePrice: parseFloat(basePrice),
        discountType: discountType || null,
        discountValue: discountValue ? parseFloat(discountValue) : null,
        type: type || "DEFAULT", // Add the type field with default value
        imageUrl: imageUrl || null, // Add the imageUrl field
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      product,
      neonSign,
    });
  } catch (error) {
    console.error("Error creating neon sign:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create neon sign" },
      { status: 500 }
    );
  }
}

// ... existing GET function ...