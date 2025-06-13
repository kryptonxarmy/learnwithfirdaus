"use client";

import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";

export default function TrashPage() {
  const [deletedChildren, setDeletedChildren] = useState([]);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(null);

  const fetchDeletedChildren = async () => {
    const res = await fetch("/api/admin/child/trash");
    const data = await res.json();
    setDeletedChildren(data.children);
  };

  useEffect(() => {
    fetchDeletedChildren();
  }, []);

  // Update handleRestore function
  const handleRestore = async (id) => {
    try {
      const res = await fetch(`/api/admin/child/restore`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      
      const data = await res.json();
      if (data.success) {
        fetchDeletedChildren();
        setIsRestoreDialogOpen(false);
        alert("Data anak berhasil dipulihkan"); // Add success alert
      } else {
        console.error("Failed to restore:", data.error);
        alert("Gagal memulihkan data: " + data.error); // Add error alert
      }
    } catch (error) {
      console.error("Error restoring:", error);
      alert("Terjadi kesalahan saat memulihkan data"); // Add error alert
    }
  };

  // Update handlePermanentDelete function
  const handlePermanentDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/child/permanentDelete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      
      const data = await res.json();
      if (data.success) {
        fetchDeletedChildren();
        setIsDeleteDialogOpen(false);
        alert("Data anak berhasil dihapus permanen"); // Add success alert
      } else {
        console.error("Failed to delete permanently:", data.error);
        alert("Gagal menghapus data: " + data.error); // Add error alert
      }
    } catch (error) {
      console.error("Error deleting permanently:", error);
      alert("Terjadi kesalahan saat menghapus data"); // Add error alert
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4">
      {/* Add header with back button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sampah</h1>
        <Link href="/data/daftar-anak">
          <Button className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4">
            KEMBALI
          </Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Anak</TableHead>
            <TableHead>Nama Orang Tua</TableHead>
            <TableHead>Nomor Induk</TableHead>
            <TableHead>Tanggal Dihapus</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deletedChildren.map((child) => (
            <TableRow key={child.id}>
              <TableCell>{child.name}</TableCell>
              <TableCell>{child.parent.user.name}</TableCell>
              <TableCell>{child.studentId}</TableCell>
              <TableCell>{new Date(child.deletedAt).toLocaleDateString()}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  onClick={() => {
                    setSelectedChildId(child.id);
                    setIsRestoreDialogOpen(true);
                  }}
                  className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4"
                >
                  Pulihkan
                </Button>
                <Button
                  onClick={() => {
                    setSelectedChildId(child.id);
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

      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Pemulihan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin memulihkan data anak ini?
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
                handleRestore(selectedChildId);
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
                handlePermanentDelete(selectedChildId);
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