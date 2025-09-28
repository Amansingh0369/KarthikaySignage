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

    // Map products to include price from neonSigns
    const productsWithPrice = products.map(product => {
      // For NEON_SIGN products, get price from neonSigns
      let price = 0;
      if (product.category === "NEON_SIGN" && product.neonSigns.length > 0) {
        // Use the basePrice from the first neonSign (you might want to adjust this logic)
        price = product.neonSigns[0].basePrice;
      }
      
      return {
        ...product,
        price: price || 0, // Default to 0 if no price found
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