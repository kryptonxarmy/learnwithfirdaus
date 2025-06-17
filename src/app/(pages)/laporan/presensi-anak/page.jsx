"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarCheck, GraduationCap, Filter, MessageSquareWarning } from "lucide-react";
import Link from "next/link";

export default function PresensiAnakPage() {
  const [attendance, setAttendance] = useState([]);
  const [children, setChildren] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    date: "",
    type: "child",
    childId: "",
    status: "present",
    arrivalTime: "",
    departureTime: "",
    remarks: "",
    penjemput: "",
    pengantar: "",
    semesterId: "",
    academicYearId: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendance();
    fetchChildren();
    fetchSemesters();
    fetchAcademicYears();
    // eslint-disable-next-line
  }, [selectedSemester, selectedAcademicYear]);

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build the URL with search params
      const url = new URL("/api/admin/laporan/presensi/presensi-anak", window.location.origin);
      if (selectedSemester) {
        url.searchParams.append("semesterId", selectedSemester);
      }
      if (selectedAcademicYear) {
        url.searchParams.append("academicYearId", selectedAcademicYear);
      }

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setAttendance(data.attendances || []);
      } else {
        throw new Error(data.error || "Failed to fetch attendance data");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChildren = async () => {
    try {
      const res = await fetch("/api/admin/child");
      const data = await res.json();
      if (data.success) {
        setChildren(data.children);
      } else {
        console.error("Failed to fetch children:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch children:", error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const response = await fetch("/api/semester");
      const data = await response.json();
      if (data.success) {
        setSemesters(data.semesters);
      }
    } catch (error) {
      console.error("Failed to fetch semesters:", error);
    }
  };

  const fetchAcademicYears = async () => {
    try {
      const response = await fetch("/api/academicYear");
      const data = await response.json();
      if (data.success) {
        setAcademicYears(data.academicYears);
      }
    } catch (error) {
      console.error("Failed to fetch academic years:", error);
    }
  };

  const fetchAttendances = async () => {
    try {
      const response = await fetch("/api/admin/attendance");
      const data = await response.json();

      if (data.success) {
        setAttendance(data.attendances);
      } else {
        console.error("Failed to fetch attendances:", data.error);
      }
    } catch (error) {
      console.error("Error fetching attendances:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/laporan/presensi/presensi-anak", {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          semesterId: selectedSemester,
          academicYearId: selectedAcademicYear,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAttendance();
        setIsDialogOpen(false);
        setIsEditMode(false);
        setFormData({
          id: "",
          date: "",
          type: "child",
          childId: "",
          status: "present",
          arrivalTime: "",
          departureTime: "",
          remarks: "",
          penjemput: "",
          pengantar: "",
          semesterId: "",
          academicYearId: "",
        });
      } else {
        console.error("Failed to add/update attendance:", data.message);
      }
    } catch (error) {
      console.error("Failed to add/update attendance:", error);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      date: item.date.split("T")[0],
      type: item.type,
      childId: item.childId,
      status: item.status,
      arrivalTime: item.arrivalTime || "",
      departureTime: item.departureTime || "",
      remarks: item.remarks,
      penjemput: item.penjemput,
      pengantar: item.pengantar,
      semesterId: item.semesterId,
      academicYearId: item.academicYearId,
    });
    setSelectedSemester(item.semesterId);
    setSelectedAcademicYear(item.academicYearId);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/laporan/presensi/softDelete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        await fetchAttendance(); // Note: using fetchAttendance instead of fetchAttendances
        setIsDeleteDialogOpen(false);
        alert("Data presensi berhasil dipindahkan ke sampah");
      } else {
        throw new Error(data.error || "Failed to delete attendance");
      }
    } catch (error) {
      console.error("Failed to delete attendance:", error);
      alert("Gagal menghapus data: " + error.message);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    // Jika format sudah HH:MM, langsung return
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
    // Jika format ada spasi (ex: 2025-01-23 00:21:00)
    if (timeStr.includes(" ")) {
      const [, time] = timeStr.split(" ");
      return time ? time.slice(0, 5) : "-";
    }
    // Jika format 00:21:00
    if (timeStr.length >= 5) return timeStr.slice(0, 5);
    return timeStr;
  };

  // PRINT ONLY TABLE
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

    // Get selected semester and academic year names
    const selectedSemesterName = selectedSemester ? semesters.find((s) => s.id == selectedSemester)?.number || "Semua" : "Semua";
    const selectedAcademicYearName = selectedAcademicYear ? academicYears.find((y) => y.id == selectedAcademicYear)?.year || "Semua" : "Semua";

    doc.write(`
    <html>
      <head>
        <title>Laporan Presensi Anak - TPA Firdaus</title>
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
            font-size: 10px;
          }

          thead {
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: white;
          }

          th {
            padding: 12px 6px;
            text-align: center;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            font-size: 9px;
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
            padding: 8px 6px;
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

          /* Status badges */
          .status-badge {
            padding: 3px 8px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }

          .status-present {
            background-color: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
          }

          .status-excused {
            background-color: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
          }

          .status-absent {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
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

          .summary-stats {
            display: flex;
            gap: 20px;
          }

          .stat-item {
            text-align: center;
          }

          .stat-number {
            font-size: 18px;
            font-weight: 700;
            color: #1e40af;
            display: block;
          }

          .stat-label {
            font-size: 10px;
            color: #64748b;
            text-transform: uppercase;
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

          .print-hide {
            display: none !important;
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
            <div class="doc-number">DOC/TDF/PRESENSI/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, "0")}/${String(new Date().getDate()).padStart(2, "0")}</div>
            <div>Tanggal Cetak: ${currentDate}</div>
            <div>Halaman 1 dari 1</div>
          </div>
        </div>
      </div>

      <div class="document-title">
        <h2>Laporan Presensi Anak Didik</h2>
        <div class="subtitle">Tahun Ajaran ${selectedAcademicYearName} - Semester ${selectedSemesterName}</div>
      </div>

        <div class="info-section">
          <div class="info-item">
            <div class="label">Total Record</div>
            <div class="value">${attendance.length} Data</div>
          </div>
          <div class="info-item">
            <div class="label">Semester</div>
            <div class="value">${selectedSemesterName}</div>
          </div>
          <div class="info-item">
            <div class="label">Tahun Ajaran</div>
            <div class="value">${selectedAcademicYearName}</div>
          </div>
          <div class="info-item">
            <div class="label">Periode</div>
            <div class="value">${currentDate}</div>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 12%;">Tanggal</th>
                <th style="width: 18%;">Nama Anak</th>
                <th style="width: 15%;">Pengantar</th>
                <th style="width: 10%;">Jam Datang</th>
                <th style="width: 10%;">Jam Pulang</th>
                <th style="width: 15%;">Penjemput</th>
                <th style="width: 15%;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${attendance
                .map(
                  (item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${new Date(item.date).toLocaleDateString("id-ID")}</td>
                  <td style="text-align: left; padding-left: 8px;">${item.child ? item.child.name : "-"}</td>
                  <td style="text-align: left; padding-left: 8px;">${item.status === "present" ? item.pengantar || "-" : "-"}</td>
                  <td>${item.status === "present" && item.arrivalTime ? item.arrivalTime : "-"}</td>
                  <td>${item.status === "present" && item.departureTime ? item.departureTime : "-"}</td>
                  <td style="text-align: left; padding-left: 8px;">${item.status === "present" ? item.penjemput || "-" : "-"}</td>
                  <td>
                    <span class="status-badge ${item.status === "present" ? "status-present" : item.status === "excused" ? "status-excused" : "status-absent"}">
                      ${item.status === "present" ? "Hadir" : item.status === "excused" ? "Sakit" : "Alpa"}
                    </span>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="summary-section">
          <div class="summary-title">Ringkasan Presensi</div>
          <div class="summary-content">
            <div class="summary-stats">
              <div class="stat-item">
                <span class="stat-number">${attendance.filter((item) => item.status === "present").length}</span>
                <span class="stat-label">Hadir</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${attendance.filter((item) => item.status === "excused").length}</span>
                <span class="stat-label">Sakit</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${attendance.filter((item) => item.status === "absent").length}</span>
                <span class="stat-label">Alpa</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${attendance.length}</span>
                <span class="stat-label">Total</span>
              </div>
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
        <div class="signature-section">
          <div class="signature-title">Mengetahui,</div>
          <div class="signature-title">Kepala Sekolah</div>
          <div style="margin: 50px 0 10px 0;"></div>
          <div class="signature-line"></div>
          <div class="signature-name">Dr. Ahmad Firdaus, M.Pd</div>
          <div class="signature-title-below">NIP: 19801234567890123456</div>
        </div>
      </div>
    </body>
    </html>
  `);

    doc.close();
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Data Presensi Anak</h1>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md border mb-4 print-hide">
        {/* <div className="flex items-center gap-2 mb-4">
    <Filter className="text-primary" />
    <h3 className="text-lg font-semibold text-primary">Filter Data Presensi</h3>
  </div> */}
        <div className="flex flex-wrap gap-6 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
              <GraduationCap className="w-4 h-4" /> Tahun Ajaran
            </label>
            <select value={selectedAcademicYear} onChange={(e) => setSelectedAcademicYear(e.target.value)} className="border border-gray-300 rounded-lg p-3 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Pilih Tahun Ajar</option>
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
              <CalendarCheck className="w-4 h-4" /> Semester
            </label>
            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="border border-gray-300 rounded-lg p-3 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Pilih Semester</option>
              {semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  Semester {semester.number}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2 opacity-0">Status</label>
            <div>
              {selectedAcademicYear && selectedSemester ? (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-4 py-2 rounded-lg border border-green-200 font-medium">
                  <span className="text-lg">✓</span> Filter aktif
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg border border-yellow-200 font-medium">
                  <span className="text-lg">
                    <MessageSquareWarning />
                  </span>
                  Harap Pilih filter terlebih dahulu untuk tambah presensi
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-fit bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl px-4" onClick={() => setIsDialogOpen(true)} disabled={selectedAcademicYear === "" || selectedSemester === ""}>
            {console.log(selectedAcademicYear, "JANCOK", selectedSemester)}
            Tambah Presensi
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Presensi" : "Tambah Presensi"}</DialogTitle>
            <DialogDescription>Isi form berikut untuk {isEditMode ? "mengedit" : "menambahkan"} data presensi.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date" className="mb-1 block">
                  Tanggal
                </Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <Label htmlFor="childId" className="mb-1 block">
                  Nama Anak
                </Label>
                <select id="childId" name="childId" value={formData.childId} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Pilih Anak</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="status" className="mb-1 block">
                  Status Kehadiran
                </Label>
                <select id="status" name="status" value={formData.status} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" required>
                  <option value="present">Hadir</option>
                  <option value="excused">Sakit</option>
                  <option value="absent">Alpa</option>
                </select>
              </div>
              <div>
                <Label htmlFor="remarks" className="mb-1 block">
                  Keterangan
                </Label>
                <Input id="remarks" name="remarks" type="text" value={formData.remarks} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="Contoh: Izin dokter, dll" />
              </div>
              {formData.status === "present" && (
                <>
                  <div>
                    <Label htmlFor="arrivalTime" className="mb-1 block">
                      Jam Datang
                    </Label>
                    <Input id="arrivalTime" name="arrivalTime" type="time" value={formData.arrivalTime} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <Label htmlFor="departureTime" className="mb-1 block">
                      Jam Pulang
                    </Label>
                    <Input id="departureTime" name="departureTime" type="time" value={formData.departureTime} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <Label htmlFor="penjemput" className="mb-1 block">
                      Penjemput
                    </Label>
                    <Input id="penjemput" name="penjemput" type="text" value={formData.penjemput} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="Nama penjemput" />
                  </div>
                  <div>
                    <Label htmlFor="pengantar" className="mb-1 block">
                      Pengantar
                    </Label>
                    <Input id="pengantar" name="pengantar" type="text" value={formData.pengantar} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="Nama pengantar" />
                  </div>
                </>
              )}
            </div>
            <DialogFooter className="mt-6">
              <Button type="submit" className="w-full md:w-auto">
                {isEditMode ? "Update" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>Apakah Anda yakin ingin menghapus data presensi ini?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDeleteDialogOpen(false)} variant="outline" className="hover:bg-gray-200 font-semibold rounded-xl px-4">
              Batal
            </Button>
            <Button onClick={() => handleDelete(selectedAttendanceId)} className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl px-4">
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div id="print-area">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">No.</TableHead>
              <TableHead className="text-center">Tanggal</TableHead>
              <TableHead className="text-center">Nama Anak</TableHead>
              <TableHead className="text-center">Pengantar</TableHead>
              <TableHead className="text-center">Jam Datang</TableHead>
              <TableHead className="text-center">Jam Pulang</TableHead>
              <TableHead className="text-center">Penjemput</TableHead>
              <TableHead className="text-center">Kehadiran</TableHead>
              <TableHead className="text-center print-hide">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-center">{item.child ? item.child.name : "-"}</TableCell>
                <TableCell className="text-center">{item.status === "present" ? item.pengantar : "-"}</TableCell>
                <TableCell className="text-center">{item.status === "present" && item.arrivalTime ? formatTime(item.arrivalTime) : "-"}</TableCell>
                <TableCell className="text-center">{item.status === "present" && item.departureTime ? formatTime(item.departureTime) : "-"}</TableCell>
                <TableCell className="text-center">{item.status === "present" ? item.penjemput : "-"}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`badge ${
                      item.status === "present"
                        ? "bg-green-500 px-4 py-2 rounded-lg text-white shadow-lg"
                        : item.status === "excused"
                        ? "bg-yellow-500 px-4 py-2 rounded-lg text-white shadow-lg"
                        : "bg-red-500 px-4 py-2 rounded-lg text-white shadow-lg"
                    }`}
                  >
                    {item.status === "present" ? "Hadir" : item.status === "excused" ? "Sakit" : "Alpa"}
                  </span>
                </TableCell>
                <TableCell className="text-center print-hide">
                  <Button className="mr-2" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                  <Button
                    className="bg-red-500 text-white"
                    onClick={() => {
                      setSelectedAttendanceId(item.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="space-x-2"></div>
      <div className="w-full flex justify-end mt-8 print-hide gap-2">
        <Link href="/laporan/presensi-anak/sampah">
          <Button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl px-4">Sampah</Button>
        </Link>
        <Button onClick={handlePrint} className="bg-primary px-4 rounded-lg text-white font-semibold">
          Cetak PDF
        </Button>

        <Link href={"/laporan"}>
          <Button className="bg-primary px-4 rounded-lg text-white font-semibold">Kembali</Button>
        </Link>
      </div>
    </div>
  );
}
