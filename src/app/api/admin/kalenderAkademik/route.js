// /pages/api/academicCalendar/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const { date, activity, description, completed } = await req.json();

  try {
    const academicCalendar = await prisma.academicCalendar.create({
      data: {
        date: new Date(date),
        activity,
        description,
        completed,
      },
    });
    return NextResponse.json({ success: true, academicCalendar });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function GET(req) {
  try {
    const academicCalendar = await prisma.academicCalendar.findMany();
    return NextResponse.json({ success: true, academicCalendar });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function PUT(req) {
  const { id, completed } = await req.json();

  try {
    const academicCalendar = await prisma.academicCalendar.update({
      where: { id: parseInt(id) },
      data: { completed },
    });
    return NextResponse.json({ success: true, academicCalendar });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    await prisma.academicCalendar.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}