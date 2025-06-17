import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    await prisma.$transaction(async (tx) => {
      // 1. Delete all progress details and their sub category details
      const progressDetails = await tx.progressDetail.findMany({
        where: { progressId: parseInt(id) }
      });

      for (const detail of progressDetails) {
        // Delete sub category details
        await tx.subCategoryDetail.deleteMany({
          where: { progressDetailId: detail.id }
        });
      }

      // 2. Delete all progress details
      await tx.progressDetail.deleteMany({
        where: { progressId: parseInt(id) }
      });

      // 3. Finally delete the progress
      await tx.progress.delete({
        where: { id: parseInt(id) }
      });
    });

    return NextResponse.json({ 
      success: true, 
      message: "Data berhasil dihapus permanen" 
    });

  } catch (error) {
    console.error("Error in permanent delete:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Gagal menghapus data secara permanen",
      error: error.message 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}