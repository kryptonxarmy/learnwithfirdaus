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
            <div className="flex justify-around w-full">
              <div className="flex flex-col w-[50%] justify-around p-4 gap-4 rounded-xl bg-purple-300/30 shadow-lg">
                <div>
                  <label htmlFor="child" className="block text-sm font-medium text-gray-700">
                    Pilih Anak
                  </label>
                  <select id="child" name="child" value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                    {children.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-gray-400">Nama Anak</p>
                  <p className="text-primary font-bold">{children.length > 0 ? children.find((child) => child.id.toString() === selectedChild)?.name : "Nama Anak"}</p>
                </div>
                <div className="flex justify-between">
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
                <h1 className="text-primary font-bold text-2xl">TPA DUTA FIRDAUS</h1>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h1 className="text-lg font-bold text-primary mb-4 mt-8">Riwayat Presensi</h1>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">No.</TableHead>
                  <TableHead className="text-center">Tanggal</TableHead>
                  <TableHead className="text-center">Nama Anak</TableHead>
                  <TableHead className="text-center">Kehadiran</TableHead>
                  <TableHead className="text-center">Jam Datang</TableHead>
                  <TableHead className="text-center">Jam Pulang</TableHead>
                  <TableHead className="text-center">Keterangan</TableHead>
                  <TableHead className="text-center">Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="text-center">{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-center">{item.child.name}</TableCell>
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
                    <TableCell className="text-center">{isPresent ? (data.arrivalTime ? data.arrivalTime : "-") : "-"}</TableCell>
                    <TableCell className="text-center">{isPresent ? (data.departureTime ? data.departureTime : "-") : "-"}</TableCell>
                    <TableCell className="text-center">{item.remarks}</TableCell>
                    <TableCell className="text-center">
                      <Button onClick={() => handleDetailClick(item)}>Detail</Button>
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
