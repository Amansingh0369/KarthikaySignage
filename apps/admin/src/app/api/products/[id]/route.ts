import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { 
      name, 
      description 
    } = body;

    const productId = params.id;

    // Update product
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
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

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error updating product status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product status" },
      { status: 500 }
    );
  }
}
