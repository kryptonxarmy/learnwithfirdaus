"use client";

import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TrashPage() {
  const { id } = useParams();
  const [deletedProgress, setDeletedProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProgressId, setSelectedProgressId] = useState(null);

  const fetchDeletedProgress = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/admin/laporan/laporanPerkembangan/trash");
      const data = await res.json();
      
      if (data.success) {
        // Filter untuk hanya menampilkan data progress anak yang sesuai
        const filteredProgress = data.progress.filter(item => item.childId === parseInt(id));
        setDeletedProgress(filteredProgress);
      } else {
        setError(data.error || "Failed to fetch data");
      }
    } catch (error) {
      setError("An error occurred while fetching data");
      console.error("Error fetching deleted progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedProgress();
  }, [id]);

  const handleRestore = async (id) => {
    try {
      // Restore progress details first
      await fetch(`/api/admin/laporan/detailPerkembangan/restore`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progressId: id }),
      });

      // Then restore the progress
      const res = await fetch(`/api/admin/laporan/laporanPerkembangan/restore`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        fetchDeletedProgress();
        setIsRestoreDialogOpen(false);
        alert("Data perkembangan berhasil dipulihkan");
      }
    } catch (error) {
      console.error("Error restoring:", error);
      alert("Gagal memulihkan data");
    }
  };

  const handlePermanentDelete = async (progressId) => {
    try {
      const res = await fetch(`/api/admin/laporan/laporanPerkembangan/permanentDelete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id: parseInt(progressId) 
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete progress permanently");
      }

      await fetchDeletedProgress(); // Refresh data after deletion
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete progress:", error);
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sampah - Laporan Perkembangan</h1>
          <Link href={`/laporan/detail/${id}`}>
            <Button className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4">
              KEMBALI
            </Button>
          </Link>
        </div>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sampah - Laporan Perkembangan</h1>
        <Link href={`/laporan/detail/${id}`}>
          <Button className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4">
            KEMBALI
          </Button>
        </Link>
      </div>

      {deletedProgress.length === 0 ? (
        <div className="text-center py-8">
          <p>Tidak ada data perkembangan yang dihapus</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nama Anak</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Tahun Ajaran</TableHead>
              <TableHead>Tanggal Dihapus</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deletedProgress.map((progress) => (
              <TableRow key={progress.id}>
                <TableCell>{new Date(progress.date).toLocaleDateString()}</TableCell>
                <TableCell>{progress.child?.name || 'N/A'}</TableCell>
                <TableCell>{progress.semester?.number || 'N/A'}</TableCell>
                <TableCell>{progress.academicYear?.year || 'N/A'}</TableCell>
                <TableCell>{progress.deletedAt ? new Date(progress.deletedAt).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    onClick={() => {
                      setSelectedProgressId(progress.id);
                      setIsRestoreDialogOpen(true);
                    }}
                    className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4"
                  >
                    Pulihkan
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedProgressId(progress.id);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl px-4"
                  >
                    Hapus Permanen
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Pemulihan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin memulihkan data perkembangan ini?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setIsRestoreDialogOpen(false)}
              variant="outline"
              className="hover:bg-gray-200 font-semibold rounded-xl px-4"
            >
              Batal
            </Button>
            <Button
              onClick={() => handleRestore(selectedProgressId)}
              className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4"
            >
              Pulihkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Permanen</DialogTitle>
            <DialogDescription>
              Data yang dihapus tidak dapat dipulihkan kembali. Lanjutkan?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outline"
              className="hover:bg-gray-200 font-semibold rounded-xl px-4"
            >
              Batal
            </Button>
            <Button
              onClick={() => handlePermanentDelete(selectedProgressId)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl px-4"
            >
              Hapus Permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}