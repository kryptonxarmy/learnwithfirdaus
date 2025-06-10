"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import FormGuru from "./FormGuru"; // Pastikan Anda mengimpor komponen FormGuru
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"; // Pastikan Anda mengimpor komponen Table
import { BookAudioIcon, CalendarCheck, GraduationCap, User } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const [isTambahGuru, setIsTambahGuru] = useState(false);
  const [jumlahGuru, setJumlahGuru] = useState(0);
  const [isEditGuru, setIsEditGuru] = useState(false);
  const [editData, setEditData] = useState(null);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/admin/teacher");
      const data = await res.json();
      setTeachers(data.teachers);
      setJumlahGuru(data.teachers.length);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
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

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/teacher`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        fetchTeachers(); // Refresh the list after deletion
      } else {
        console.error("Failed to delete teacher:", data.error);
      }
    } catch (error) {
      console.error("Failed to delete teacher:", error);
    }
  };

  // Fungsi untuk mencetak hanya tabel dengan iframe
  const handlePrint = () => {
    const printContent = document.getElementById("printableTable").innerHTML; // Ambil isi tabel dan judul
    
    // Membuat iframe untuk menampilkan konten cetak
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    
    // Menambahkan HTML ke iframe
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            @media print {
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                color: #000;
              }

              h1 {
                font-size: 24px;
                text-align: center;
                margin-bottom: 20px;
              }

              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }

              th, td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
              }

              th {
                background-color: #f3f3f3;
                font-weight: bold;
              }

              /* Menambah jarak di antara tabel */
              table {
                margin-top: 20px;
              }

              /* Menyembunyikan kolom Aksi pada cetakan */
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          
          ${printContent}
        </body>
      </html>
    `);
    doc.close();

    // Mencetak iframe
    iframe.contentWindow.print();
    document.body.removeChild(iframe); // Menghapus iframe setelah pencetakan
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
          <div id="printableTable">
            {/* Menambahkan teks "Daftar Guru" di atas tabel */}
            <h1 className="text-xl font-bold mb-4">Daftar Guru</h1> {/* Judul Daftar Guru */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Guru</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>No Telp</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Tanggal Lahir</TableHead>
                  <TableHead className="no-print">Aksi</TableHead> {/* Kolom Aksi yang disembunyikan saat pencetakan */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.phone}</TableCell>
                    <TableCell>{teacher.nip}</TableCell>
                    <TableCell>{new Date(teacher.birthDate).toLocaleDateString()}</TableCell>
                    <TableCell className="no-print">
                      <Button onClick={() => handleEdit(teacher)} className="bg-primary text-white font-semibold rounded-xl px-4">
                        Edit
                      </Button>
                      <Button onClick={() => handleDelete(teacher.id)} className="bg-red-500 text-white font-semibold rounded-xl px-4 ml-2">
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Tombol Cetak dan Tambah Guru diletakkan di bawah, berjejer */}
          <div className="flex gap-4 justify-end items-center mt-8">
            <Button
              onClick={handlePrint} // Panggil fungsi untuk mencetak
              className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4 no-print"
            >
              Cetak
            </Button>
            <Button
              onClick={handleTambah}
              className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4"
            >
              Tambah Guru
            </Button>
            <Link href={"/data"}>
              <Button className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4">
                KEMBALI
              </Button>
            </Link>
          </div>
        </>
      )}

      {/* Menambahkan CSS @media print langsung di dalam komponen */}
      <style jsx global>{`
        @media print {
          /* Menyembunyikan elemen-elemen yang tidak perlu dicetak */
          .no-print {
            display: none !important;
          }

          /* Menyembunyikan tombol "Tambah Guru", "Cetak", dan "Kembali" pada saat pencetakan */
          .flex {
            display: none !important;
          }

          /* Menyembunyikan header bagian atas saat mencetak */
          .bg-primary {
            display: none !important;
          }

          /* Memperbaiki tampilan tabel saat dicetak */
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

          /* Menambahkan margin dan padding untuk tabel */
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
