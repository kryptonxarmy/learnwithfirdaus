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
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    const currentDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    doc.write(`
    <html>
      <head>
        <title>Daftar Anak - TPA Firdaus</title>
        <meta charset="UTF-8">
        <style>
          @page {
            margin: 2cm 1.5cm;
            size: A4;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
            font-family: 'Times New Roman', serif;
            font-size: 12px;
            line-height: 1.4;
            color: #2c2c2c;
            background: white;
          }

          /* Header Section */
          .document-header {
            border-bottom: 3px solid #1e40af;
            padding-bottom: 20px;
            margin-bottom: 30px;
            position: relative;
          }

          .header-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
          }

          .logo-section {
            display: flex;
            align-items: center;
          }

          .logo-placeholder {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 24px;
            margin-right: 15px;
          }

          .company-info h1 {
            font-size: 24px;
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 3px;
            letter-spacing: 0.5px;
          }

          .company-info p {
            font-size: 11px;
            color: #64748b;
            margin-bottom: 2px;
          }

          .document-meta {
            text-align: right;
            font-size: 10px;
            color: #64748b;
          }

          .document-meta .doc-number {
            font-weight: 600;
            color: #1e40af;
            font-size: 11px;
          }

          /* Title Section */
          .document-title {
            text-align: center;
            margin-bottom: 25px;
            padding: 15px 0;
            background: linear-gradient(90deg, #f8fafc, #e2e8f0, #f8fafc);
            border-radius: 6px;
          }

          .document-title h2 {
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .document-title .subtitle {
            font-size: 12px;
            color: #64748b;
            font-style: italic;
          }

          /* Info Section */
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
            padding: 15px;
            background: #f8fafc;
            border-left: 4px solid #1e40af;
            border-radius: 0 6px 6px 0;
          }

          .info-item {
            text-align: center;
          }

          .info-item .label {
            font-size: 10px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
          }

          .info-item .value {
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
          }

          /* Table Styles */
          .table-container {
            margin-bottom: 30px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }

          thead {
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: white;
          }

          th {
            padding: 12px 8px;
            text-align: center;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            font-size: 10px;
            border-right: 1px solid rgba(255,255,255,0.2);
          }

          th:last-child {
            border-right: none;
          }

          tbody tr {
            border-bottom: 1px solid #e2e8f0;
          }

          tbody tr:nth-child(even) {
            background-color: #f8fafc;
          }

          tbody tr:hover {
            background-color: #e2e8f0;
          }

          td {
            padding: 10px 8px;
            text-align: center;
            vertical-align: middle;
            border-right: 1px solid #e2e8f0;
          }

          td:last-child {
            border-right: none;
          }

          td:first-child {
            font-weight: 600;
            color: #1e293b;
          }

          /* Summary Section */
          .summary-section {
            margin-top: 25px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
          }

          .summary-title {
            font-size: 12px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .summary-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .total-count {
            font-size: 14px;
            font-weight: 700;
            color: #1e40af;
          }

          /* Footer */
          .document-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: end;
          }

          .footer-left {
            font-size: 10px;
            color: #64748b;
          }

          .signature-section {
            text-align: center;
            min-width: 200px;
          }

          .signature-title {
            font-size: 11px;
            color: #1e293b;
            margin-bottom: 50px;
            font-weight: 600;
          }

          .signature-line {
            border-bottom: 1px solid #1e293b;
            margin-bottom: 5px;
            height: 1px;
          }

          .signature-name {
            font-size: 11px;
            color: #1e293b;
            font-weight: 600;
          }

          .signature-title-below {
            font-size: 10px;
            color: #64748b;
          }

          /* Print specific */
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            
            .page-break {
              page-break-before: always;
            }
          }

          /* Watermark */
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(30, 64, 175, 0.03);
            font-weight: 900;
            z-index: -1;
            pointer-events: none;
          }
        </style>
      </head>
      <body>
        <div class="watermark">TPA FIRDAUS</div>
        
        <div class="document-header">
          <div class="header-top">
            <div class="logo-section">
              
              <div class="company-info">
                <h1>TPA DUTA FIRDAUS</h1>
              <p>Yayasan Baitush Sholihin Bandung, Kanayakan Dalam No.06 Bandung</p>
              <p>Telp/Fax: (022) 2512386 | Email: info@tpadutafirdaus.ac.id</p>
              </div>
            </div>
            <div class="document-meta">
              <div class="doc-number">DOC/TPAFIRDAUS/ANAK/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, "0")}/${String(new Date().getDate()).padStart(2, "0")}</div>
              <div>Tanggal Cetak: ${currentDate}</div>
              <div>Halaman 1 dari 1</div>
            </div>
          </div>
        </div>

        <div class="document-title">
          <h2>Daftar Anak Didik Aktif</h2>
          <div class="subtitle">Tahun Ajaran 2024/2025 - Semester Ganjil</div>
        </div>

        

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 25%;">Nama Anak</th>
                <th style="width: 20%;">Nama Orang Tua</th>
                <th style="width: 15%;">Nomor Induk</th>
                <th style="width: 15%;">Tanggal Lahir</th>
                <th style="width: 20%;">Kelompok Usia</th>
              </tr>
            </thead>
            <tbody>
              ${children
                .map(
                  (child, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td style="text-align: left; padding-left: 12px;">${child.name}</td>
                  <td style="text-align: left; padding-left: 12px;">${child.parent.user.name}</td>
                  <td>${child.studentId}</td>
                  <td>${new Date(child.birthDate).toLocaleDateString("id-ID")}</td>
                  <td>${child.class.name}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="summary-section">
          <div class="summary-title">Ringkasan</div>
          <div class="summary-content">
            <div>
              <strong>Total Anak Didik Aktif:</strong> <span class="total-count">${children.length} Orang</span>
            </div>
            <div style="font-size: 10px; color: #64748b;">
              Data per ${currentDate}
            </div>
          </div>
        </div>

        <div class="document-footer">
          <div class="footer-left">
            <div><strong>TPA Firdaus</strong></div>
            <div>Dokumen ini digenerate secara otomatis oleh sistem</div>
            <div>© ${new Date().getFullYear()} TPA Firdaus. All rights reserved.</div>
          </div>
          
        </div>
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
            <Button onClick={handlePrint} className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4 print-hide">
              Cetak PDF
            </Button>
            <Button onClick={handleTambah} className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4 print-hide">
              Tambah Anak
            </Button>
            <Link href={"/data"}>
              <Button className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4 print-hide">KEMBALI</Button>
            </Link>
            {/* Tambahkan di navbar atau sidebar */}
            <Link href="/data/daftar-anak/sampah">
              <Button className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4 print-hide">Sampah</Button>
            </Link>
          </div>
        </>
      )}

      {/* Tambahkan Dialog konfirmasi */}
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
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th,
          td {
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
