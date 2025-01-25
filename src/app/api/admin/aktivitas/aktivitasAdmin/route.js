// api/admin/aktivitas/aktivitasAdmin/route.js

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");
  const learningModuleId = searchParams.get("learningModuleId");

  try {
    let coreActivities;
    if (classId && learningModuleId) {
      coreActivities = await prisma.coreActivity.findMany({
        where: {
          classId: parseInt(classId),
          learningModuleId: parseInt(learningModuleId),
        },
        include: {
          class: true,
          learningModule: true,
        },
      });
    } else if (classId) {
      coreActivities = await prisma.coreActivity.findMany({
        where: { classId: parseInt(classId) },
        include: {
          class: true,
          learningModule: true,
        },
      });
    } else if (learningModuleId) {
      coreActivities = await prisma.coreActivity.findMany({
        where: { learningModuleId: parseInt(learningModuleId) },
        include: {
          class: true,
          learningModule: true,
        },
      });
    } else {
      coreActivities = await prisma.coreActivity.findMany({
        include: {
          class: true,
          learningModule: true,
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

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    await prisma.coreActivity.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
