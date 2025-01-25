// /pages/api/class/addClass.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { name, ageGroup, semesterId } = await req.json();

  try {
    const newClass = await prisma.class.create({
      data: {
        name,
        ageGroup,
        semesterId: parseInt(semesterId),
      },
    });
    return NextResponse.json({ success: true, class: newClass });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function GET(req) {
  try {
    const classes = await prisma.class.findMany();
    return NextResponse.json({ success: true, classes });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function PUT(req) {
  const { id, name, ageGroup, semesterId } = await req.json();

  try {
    const updatedClass = await prisma.class.update({
      where: { id: parseInt(id) },
      data: {
        name,
        ageGroup,
        semesterId: parseInt(semesterId),
      },
    });
    return NextResponse.json({ success: true, class: updatedClass });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    await prisma.class.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}