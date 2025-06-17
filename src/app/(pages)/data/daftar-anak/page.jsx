"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import FormAnak from "./FormAnak";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { CalendarCheck, GraduationCap, User } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { handlePrint } from "./utils/handlePrintDataAnak";

export default function Page() {
  const [isTambahAnak, setIsTambahAnak] = useState(false);
  const [isEditAnak, setIsEditAnak] = useState(false);
  const [editData, setEditData] = useState(null);
  const [children, setChildren] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteChildId, setDeleteChildId] = useState(null);

  useEffect(() => {
    // Fetch initial data
    fetch("/api/semester")
      .then((res) => res.json())
      .then((data) => setSemesters(data.semesters));
    fetch("/api/academicYear")
      .then((res) => res.json())
      .then((data) => setAcademicYears(data.academicYears));
    fetchChildren();
  }, []);

  // Fetch children with filter when filter changes
  useEffect(() => {
    fetchChildren();
  }, [selectedSemester, selectedAcademicYear]);

  const fetchChildren = async () => {
    const params = new URLSearchParams();
    if (selectedSemester) params.append("semesterId", selectedSemester);
    if (selectedAcademicYear) params.append("academicYearId", selectedAcademicYear);
    
    try {
      const res = await fetch(`/api/admin/child?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setChildren(data.children);
      } else {
        console.error("Failed to fetch children:", data.message);
        setChildren([]);
      }
    } catch (error) {
      console.error("Error fetching children:", error.message);
      setChildren([]);
    }
  };

  const handleEdit = (data) => {
    setEditData(data);
    setIsEditAnak(true);
  };

  const handleTambah = () => {
    setIsTambahAnak(true);
  };

  const handleKembali = () => {
    setIsTambahAnak(false);
    setIsEditAnak(false);
    setEditData(null);
  };

  const handleDeleteClick = (id) => {
    setDeleteChildId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`/api/admin/child/softDelete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteChildId }),
      });

      const data = await res.json();
      if (data.success) {
        fetchChildren(); // Refresh data
        setIsDeleteDialogOpen(false);
        alert("Data anak berhasil dipindahkan ke sampah");
      } else {
        console.error("Failed to delete child:", data.error);
        alert("Gagal menghapus data anak");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

 

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex justify-between bg-primary text-primary-foreground rounded-xl shadow-lg p-8">
        <div>
          <h1 className="font-bold text-4xl">Data Anak</h1>
          <p>Informasi terbaru di LearnWithFirdaus.com</p>
        </div>
      </div>

      {/* Stats Section with Dynamic Data */}
      <div className="flex justify-around">
        <div className="flex gap-4 items-center">
          <div className="bg-primary size-16 flex justify-center items-center text-white rounded-full">
            <User className="text-2xl" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray-300">Jumlah Anak</p>
            <p className="font-bold text-lg">{children.length}</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="bg-primary size-16 flex justify-center items-center text-white rounded-full">
            <CalendarCheck className="text-2xl" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray-300">Semester</p>
            <p className="font-bold text-lg">
              {selectedSemester ? 
                semesters.find(s => s.id.toString() === selectedSemester.toString())?.number || "Tidak Ditemukan" : 
                "Semua Semester"
              }
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="bg-primary size-16 flex justify-center items-center text-white rounded-full">
            <GraduationCap className="text-2xl" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray-300">Tahun Ajar</p>
            <p className="font-bold text-lg">
              {selectedAcademicYear ? 
                academicYears.find(y => y.id.toString() === selectedAcademicYear.toString())?.year || "Tidak Ditemukan" : 
                "Semua Tahun Ajar"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section - Same as Teacher */}
      <div className="flex gap-4 mb-4">
        <select value={selectedAcademicYear} onChange={(e) => setSelectedAcademicYear(e.target.value)}>
          <option value="">Semua Tahun Ajaran</option>
          {academicYears.map((y) => (
            <option key={y.id} value={y.id}>
              {y.year}
            </option>
          ))}
        </select>
        <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
          <option value="">Semua Semester</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>
              Semester {s.number}
            </option>
          ))}
        </select>
        <Button onClick={fetchChildren}>Filter</Button>
      </div>

      {isTambahAnak || isEditAnak ? (
        <FormAnak 
          status={isEditAnak ? "edit" : "tambah"} 
          data={editData} 
          selectedAcademicYear={selectedAcademicYear} 
          selectedSemester={selectedSemester} 
          onKembali={handleKembali} 
          fetchChildren={fetchChildren} 
        />
      ) : (
        <>
          <div id="print-area">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Anak</TableHead>
                  <TableHead>Nama Orang Tua</TableHead>
                  <TableHead>Nomor Induk</TableHead>
                  <TableHead>Tanggal Lahir</TableHead>
                  <TableHead>Kelompok Usia</TableHead>
                  <TableHead className="print-hide">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {children.map((child) => (
                  <TableRow key={child.id}>
                    <TableCell>{child.name}</TableCell>
                    <TableCell>{child.parent.user.name}</TableCell>
                    <TableCell>{child.studentId}</TableCell>
                    <TableCell>{new Date(child.birthDate).toLocaleDateString()}</TableCell>
                    <TableCell>{child.class.name}</TableCell>
                    <TableCell className="print-hide">
                      <Button onClick={() => handleEdit(child)} className="bg-primary text-white font-semibold rounded-xl px-4">
                        Edit
                      </Button>
                      <Button onClick={() => handleDeleteClick(child.id)} className="bg-red-500 text-white font-semibold rounded-xl px-4 ml-2">
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex gap-4 justify-end items-center mt-8">
            <Button onClick={() => handlePrint(children, selectedSemester, selectedAcademicYear, semesters, academicYears)} className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4 print-hide">
              Cetak PDF
            </Button>
            <Button onClick={handleTambah} className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4 print-hide">
              Tambah Anak
            </Button>
            <Link href={"/data"}>
              <Button className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4 print-hide">KEMBALI</Button>
            </Link>
            <Link href="/data/daftar-anak/sampah">
              <Button className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4 print-hide">Sampah</Button>
            </Link>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>Apakah Anda yakin ingin menghapus data anak ini? Tindakan ini tidak dapat dibatalkan.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button onClick={() => setIsDeleteDialogOpen(false)} variant="outline" className="bg-gray-100 hover:bg-gray-200">
              Batal
            </Button>
            <Button onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600 text-white">
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @media print {
          .print-hide {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}