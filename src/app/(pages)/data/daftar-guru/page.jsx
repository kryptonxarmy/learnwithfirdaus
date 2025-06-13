"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import FormGuru from "./FormGuru";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { CalendarCheck, GraduationCap, User } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatDate } from "@/utils/dateFormat";

export default function Page() {
  const [isTambahGuru, setIsTambahGuru] = useState(false);
  const [jumlahGuru, setJumlahGuru] = useState(0);
  const [isEditGuru, setIsEditGuru] = useState(false);
  const [editData, setEditData] = useState(null);
  const [teachers, setTeachers] = useState([]);
  // Add new states for delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTeacherId, setDeleteTeacherId] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/admin/teacher", {
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
        setTeachers(data.teachers);
        setJumlahGuru(data.teachers.length);
      } else {
        console.error("Failed to fetch teachers:", data.message);
        setTeachers([]);
        setJumlahGuru(0);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error.message);
      setTeachers([]);
      setJumlahGuru(0);
    }
  };

  const handleEdit = (data) => {
    setEditData(data);
    setIsEditGuru(true);
  };

  const handleTambah = () => {
    setIsTambahGuru(true);
  };

  const handleKembali = () => {
    setIsTambahGuru(false);
    setIsEditGuru(false);
    setEditData(null);
  };

  // Modified delete handlers
  const handleDeleteClick = (id) => {
    setDeleteTeacherId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`/api/admin/teacher/softDelete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteTeacherId }),
      });

      const data = await res.json();
      
      if (data.success) {
        fetchTeachers(); // Refresh data
        setIsDeleteDialogOpen(false);
        // Optional: Tambahkan notifikasi berhasil
        alert("Data guru berhasil dipindahkan ke sampah");
      } else {
        console.error("Failed to delete teacher:", data.error);
        alert("Gagal menghapus data guru");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  // Fungsi untuk mencetak hanya tabel dengan iframe
  const handlePrint = () => {
    const printContent = document.getElementById("print-area").innerHTML;
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;

    doc.write(`
      <html>
        <head>
          <title>Daftar Guru</title>
          <style>
            @page {
              margin: 40px;
            }
            
            body { 
              font-family: Times New Roman, serif;
              color: #000;
              line-height: 1.5;
              margin: 0;
              padding: 0;
            }

            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #000;
              padding-bottom: 15px;
            }

            .header h1 {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }

            .header p {
              font-size: 16px;
              margin: 0;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
              page-break-inside: avoid;
            }

            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
              font-size: 14px;
            }

            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }

            .print-hide {
              display: none !important;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>DAFTAR GURU</h1>
            <p>LearnWithFirdaus</p>
          </div>
          ${printContent}
        </body>
      </html>
    `);

    doc.close();
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex justify-between bg-primary text-primary-foreground rounded-xl shadow-lg p-8">
        <div>
          <h1 className="font-bold text-4xl">Data Guru</h1>
          <p>Informasi terbaru di LearnWithFirdaus.com</p>
        </div>
      </div>

      <div className="flex justify-around">
        <div className="flex gap-4 items-center">
          <div className="bg-primary size-16 flex justify-center items-center text-white rounded-full">
            <User className="text-2xl" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray-300">Jumlah Guru</p>
            <p className="font-bold text-lg">{teachers.length}</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="bg-primary size-16 flex justify-center items-center text-white rounded-full">
            <CalendarCheck className="text-2xl" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray-300">Semester</p>
            <p className="font-bold text-lg">1</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="bg-primary size-16 flex justify-center items-center text-white rounded-full">
            <GraduationCap className="text-2xl" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray-300">Tahun Ajar</p>
            <p className="font-bold text-lg">2024</p>
          </div>
        </div>
      </div>

      {isTambahGuru || isEditGuru ? (
        <FormGuru status={isEditGuru ? "edit" : "tambah"} data={editData} onKembali={handleKembali} fetchTeachers={fetchTeachers} />
      ) : (
        <>
          <div id="print-area">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Guru</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>No Telp</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Tanggal Lahir</TableHead>
                  <TableHead className="print-hide">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.phone}</TableCell>
                    <TableCell>{teacher.nip}</TableCell>
                    <TableCell>{formatDate(teacher.birthDate)}</TableCell>
                    <TableCell className="print-hide">
                      <Button onClick={() => handleEdit(teacher)} className="bg-primary text-white font-semibold rounded-xl px-4">
                        Edit
                      </Button>
                      <Button 
                        onClick={() => handleDeleteClick(teacher.id)} 
                        className="bg-red-500 text-white font-semibold rounded-xl px-4 ml-2"
                      >
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex gap-4 justify-end items-center mt-8">
            <Button
              onClick={handlePrint}
              className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4 print-hide"
            >
              Cetak PDF
            </Button>
            <Button
              onClick={handleTambah}
              className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4 print-hide"
            >
              Tambah Guru
            </Button>
            <Link href={"/data"}>
              <Button className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4 print-hide">
                KEMBALI
              </Button>
            </Link>
            <Link href="/data/daftar-guru/sampah">
              <Button className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4 print-hide">
                Sampah
              </Button>
            </Link>
          </div>
        </>
      )}

      {/* Add Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data guru ini? 
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outline"
              className="bg-gray-100 hover:bg-gray-200"
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
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
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          table {
            margin-top: 20px;
            padding: 10px;
          }
          h1 {
            font-size: 24px;
            text-align: center;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
}
