import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
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

export async function GET(request: NextRequest) {
  try {
    const neonSigns = await prisma.product.findMany({
      where: { category: "NEON_SIGN" },
      include: {
        neonSigns: true,
        _count: {
          select: {
            orderItems: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      neonSigns,
    });
  } catch (error) {
    console.error("Error fetching neon signs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch neon signs" },
      { status: 500 }
    );
  }
}
