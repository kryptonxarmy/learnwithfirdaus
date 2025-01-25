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
      <div className="mb-4 flex gap-4">
        <div>
          <label htmlFor="child" className="mr-2">
            Pilih Anak:
          </label>
          <select
            id="child"
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Pilih Anak</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="academicYear" className="mr-2">
            Pilih Tahun Ajar:
          </label>
          <select
            id="academicYear"
            value={selectedAcademicYear}
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Pilih Tahun Ajar</option>
            {academicYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="semester" className="mr-2">
            Pilih Semester:
          </label>
          <select
            id="semester"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Pilih Semester</option>
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                Semester {semester.number}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="week" className="mr-2">
            Pilih Minggu:
          </label>
          <select
            id="week"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md p-2"
          >
            {[...Array(16).keys()].map((week) => (
              <option key={week + 1} value={week + 1}>
                Minggu {week + 1}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Button onClick={handleFilter} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Filter
          </Button>
        </div>
      </div>
      {tableData?.length === 0 ? (
        <div className="flex justify-center border-2 border-primary p-3 rounded-xl shadow-lg items-center">
          <p className="font-semibold">Pilih filter yang anda inginkan</p>
        </div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hari</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktivitas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((day) => (
              <tr key={day}>
                <td className="border px-4 py-2">{day}</td>
                <td className="border px-4 space-y-4 py-2">
                  {getActivitiesForDay(selectedWeek, day).map((activity) => (
                    <div key={activity.id} className="mb-2">
                      {activity.title}
                    </div>
                  ))}
                </td>
                <td className="border px-4 space-y-4 py-2">
                  {getActivitiesForDay(selectedWeek, day).map((activity) => (
                    <div key={activity.id} className="mb-2">
                      {activity.description}
                    </div>
                  ))}
                </td>
                <td className="border px-4 py-2">
                  {getActivitiesForDay(selectedWeek, day).map((activity) => (
                    <div key={activity.id} className={`px-2 py-1 rounded-full ${activity.completed ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"} mb-2`}>
                      {activity.completed ? "Selesai" : "Belum"}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}