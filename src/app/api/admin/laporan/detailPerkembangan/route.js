// /src/app/admin/laporan/detailPerkembangan/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const childId = searchParams.get('childId');
  console.log("GET API - Received childId:", childId); // Tambahkan ini

  if (!childId) {
    return NextResponse.json({
      success: false,
      message: 'childId is required'
    });
  }

  try {
    const progress = await prisma.progress.findFirst({
      where: {
        childId: parseInt(childId)
      },
    });
    console.log("GET API - Found Progress for childId:", progress); // Tambahkan ini

    if (!progress) {
      return NextResponse.json({
        success: false,
        message: 'No progress found',
        progressDetails: []
      });
    }

    const progressDetails = await prisma.progressDetail.findMany({
      where: {
        progressId: progress.id
      },
      include: {
        subDetails: true,
      },
      orderBy: {
        id: 'asc'
      }
    });
    console.log("GET API - Fetched Progress Details:", progressDetails); // Tambahkan ini

    return NextResponse.json({
      success: true,
      progressDetails: progressDetails
    });

  } catch (error) {
    console.error('Error in GET API:', error); // Ubah pesan error
    return NextResponse.json({
      success: false,
      message: error.message,
      progressDetails: []
    });
  }
}

export async function POST(req) {
  const { category, progressId, subDetails } = await req.json();
  console.log("POST API - Received Payload:", { category, progressId, subDetails }); // Tambahkan ini

  try {
    const progress = await prisma.progress.findUnique({
      where: { id: parseInt(progressId) },
    });

    if (!progress) {
      console.error("POST API - Progress ID does not exist:", progressId); // Tambahkan ini
      return NextResponse.json({ success: false, error: "Progress ID does not exist" });
    }

    const progressDetail = await prisma.progressDetail.create({
      data: {
        category,
        progressId: parseInt(progressId),
        subDetails: {
          create: subDetails.map(detail => ({
            subCategory: detail.subCategory,
            status: detail.status,
          })),
        },
      },
    });
    console.log("POST API - Created ProgressDetail:", progressDetail); // Tambahkan ini
    return NextResponse.json({ success: true, progressDetail });
  } catch (error) {
    console.error("Error in POST API:", error); // Ubah pesan error
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function PUT(req) {
  const { id, category, subDetails } = await req.json();

  try {
    // Update ProgressDetail
    const progressDetail = await prisma.progressDetail.update({
      where: { id: parseInt(id) },
      data: {
        category,
      },
    });

    // Delete existing subDetails
    await prisma.subCategoryDetail.deleteMany({
      where: { progressDetailId: parseInt(id) },
    });

    // Create new subDetails
    await prisma.subCategoryDetail.createMany({
      data: subDetails.map(detail => ({
        progressDetailId: parseInt(id),
        subCategory: detail.subCategory,
        status: detail.status,
      })),
    });

    return NextResponse.json({ success: true, progressDetail });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    // Delete subDetails first
    await prisma.subCategoryDetail.deleteMany({
      where: { progressDetailId: parseInt(id) },
    });

    // Delete progressDetail
    await prisma.progressDetail.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
