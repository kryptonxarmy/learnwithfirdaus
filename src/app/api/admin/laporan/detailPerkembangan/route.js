// /pages/api/progressDetail/index.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const childId = searchParams.get('childId');

  if (!childId) {
    return NextResponse.json({ 
      success: false, 
      message: 'childId is required' 
    });
  }

  try {
    // Get progress by childId
    const progress = await prisma.progress.findFirst({
      where: { 
        childId: parseInt(childId) 
      },
    });

    if (!progress) {
      return NextResponse.json({ 
        success: false, 
        message: 'No progress found',
        progressDetails: [] 
      });
    }

    // Get progressDetails with related data
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

    // Pastikan response menggunakan format yang konsisten
    return NextResponse.json({
      success: true,
      progressDetails: progressDetails // Ubah nama property ini
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message,
      progressDetails: [] 
    });
  }
}

export async function POST(req) {
  const { category, progressId, subDetails } = await req.json();

  try {
    // Check if the progressId exists
    const progress = await prisma.progress.findUnique({
      where: { id: parseInt(progressId) },
    });

    if (!progress) {
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
    return NextResponse.json({ success: true, progressDetail });
  } catch (error) {
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