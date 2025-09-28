import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const productId = params.id;

    // Convert feet to inches for storage
    const minWidth = parseFloat(minWidthFeet) * 12;
    const minHeight = parseFloat(minHeightFeet) * 12;

    // Update product
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
      },
    });

    // Update neon sign configuration
    await prisma.neonSign.updateMany({
      where: { productId },
      data: {
        minWidth,
        minHeight,
        basePrice: parseFloat(basePrice),
        discountType: discountType || null,
        discountValue: discountValue ? parseFloat(discountValue) : null,
        type: type || "DEFAULT", // Add the type field with default value
        imageUrl: imageUrl || null, // Add the imageUrl field
      },
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error updating neon sign:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update neon sign" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { isActive } = body;

    const productId = params.id;

    // Update product active status
    const product = await prisma.product.update({
      where: { id: productId },
      data: { isActive },
    });

    // Update neon sign active status
    await prisma.neonSign.updateMany({
      where: { productId },
      data: { isActive },
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error updating neon sign status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update neon sign status" },
      { status: 500 }
    );
  }
}