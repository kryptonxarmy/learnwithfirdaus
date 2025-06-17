"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import DetailPresensi from "./DetailPresensi";

export default function RiwayatPresensi({ onBackToList }) {
  const { user, children } = useUser(); // Menggunakan hook untuk mendapatkan informasi pengguna
  const [attendance, setAttendance] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  useEffect(() => {
    if (children.length > 0) {
      setSelectedChild(children[0].id.toString());
    }
  }, [children]);

  useEffect(() => {
    if (selectedChild) {
      fetchAttendance(selectedChild);
    }
  }, [selectedChild]);

  const fetchAttendance = async (childId) => {
    try {
      const res = await fetch(`/api/admin/laporan/presensi/getPresensiByChildId?childId=${childId}`);
      const data = await res.json();
      if (data.success) {
        setAttendance(data.attendance);
      } else {
        console.error("Failed to fetch attendance:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    }
  };

  const handleDetailClick = (attendance) => {
    setSelectedAttendance(attendance);
  };

  const handleBack = () => {
    setSelectedAttendance(null);
  };

  return (
    <div>
      {selectedAttendance ? (
        <DetailPresensi data={selectedAttendance} onBack={handleBack} />
      ) : (
        <div>
         <div className="flex flex-col gap-6">
  <h1 className="text-xl font-bold">Keterangan</h1>
  <div className="flex justify-center w-full">
    <div className="flex flex-col w-full max-w-xl justify-around p-6 gap-4 rounded-2xl bg-blue-50 shadow-lg border border-blue-100">
      <div>
        <label htmlFor="child" className="block text-sm font-medium text-gray-700 mb-1">
          Pilih Anak
        </label>
        <select
          id="child"
          name="child"
          value={selectedChild}
          onChange={(e) => setSelectedChild(e.target.value)}
          className="block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary transition"
        >
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p className="text-gray-400">Nama Anak</p>
        <p className="text-primary font-bold text-lg">
          {children.length > 0 ? children.find((child) => child.id.toString() === selectedChild)?.name : "Nama Anak"}
        </p>
      </div>
      <div className="flex flex-wrap gap-6 justify-between">
        <div>
          <p className="text-gray-400">Kelompok Usia</p>
          <p className="text-primary font-bold">{children.length > 0 ? children.find((child) => child.id.toString() === selectedChild)?.class.ageGroup : "Kelompok Usia"}</p>
        </div>
        <div>
          <p className="text-gray-400">Semester</p>
          <p className="text-primary font-bold">{attendance.length > 0 ? attendance[0].semester.number : "Semester"}</p>
        </div>
        <div>
          <p className="text-gray-400">Tahun Ajar</p>
          <p className="text-primary font-bold">{attendance.length > 0 ? attendance[0].academicYear.year : "Tahun Ajar"}</p>
        </div>
      </div>
      <h1 className="text-primary font-bold text-2xl text-center mt-2">TPA DUTA FIRDAUS</h1>
    </div>
  </div>
</div>

<div className="mt-8">
  <h1 className="text-lg font-bold text-primary mb-4 mt-8">Riwayat Presensi</h1>
  <Table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
    <TableHeader>
      <TableRow>
        <TableHead className="text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">No.</TableHead>
        <TableHead className="text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Tanggal</TableHead>
        <TableHead className="text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Nama Anak</TableHead>
        <TableHead className="text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Kehadiran</TableHead>
        <TableHead className="text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Jam Datang</TableHead>
        <TableHead className="text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Jam Pulang</TableHead>
        <TableHead className="text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Keterangan</TableHead>
        <TableHead className="text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Detail</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {attendance.map((item, index) => (
        <TableRow key={item.id} className="hover:bg-blue-50 transition">
          <TableCell className="text-center">{index + 1}</TableCell>
          <TableCell className="text-center">{new Date(item.date).toLocaleDateString()}</TableCell>
          <TableCell className="text-center">{item.child.name}</TableCell>
          <TableCell className="text-center">
            <span
              className={`inline-block px-4 py-2 rounded-lg text-xs font-semibold shadow-lg
                ${item.status === "present"
                  ? "bg-green-500 text-white"
                  : item.status === "excused"
                  ? "bg-yellow-500 text-white"
                  : "bg-red-500 text-white"
                }`}
            >
              {item.status === "present" ? "Hadir" : item.status === "excused" ? "Sakit" : "Alpa"}
            </span>
          </TableCell>
          <TableCell className="text-center">{item.status === "present" ? (item.arrivalTime ? item.arrivalTime : "-") : "-"}</TableCell>
          <TableCell className="text-center">{item.status === "present" ? (item.departureTime ? item.departureTime : "-") : "-"}</TableCell>
          <TableCell className="text-center">{item.remarks}</TableCell>
          <TableCell className="text-center">
            <Button onClick={() => handleDetailClick(item)} className="bg-primary text-white font-semibold rounded-xl px-3 py-1">
              Detail
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
        </div>
      )}
    </div>
  );
}
