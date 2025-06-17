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
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTeacherId, setDeleteTeacherId] = useState(null);

  // Initial fetch
  useEffect(() => {
    fetch("/api/semester")
      .then((res) => res.json())
      .then((data) => setSemesters(data.semesters || []));
    fetch("/api/academicYear")
      .then((res) => res.json())
      .then((data) => setAcademicYears(data.academicYears || []));
    fetchTeachers();
  }, []);

  // Auto fetch when filter changes
  useEffect(() => {
    fetchTeachers();
  }, [selectedSemester, selectedAcademicYear]);

  const fetchTeachers = async () => {
    const params = new URLSearchParams();
    if (selectedSemester) params.append("semesterId", selectedSemester);
    if (selectedAcademicYear) params.append("academicYearId", selectedAcademicYear);
    
    try {
      const res = await fetch(`/api/admin/teacher?${params.toString()}`, {
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
        fetchTeachers();
        setIsDeleteDialogOpen(false);
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

  // Get dynamic semester and academic year names for display
  const getSelectedSemesterName = () => {
    if (!selectedSemester) return "Semua Semester";
    const semester = semesters.find(s => s.id.toString() === selectedSemester.toString());
    return semester ? `Semester ${semester.number}` : "Tidak Ditemukan";
  };

  const getSelectedAcademicYearName = () => {
    if (!selectedAcademicYear) return "Semua Tahun Ajar";
    const year = academicYears.find(y => y.id.toString() === selectedAcademicYear.toString());
    return year ? year.year : "Tidak Ditemukan";
  };

  // Convert semester number to Ganjil/Genap for print
  const getSemesterText = () => {
    if (!selectedSemester) return "Semua Semester";
    const semester = semesters.find(s => s.id.toString() === selectedSemester.toString());
    if (!semester) return "Semua Semester";
    return semester.number === 1 ? "Ganjil" : semester.number === 2 ? "Genap" : `Semester ${semester.number}`;
  };

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

    const selectedAcademicYearName = getSelectedAcademicYearName();
    const semesterText = getSemesterText();

    doc.write(`
      <html>
        <head>
          <title>Daftar Guru - TPA Duta Firdaus</title>
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

            @media print {
              body {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              
              .page-break {
                page-break-before: always;
              }
            }
          </style>
        </head>
        <body>
          <div class="watermark">TPA DUTA FIRDAUS</div>
          
          <div class="document-header">
            <div class="header-top">
              <div class="logo-section">
                <div class="logo-placeholder">TDF</div>
                <div class="company-info">
                  <h1>TPA DUTA FIRDAUS</h1>
                  <p>Yayasan Baitush Sholihin Bandung, Kanayakan Dalam No.06 Bandung</p>
                  <p>Telp/Fax: (022) 2512386 | Email: info@tpadutafirdaus.ac.id</p>
                </div>
              </div>
              <div class="document-meta">
                <div class="doc-number">DOC/TDF/GURU/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, "0")}/${String(new Date().getDate()).padStart(2, "0")}</div>
                <div>Tanggal Cetak: ${currentDate}</div>
                <div>Halaman 1 dari 1</div>
              </div>
            </div>
          </div>

          <div class="document-title">
            <h2>Daftar Guru Aktif</h2>
            <div class="subtitle">Tahun Ajaran ${selectedAcademicYearName} - ${semesterText}</div>
          </div>

          <div class="info-section">
            <div class="info-item">
              <div class="label">Total Guru</div>
              <div class="value">${teachers.length} Orang</div>
            </div>
            <div class="info-item">
              <div class="label">Status</div>
              <div class="value">Aktif</div>
            </div>
            <div class="info-item">
              <div class="label">Semester</div>
              <div class="value">${semesterText}</div>
            </div>
            <div class="info-item">
              <div class="label">Tahun Ajaran</div>
              <div class="value">${selectedAcademicYearName}</div>
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width: 5%;">No</th>
                  <th style="width: 25%;">Nama Lengkap</th>
                  <th style="width: 25%;">Email</th>
                  <th style="width: 15%;">No. Telepon</th>
                  <th style="width: 15%;">NIP</th>
                  <th style="width: 15%;">Tanggal Lahir</th>
                </tr>
              </thead>
              <tbody>
                ${teachers
                  .map(
                    (teacher, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td style="text-align: left; padding-left: 12px;">${teacher.name}</td>
                    <td>${teacher.email}</td>
                    <td>${teacher.phone}</td>
                    <td>${teacher.nip || "-"}</td>
                    <td>${formatDate(teacher.birthDate)}</td>
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
                <strong>Total Guru Aktif:</strong> <span class="total-count">${teachers.length} Orang</span>
              </div>
              <div style="font-size: 10px; color: #64748b;">
                Data per ${currentDate}
              </div>
            </div>
          </div>

          <div class="document-footer">
            <div class="footer-left">
              <div><strong>TPA Duta Firdaus</strong></div>
              <div>Dokumen ini digenerate secara otomatis oleh sistem</div>
              <div>© ${new Date().getFullYear()} TPA Duta Firdaus. All rights reserved.</div>
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
            <p className="font-bold text-lg">{getSelectedSemesterName()}</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="bg-primary size-16 flex justify-center items-center text-white rounded-full">
            <GraduationCap className="text-2xl" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray-300">Tahun Ajar</p>
            <p className="font-bold text-lg">{getSelectedAcademicYearName()}</p>
          </div>
        </div>
      </div>

      {/* Filter Section - Removed Filter Button */}
      <div className="flex gap-4 mb-4">
        <select 
          value={selectedAcademicYear} 
          onChange={(e) => setSelectedAcademicYear(e.target.value)}
          className="border border-gray-300 rounded-md p-2 min-w-[200px]"
        >
          <option value="">Semua Tahun Ajaran</option>
          {academicYears.map((y) => (
            <option key={y.id} value={y.id}>
              {y.year}
            </option>
          ))}
        </select>
        <select 
          value={selectedSemester} 
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="border border-gray-300 rounded-md p-2 min-w-[200px]"
        >
          <option value="">Semua Semester</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>
              Semester {s.number}
            </option>
          ))}
        </select>
      </div>

      {isTambahGuru || isEditGuru ? (
        <FormGuru 
          status={isEditGuru ? "edit" : "tambah"} 
          data={editData} 
          selectedAcademicYear={selectedAcademicYear} 
          selectedSemester={selectedSemester} 
          onKembali={handleKembali} 
          fetchTeachers={fetchTeachers} 
        />
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
                      <Button onClick={() => handleDeleteClick(teacher.id)} className="bg-red-500 text-white font-semibold rounded-xl px-4 ml-2">
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
              Tambah Guru
            </Button>
            <Link href={"/data"}>
              <Button className="bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4 print-hide">KEMBALI</Button>
            </Link>
            <Link href="/data/daftar-guru/sampah">
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
            <DialogDescription>Apakah Anda yakin ingin menghapus data guru ini? Tindakan ini tidak dapat dibatalkan.</DialogDescription>
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