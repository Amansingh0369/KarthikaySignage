import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const whereClause = category ? { category: category as any } : {};

    const products = await prisma.product.findMany({
      where: whereClause,
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

    // Map products to include price and image from neonSigns
    const productsWithPrice = products.map(product => {
      // For NEON_SIGN products, get price and image from neonSigns
      let price = 0;
      let imageUrl = null;
      if (product.category === "NEON_SIGN" && product.neonSigns.length > 0) {
        // Use the basePrice from the first neonSign
        price = product.neonSigns[0].basePrice;
        // Use the imageUrl from the first neonSign
        imageUrl = product.neonSigns[0].imageUrl;
      }
      
      return {
        ...product,
        price: price || 0, // Default to 0 if no price found
        imageUrl: imageUrl, // Add imageUrl to the product object
      };
    });

    return NextResponse.json({
      success: true,
      products: productsWithPrice,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}