"use client";

import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";

export default function TrashPage() {
  const [deletedAttendances, setDeletedAttendances] = useState([]); // Initialize with empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState(null);

  const fetchDeletedAttendances = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/admin/attendance/trash");
      const data = await res.json();
      
      if (data.success) {
        setDeletedAttendances(data.attendances || []); // Ensure we always have an array
      } else {
        setError(data.error || "Failed to fetch data");
      }
    } catch (error) {
      setError("An error occurred while fetching data");
      console.error("Error fetching deleted attendances:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedAttendances();
  }, []);

  const handleRestore = async (id) => {
    try {
      const res = await fetch(`/api/admin/attendance/restore`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      
      const data = await res.json();
      if (data.success) {
        fetchDeletedAttendances();
        setIsRestoreDialogOpen(false);
        alert("Data presensi berhasil dipulihkan");
      } else {
        console.error("Failed to restore:", data.error);
        alert("Gagal memulihkan data: " + data.error);
      }
    } catch (error) {
      console.error("Error restoring:", error);
      alert("Terjadi kesalahan saat memulihkan data");
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/attendance/permanentDelete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      
      const data = await res.json();
      if (data.success) {
        fetchDeletedAttendances();
        setIsDeleteDialogOpen(false);
        alert("Data presensi berhasil dihapus permanen");
      } else {
        console.error("Failed to delete permanently:", data.error);
        alert("Gagal menghapus data: " + data.error);
      }
    } catch (error) {
      console.error("Error deleting permanently:", error);
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sampah - Data Presensi Anak</h1>
          <Link href="/laporan/presensi-anak">
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
        <h1 className="text-2xl font-bold">Sampah - Data Presensi Anak</h1>
        <Link href="/laporan/presensi-anak">
          <Button className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4">
            KEMBALI
          </Button>
        </Link>
      </div>

      {deletedAttendances.length === 0 ? (
        <div className="text-center py-8">
          <p>Tidak ada data presensi yang dihapus</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nama Anak</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Jam Datang</TableHead>
              <TableHead>Jam Pulang</TableHead>
              <TableHead>Tanggal Dihapus</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deletedAttendances.map((attendance) => (
              <TableRow key={attendance.id}>
                <TableCell>{new Date(attendance.date).toLocaleDateString()}</TableCell>
                <TableCell>{attendance.child?.name || 'N/A'}</TableCell>
                <TableCell>{attendance.status}</TableCell>
                <TableCell>{attendance.arrivalTime}</TableCell>
                <TableCell>{attendance.departureTime}</TableCell>
                <TableCell>{attendance.deletedAt ? new Date(attendance.deletedAt).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    onClick={() => {
                      setSelectedAttendanceId(attendance.id);
                      setIsRestoreDialogOpen(true);
                    }}
                    className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4"
                  >
                    Pulihkan
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedAttendanceId(attendance.id);
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
              Apakah Anda yakin ingin memulihkan data presensi ini?
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
              onClick={() => {
                handleRestore(selectedAttendanceId);
                setIsRestoreDialogOpen(false);
              }}
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
              onClick={() => {
                handlePermanentDelete(selectedAttendanceId);
                setIsDeleteDialogOpen(false);
              }}
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