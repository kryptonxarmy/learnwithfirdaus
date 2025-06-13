"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const [attendance, setAttendance] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    date: "",
    type: "teacher",
    teacherId: "",
    status: "present",
    arrivalTime: "",
    departureTime: "",
    remarks: "",
    semesterId: "",
    academicYearId: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchAttendance();
    fetchTeachers();
    fetchSemesters();
    fetchAcademicYears();
    // eslint-disable-next-line
  }, [selectedSemester, selectedAcademicYear]);

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`/api/admin/laporan/presensi?semesterId=${selectedSemester}&academicYearId=${selectedAcademicYear}`);
      const data = await res.json();
      if (data.success) {
        const filteredAttendance = data.attendance.filter((item) => item.type === "teacher");
        setAttendance(filteredAttendance);
      } else {
        console.error("Failed to fetch attendance:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/admin/teacher");
      const data = await res.json();
      if (data.success) {
        setTeachers(data.teachers);
      } else {
        console.error("Failed to fetch teachers:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/laporan/presensi", {
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
          type: "teacher",
          teacherId: "",
          status: "present",
          arrivalTime: "",
          departureTime: "",
          remarks: "",
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
      teacherId: item.teacherId,
      status: item.status,
      arrivalTime: item.arrivalTime || "",
      departureTime: item.departureTime || "",
      remarks: item.remarks,
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
      const res = await fetch("/api/admin/laporan/presensi", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAttendance();
      } else {
        console.error("Failed to delete attendance:", data.message);
      }
    } catch (error) {
      console.error("Failed to delete attendance:", error);
    }
  };

  const handleFilterChange = async () => {
    fetchAttendance();
  };

  // PRINT ONLY TABLE
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
          <title>Presensi Guru</title>
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
              text-align: center;
              font-size: 14px;
            }

            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }

            .badge {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-weight: bold;
              color: white;
            }

            .badge-present {
              background-color: #22c55e;
            }

            .badge-excused {
              background-color: #eab308;
            }

            .badge-absent {
              background-color: #ef4444;
            }

            .print-hide {
              display: none !important;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>DAFTAR PRESENSI GURU</h1>
            <p>LearnWithFirdaus</p>
          </div>
          ${printContent.replace(
            /bg-(green|yellow|red)-500 px-4 py-2 rounded-lg text-white shadow-lg/g,
            function(match, color) {
              return `badge badge-${
                color === 'green' ? 'present' : 
                color === 'yellow' ? 'excused' : 'absent'
              }`;
            }
          )}
        </body>
      </html>
    `);

    doc.close();
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };

  return (
    <div className="p-6">
      <h1 className="text-lg font-bold text-primary mb-4 mt-8">Riwayat Presensi Guru</h1>
      <div className="flex gap-4 mt-4 print-hide">
        <select value={selectedAcademicYear} onChange={(e) => setSelectedAcademicYear(e.target.value)} className="input">
          <option value="">Pilih Tahun Ajar</option>
          {academicYears.map((year) => (
            <option key={year.id} value={year.id}>
              {year.year}
            </option>
          ))}
        </select>
        <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="input">
          <option value="">Pilih Semester</option>
          {semesters.map((semester) => (
            <option key={semester.id} value={semester.id}>
              Semester {semester.number}
            </option>
          ))}
        </select>
        <Button onClick={handleFilterChange} className="btn btn-primary">
          Filter
        </Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4 print-hide" onClick={() => setIsDialogOpen(true)}>Tambah Presensi</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Presensi" : "Tambah Presensi"}</DialogTitle>
            <DialogDescription>Isi form berikut untuk {isEditMode ? "mengedit" : "menambahkan"} data presensi.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="date">Tanggal</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="teacherId">Nama Guru</Label>
                <select id="teacherId" name="teacherId" value={formData.teacherId} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2" required>
                  <option value="">Pilih Guru</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" value={formData.status} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2" required>
                  <option value="present">Hadir</option>
                  <option value="excused">Sakit</option>
                  <option value="absent">Alpa</option>
                </select>
              </div>
              <div>
                <Label htmlFor="arrivalTime">Jam Datang</Label>
                <Input id="arrivalTime" name="arrivalTime" type="time" value={formData.arrivalTime} onChange={handleInputChange} disabled={formData.status !== "present"} />
              </div>
              <div>
                <Label htmlFor="departureTime">Jam Pulang</Label>
                <Input id="departureTime" name="departureTime" type="time" value={formData.departureTime} onChange={handleInputChange} disabled={formData.status !== "present"} />
              </div>
              <div>
                <Label htmlFor="remarks">Keterangan</Label>
                <Input id="remarks" name="remarks" type="text" value={formData.remarks} onChange={handleInputChange} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{isEditMode ? "Update" : "Simpan"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div id="print-area">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">No.</TableHead>
              <TableHead className="text-center">Tanggal</TableHead>
              <TableHead className="text-center">Nama Guru</TableHead>
              <TableHead className="text-center">Jam Datang</TableHead>
              <TableHead className="text-center">Jam Pulang</TableHead>
              <TableHead className="text-center">Kehadiran</TableHead>
              <TableHead className="text-center print-hide">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-center">{item.teacher ? item.teacher.name : "-"}</TableCell>
                <TableCell className="text-center">{item.status === "present" ? item.arrivalTime : "-"}</TableCell>
                <TableCell className="text-center">{item.status === "present" ? item.departureTime : "-"}</TableCell>
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
                  <Button className="mr-2" onClick={() => handleEdit(item)}>Edit</Button>
                  <Button className="bg-red-500 text-white" onClick={() => handleDelete(item.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="w-full flex justify-end mt-8 print-hide gap-2">
        <Button
          onClick={handlePrint}
          className="bg-primary px-4 rounded-lg text-white font-semibold"
        >
          Cetak PDF
        </Button>
        <Link href={"/laporan"}>
          <Button className="bg-primary px-4 rounded-lg text-white font-semibold">Kembali</Button>
        </Link>
      </div>
    </div>
  );
}