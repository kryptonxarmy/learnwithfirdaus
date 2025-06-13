"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import FormAnak from "./FormAnak";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BookAudioIcon, CalendarCheck, GraduationCap, User } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function Page() {
  const [isTambahAnak, setIsTambahAnak] = useState(false);
  const [jumlahAnak, setJumlahAnak] = useState(0);
  const [isEditAnak, setIsEditAnak] = useState(false);
  const [editData, setEditData] = useState(null);
  const [children, setChildren] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteChildId, setDeleteChildId] = useState(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const res = await fetch("/api/admin/child");
      const data = await res.json();
      setChildren(data.children);
      setJumlahAnak(data.children.length);
    } catch (error) {
      console.error("Failed to fetch children:", error);
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
        fetchChildren();
        setIsDeleteDialogOpen(false);
      } else {
        console.error("Failed to delete child:", data.error);
      }
    } catch (error) {
      console.error("Failed to delete child:", error);
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
          <title>Daftar Anak</title>
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
            <h1>DAFTAR ANAK</h1>
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
          <h1 className="font-bold text-4xl">Data Anak</h1>
          <p>Informasi terbaru di LearnWithFirdaus.com</p>
        </div>
      </div>

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

      {isTambahAnak || isEditAnak ? (
        <FormAnak status={isEditAnak ? "edit" : "tambah"} data={editData} onKembali={handleKembali} fetchChildren={fetchChildren} />
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
                      <Button 
                        onClick={() => handleEdit(child)} 
                        className="bg-primary text-white font-semibold rounded-xl px-4"
                      >
                        Edit
                      </Button>
                      <Button 
                        onClick={() => handleDeleteClick(child.id)} 
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
              Tambah Anak
            </Button>
            <Link href={"/data"}>
              <Button className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4 print-hide">
                KEMBALI
              </Button>
            </Link>
            {/* Tambahkan di navbar atau sidebar */}
            <Link href="/data/daftar-anak/sampah">
              <Button className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4 print-hide">
                Sampah
              </Button>
            </Link>
          </div>
        </>
      )}

      {/* Tambahkan Dialog konfirmasi */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data anak ini? 
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
