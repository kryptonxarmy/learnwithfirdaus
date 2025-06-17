"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useUser from "@/hooks/useUser";

export default function KegiatanIntiOrtu() {
  const { user, loading, children } = useUser();
  const [tableData, setTableData] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedChild, setSelectedChild] = useState("");

  useEffect(() => {
    fetchSemesters();
    fetchAcademicYears();
  }, []);

  useEffect(() => {
    if (selectedChild && selectedSemester && selectedAcademicYear) {
      const child = children.find((child) => child.id === parseInt(selectedChild));
      if (child) {
        fetchKegiatanInti(child.classId);
      }
    }
  }, [selectedChild, selectedSemester, selectedAcademicYear]);

  const fetchKegiatanInti = async (classId) => {
    try {
      const res = await fetch(`/api/admin/aktivitas?classId=${classId}&semesterId=${selectedSemester}&academicYearId=${selectedAcademicYear}`);
      const data = await res.json();
      if (data.success) {
        setTableData(data.coreActivities);
      } else {
        console.error("Failed to fetch kegiatan inti:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch kegiatan inti:", error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const res = await fetch("/api/semester");
      const data = await res.json();
      if (data.success) {
        setSemesters(data.semesters);
      } else {
        console.error("Failed to fetch semesters:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch semesters:", error);
    }
  };

  const fetchAcademicYears = async () => {
    try {
      const res = await fetch("/api/academicYear");
      const data = await res.json();
      if (data.success) {
        setAcademicYears(data.academicYears);
      } else {
        console.error("Failed to fetch academic years:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch academic years:", error);
    }
  };

  const getActivitiesForDay = (week, day) => {
    return tableData.filter((item) => item.week === week && item.day === day);
  };

  const handleFilter = () => {
    if (selectedChild) {
      const child = children.find((child) => child.id === parseInt(selectedChild));
      if (child) {
        fetchKegiatanInti(child.classId);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold my-6">Aktivitas</h1>
      <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Filter Aktivitas</h2>
        <div className="flex flex-wrap gap-6 items-end">
          <div className="flex flex-col">
            <label htmlFor="child" className="text-sm font-medium text-gray-700 mb-2">
              Pilih Anak
            </label>
            <select id="child" value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)} className="border border-gray-300 rounded-lg p-3 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Pilih Anak</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="academicYear" className="text-sm font-medium text-gray-700 mb-2">
              Tahun Ajaran
            </label>
            <select id="academicYear" value={selectedAcademicYear} onChange={(e) => setSelectedAcademicYear(e.target.value)} className="border border-gray-300 rounded-lg p-3 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Pilih Tahun Ajar</option>
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="semester" className="text-sm font-medium text-gray-700 mb-2">
              Semester
            </label>
            <select id="semester" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="border border-gray-300 rounded-lg p-3 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Pilih Semester</option>
              {semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  Semester {semester.number}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="week" className="text-sm font-medium text-gray-700 mb-2">
              Minggu
            </label>
            <select id="week" value={selectedWeek} onChange={(e) => setSelectedWeek(parseInt(e.target.value))} className="border border-gray-300 rounded-lg p-3 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-primary">
              {[...Array(16).keys()].map((week) => (
                <option key={week + 1} value={week + 1}>
                  Minggu {week + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col justify-end">
            <Button onClick={handleFilter} className="bg-primary text-white font-semibold rounded-xl px-6 py-3 shadow hover:bg-primary-700 transition">
              Filter
            </Button>
          </div>
        </div>
      </div>
      {tableData?.length === 0 ? (
        <div className="flex justify-center border-2 border-primary p-3 rounded-xl shadow-lg items-center">
          <p className="font-semibold">Pilih filter yang anda inginkan</p>
        </div>
      ) : (
        <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
          <thead>
            <tr>
              <th className="px-6 py-3 text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Hari</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Aktivitas</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Deskripsi</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Status</th>
            </tr>
          </thead>
          <tbody>
            {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((day, index) => (
              <tr key={day} className="hover:bg-blue-50 transition">
                <td className="border px-4 py-2 font-semibold text-gray-700 text-center">{day}</td>
                <td className="border px-4 py-2 text-center">
                  {getActivitiesForDay(selectedWeek, day).map((activity) => (
                    <div key={activity.id} className="mb-2">
                      {activity.title}
                    </div>
                  ))}
                </td>
                <td className="border px-4 py-2 text-center">
                  {getActivitiesForDay(selectedWeek, day).map((activity) => (
                    <div key={activity.id} className="mb-2">
                      {activity.description}
                    </div>
                  ))}
                </td>
                <td className="border px-4 py-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    {getActivitiesForDay(selectedWeek, day).map((activity) => (
                      <div
                        key={activity.id}
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
          ${activity.completed ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"}`}
                      >
                        {activity.completed ? "Selesai" : "Belum"}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
