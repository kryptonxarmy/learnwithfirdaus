import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import ModalKegiatan from "./ModalKegiatan";

export default function KegiatanInti({ data }) {
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    day: "",
    week: "1", // Default week value as string
    classId: "1", // Default classId as string
    learningModuleId: data.id.toString(), // Default learningModuleId from props data
    completed: false,
  });
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedClass, setSelectedClass] = useState("1"); // Default classId as string
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
    fetchKegiatanInti();
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/class");
      const data = await res.json();
      if (data.success) {
        setClasses(data.classes);
      } else {
        console.error("Failed to fetch classes:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  const fetchKegiatanInti = async () => {
    try {
      const res = await fetch(`/api/admin/aktivitas/aktivitasAdmin?classId=${selectedClass}&learningModuleId=${data.id}`);
      const result = await res.json();
      if (result.success) {
        setTableData(result.coreActivities);
      } else {
        console.error("Failed to fetch kegiatan inti:", result.message);
      }
    } catch (error) {
      console.error("Failed to fetch kegiatan inti:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...editData,
        week: parseInt(editData.week), // Convert week to integer
        classId: parseInt(editData.classId), // Convert classId to integer
        learningModuleId: data.id, // Use learningModuleId from props data
        completed: editData.completed === "true" || editData.completed === true,
      };

      const res = await fetch(`/api/admin/aktivitas/aktivitasAdmin`, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        console.log("Data tersimpan:", result.coreActivity);
        fetchKegiatanInti(); // Refresh data after save
        setIsModalOpen(false);
      } else {
        console.error("Failed to save kegiatan inti:", result.message);
      }
    } catch (error) {
      console.error("Failed to save kegiatan inti:", error);
    }
  };

  const handleEdit = (data) => {
    setEditData({
      ...data,
      week: data.week.toString(), // Convert week to string for input form
      classId: data.classId.toString(), // Convert classId to string for input form
      learningModuleId: data.learningModuleId.toString(), // Convert learningModuleId to string for input form
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleTambah = () => {
    setEditData({
      title: "",
      description: "",
      day: "",
      week: selectedWeek.toString(), // Set default week value
      classId: selectedClass, // Default classId as string
      learningModuleId: data.id.toString(), // Default learningModuleId from props data
      completed: false,
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/aktivitas/aktivitasAdmin`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();
      if (result.success) {
        fetchKegiatanInti(); // Refresh data after deletion
      } else {
        console.error("Failed to delete kegiatan inti:", result.message);
      }
    } catch (error) {
      console.error("Failed to delete kegiatan inti:", error);
    }
  };

  const getActivitiesForDay = (week, day) => {
    return tableData.filter((item) => item.week === week && item.day === day);
  };

  return (
    <div>
      <h1 className="text-xl font-bold my-6">Kegiatan Inti</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="week" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <span className="inline-block bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">#</span>
            Pilih Minggu
          </label>
          <select id="week" value={selectedWeek} onChange={(e) => setSelectedWeek(parseInt(e.target.value))} className="border border-gray-300 rounded-lg p-3 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-primary transition">
            {[...Array(16).keys()].map((week) => (
              <option key={week + 1} value={week + 1}>
                Minggu {week + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="class" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <span className="inline-block bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">🏫</span>
            Pilih Kelas
          </label>
          <select id="class" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="border border-gray-300 rounded-lg p-3 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-primary transition">
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col justify-end">
          <Button onClick={handleTambah} className="bg-primary text-white font-semibold rounded-xl px-6 py-3 shadow hover:bg-primary-700 transition">
            Tambah Kegiatan
          </Button>
        </div>
      </div>
      <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Hari</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Aktivitas</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Deskripsi</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Status</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((day) => (
            <tr key={day} className="hover:bg-blue-50 transition">
              <td className="border px-4 py-2 font-semibold text-gray-700">{day}</td>
              <td className="border px-4 space-y-2 py-2">
                {getActivitiesForDay(selectedWeek, day).map((activity) => (
                  <div key={activity.id} className="mb-2">
                    {activity.title}
                  </div>
                ))}
              </td>
              <td className="border px-4 space-y-2 py-2">
                {getActivitiesForDay(selectedWeek, day).map((activity) => (
                  <div key={activity.id} className="mb-2">
                    {activity.description}
                  </div>
                ))}
              </td>
              <td className="border px-4 py-2">
                {getActivitiesForDay(selectedWeek, day).map((activity) => (
                  <div
                    key={activity.id}
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2
                ${activity.completed ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"}`}
                  >
                    {activity.completed ? "Selesai" : "Belum"}
                  </div>
                ))}
              </td>
              <td className="border px-4 py-2">
                {getActivitiesForDay(selectedWeek, day).map((activity) => (
                  <div key={activity.id} className="flex gap-2 mb-2">
                    <Button onClick={() => handleEdit(activity)} className="bg-blue-500 text-white font-semibold rounded-xl px-3 py-1">
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(activity.id)} className="bg-red-500 text-white font-semibold rounded-xl px-3 py-1">
                      Delete
                    </Button>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalKegiatan isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isEdit={isEdit} editData={editData} handleInputChange={handleInputChange} handleSave={handleSave} />
    </div>
  );
}
