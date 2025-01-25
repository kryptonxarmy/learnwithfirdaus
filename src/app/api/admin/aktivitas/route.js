// /api/admin/aktivitas/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get('classId');
  const semesterId = searchParams.get('semesterId');
  const academicYearId = searchParams.get('academicYearId');

  try {
    let coreActivities;
    if (classId || semesterId || academicYearId) {
      coreActivities = await prisma.coreActivity.findMany({
        where: {
          ...(classId && { classId: parseInt(classId) }),
          ...(semesterId && { class: { semesterId: parseInt(semesterId) } }),
          ...(academicYearId && { learningModule: { semester: { academicYearId: parseInt(academicYearId) } } }),
        },
        include: {
          class: true,
          learningModule: {
            include: {
              semester: {
                include: {
                  academicYear: true,
                },
              },
            },
          },
        },
      });
    } else {
      coreActivities = await prisma.coreActivity.findMany({
        include: {
          class: true,
          learningModule: {
            include: {
              semester: {
                include: {
                  academicYear: true,
                },
              },
            },
          },
        },
      });
    }
    return NextResponse.json({ success: true, coreActivities });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(req) {
  const { title, description, day, week, classId, learningModuleId, completed } = await req.json();

  try {
    const coreActivity = await prisma.coreActivity.create({
      data: {
        title,
        description,
        day,
        week,
        classId,
        learningModuleId,
        completed,
      },
    });
    return NextResponse.json({ success: true, coreActivity });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function PUT(req) {
  const { id, title, description, day, week, classId, learningModuleId, completed } = await req.json();

  try {
    const updatedCoreActivity = await prisma.coreActivity.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        day,
        week,
        classId,
        learningModuleId,
        completed,
      },
    });
    return NextResponse.json({ success: true, coreActivity: updatedCoreActivity });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}