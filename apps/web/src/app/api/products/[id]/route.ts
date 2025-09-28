import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        neonSigns: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // For NEON_SIGN products, get price and image from neonSigns
    let price = 0;
    let imageUrl = null;
    if (product.category === "NEON_SIGN" && product.neonSigns.length > 0) {
      // Use the basePrice from the first neonSign
      price = product.neonSigns[0].basePrice;
      // Use the imageUrl from the first neonSign
      imageUrl = product.neonSigns[0].imageUrl;
    }

    // Return the product with the computed price and image
    const productWithPrice = {
      ...product,
      price: price,
      imageUrl: imageUrl, // Add imageUrl to the product object
    };

    return NextResponse.json({
      success: true,
      product: productWithPrice,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}