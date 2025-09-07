import { NextResponse } from "next/server";
import {prisma} from "@repo/db"

export async function POST(req:Request) {
    try{
        const Payload = await req.json();
        console.log(Payload);
        
        const response = await prisma.admin.create({
            data: {
                email: Payload.email,
                name: Payload.name,
                role: Payload.role,
                access: Payload.access,
            }
        });
        
        console.log(response);
        
        return NextResponse.json({
            data: response,
            message: "Success",
            success: true
        });

    }catch(e){
        console.error('Error creating admin:', e);
        return NextResponse.json({
            message: "Error creating admin: " + (e instanceof Error ? e.message : String(e)),
            success: false,
            status: 400
        });
    }
}

// GET: Fetch all admin records
export async function GET(req: Request) {
  try {
    // Fetch all admin records from the database
    const admins = await prisma.admin.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Fetched admins:', JSON.stringify(admins, null, 2));

    return NextResponse.json({
      data: admins,
      message: "Admins fetched successfully",
      success: true,
    });
  } catch (e) {
    console.error('Error fetching admins:', e);
    return NextResponse.json({
      message: "Error fetching admins: " + (e instanceof Error ? e.message : String(e)),
      success: false,
      status: 400,
    });
  }
}

// PUT: Update an admin record (only role and access fields)
export async function PUT(req: Request) {
  try {
    const { id, role, access } = await req.json();
    
    // Validate required fields
    if (!id) {
      return NextResponse.json({
        message: "Admin ID is required",
        success: false,
        status: 400
      });
    }
    
    // Validate role if provided
    if (role && !['ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return NextResponse.json({
        message: "Invalid role value",
        success: false,
        status: 400
      });
    }
    
    // Update the admin record
    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(access && { access })
      }
    });
    
    return NextResponse.json({
      data: updatedAdmin,
      message: "Admin updated successfully",
      success: true
    });
    
  } catch (e) {
    console.error('Error updating admin:', e);
    return NextResponse.json({
      message: "Error updating admin: " + (e instanceof Error ? e.message : String(e)),
      success: false,
      status: 400
    });
  }
}

// DELETE: Delete an admin record
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    // Validate ID
    if (!id) {
      return NextResponse.json({
        message: "Admin ID is required",
        success: false,
        status: 400
      });
    }
    
    // Delete the admin record
    await prisma.admin.delete({
      where: { id }
    });
    
    return NextResponse.json({
      message: "Admin deleted successfully",
      success: true
    });
    
  } catch (e) {
    console.error('Error deleting admin:', e);
    return NextResponse.json({
      message: "Error deleting admin: " + (e instanceof Error ? e.message : String(e)),
      success: false,
      status: 400
    });
  }
}