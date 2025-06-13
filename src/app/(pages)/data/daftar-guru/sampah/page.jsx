"use client";

import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";
import { formatDate } from "@/utils/dateFormat";

export default function TrashPage() {
  const [deletedTeachers, setDeletedTeachers] = useState([]);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  const fetchDeletedTeachers = async () => {
    try {
      const res = await fetch("/api/admin/teacher/trash");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.success) {
        setDeletedTeachers(data.teachers || []);
      } else {
        console.error("Failed to fetch deleted teachers:", data.message);
        setDeletedTeachers([]);
      }
    } catch (error) {
      console.error("Error fetching deleted teachers:", error);
      setDeletedTeachers([]);
    }
  };

  useEffect(() => {
    fetchDeletedTeachers();
  }, []);

  const handleRestore = async (id) => {
    try {
      const res = await fetch(`/api/admin/teacher/restore`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      
      const data = await res.json();
      if (data.success) {
        fetchDeletedTeachers();
        setIsRestoreDialogOpen(false);
      }
    } catch (error) {
      console.error("Error restoring:", error);
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/teacher/permanentDelete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: parseInt(id) })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        fetchDeletedTeachers();
        setIsDeleteDialogOpen(false);
        // Optional: Add success notification
        alert("Data guru berhasil dihapus permanent");
      } else {
        throw new Error(data.message || "Gagal menghapus data guru");
      }
    } catch (error) {
      console.error("Error deleting permanently:", error);
      alert("Gagal menghapus data guru: " + error.message);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Data Guru Terhapus</h1>
        <Link href="/data/daftar-guru">
          <Button className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4">
            KEMBALI
          </Button>
        </Link>
      </div>

      {deletedTeachers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Tidak ada data guru yang terhapus
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Guru</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>No Telp</TableHead>
              <TableHead>NIP</TableHead>
              <TableHead>Tanggal Dihapus</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deletedTeachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.phone}</TableCell>
                <TableCell>{teacher.nip}</TableCell>
                <TableCell>{formatDate(teacher.deletedAt)}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    onClick={() => {
                      setSelectedTeacherId(teacher.id);
                      setIsRestoreDialogOpen(true);
                    }}
                    className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4"
                  >
                    Pulihkan
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedTeacherId(teacher.id);
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
              Apakah Anda yakin ingin memulihkan data guru ini?
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
              onClick={() => handleRestore(selectedTeacherId)}
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
              onClick={() => handlePermanentDelete(selectedTeacherId)}
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