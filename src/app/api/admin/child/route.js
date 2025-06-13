// /pages/api/parent/addChild.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const { parentId, name, studentId, phone, birthDate, gender, address, city, postalCode, country, classId, profilePhoto } = await req.json();

  try {
    const child = await prisma.child.create({
      data: {
        name,
        studentId,
        phone,
        birthDate: new Date(birthDate),
        gender,
        address,
        city,
        postalCode,
        country,
        parentId,
        classId,
        profilePhoto, // Add this line
      },
    });
    return NextResponse.json({ success: true, child });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function GET() {
  try {
    const children = await prisma.child.findMany({
      where: {
        isDeleted: false // Hanya ambil data yang belum dihapus
      },
      include: {
        parent: {
          include: {
            user: true
          }
        },
        class: true
      }
    });

    return NextResponse.json({ success: true, children });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function PUT(req) {
  const { id, parentId, name, studentId, phone, birthDate, gender, address, city, postalCode, country, classId, profilePhoto } = await req.json();

  try {
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (studentId !== undefined) updateData.studentId = studentId;
    if (phone !== undefined) updateData.phone = phone;
    if (birthDate !== undefined) updateData.birthDate = new Date(birthDate);
    if (gender !== undefined) updateData.gender = gender;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (postalCode !== undefined) updateData.postalCode = postalCode;
    if (country !== undefined) updateData.country = country;
    if (parentId !== undefined) updateData.parentId = parseInt(parentId);
    if (classId !== undefined) updateData.classId = parseInt(classId);
    if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;

    const updatedChild = await prisma.child.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({ success: true, child: updatedChild });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    await prisma.child.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}