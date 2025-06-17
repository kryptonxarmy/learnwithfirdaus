// /pages/api/progress/index.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const childId = searchParams.get("childId");

  const whereClause = {
    isDeleted: false, // Tambahkan ini
    ...(childId && { childId: parseInt(childId) }),
  };

  try {
    const progress = await prisma.progress.findMany({
      where: whereClause,
      include: {
        child: true,
        semester: true,
        academicYear: true,
      },
    });
    return NextResponse.json({ success: true, progress });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(req) {
  const { date, moralValue, motorGross, motorFine, cognitive, language, social, reflection, comments, childId, semesterId, academicYearId } = await req.json();

  try {
    // Periksa apakah childId ada di tabel Child
    const childExists = await prisma.child.findUnique({
      where: { id: parseInt(childId) },
    });

    if (!childExists) {
      return NextResponse.json({ success: false, error: 'Child ID does not exist' });
    }

    const progress = await prisma.progress.create({
      data: {
        date: new Date(date),
        moralValue,
        motorGross,
        motorFine,
        cognitive,
        language,
        social,
        reflection,
        comments,
        childId: parseInt(childId),
        semesterId: parseInt(semesterId),
        academicYearId: parseInt(academicYearId),
      },
    });
    return NextResponse.json({ success: true, progress });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function PUT(req) {
  const { id, date, moralValue, motorGross, motorFine, cognitive, language, social, reflection, comments, childId, semesterId, academicYearId } = await req.json();

  try {
    // Periksa apakah progress dengan ID yang diberikan ada
    const progressExists = await prisma.progress.findUnique({
      where: { id: parseInt(id) },
    });

    if (!progressExists) {
      return NextResponse.json({ success: false, error: 'Progress ID does not exist' });
    }

    const progress = await prisma.progress.update({
      where: { id: parseInt(id) },
      data: {
        date: new Date(date),
        moralValue,
        motorGross,
        motorFine,
        cognitive,
        language,
        social,
        reflection,
        comments,
        childId: parseInt(childId),
        semesterId: parseInt(semesterId),
        academicYearId: parseInt(academicYearId),
      },
    });
    return NextResponse.json({ success: true, progress });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    await prisma.progress.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}