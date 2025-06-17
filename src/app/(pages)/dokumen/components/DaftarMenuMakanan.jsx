"use client";

import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { School, User } from "lucide-react";

export default function DaftarMenuMakanan() {
  const [menus, setMenus] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");

  useEffect(() => {
    fetchMenus();
    fetchSemesters();
    fetchAcademicYears();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch(`/api/admin/document/menuMakanan?semesterId=${selectedSemester}&academicYearId=${selectedAcademicYear}`);
      const data = await res.json();
      if (data.success) {
        setMenus(data.documents);
      } else {
        console.error("Failed to fetch menus:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch menus:", error);
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

  const handleFormSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/admin/document/menuMakanan`, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        fetchMenus(); // Refresh data after save
        setShowForm(false);
      } else {
        console.error("Failed to save menu data:", data.message);
      }
    } catch (error) {
      console.error("Failed to save menu data:", error);
    }
  };

  const handleEdit = (data) => {
    setEditData(data);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/document/menuMakanan`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        fetchMenus(); // Refresh data after delete
      } else {
        console.error("Failed to delete menu data:", data.message);
      }
    } catch (error) {
      console.error("Failed to delete menu data:", error);
    }
  };

  const handleTambah = () => {
    setEditData(null);
    setIsEdit(false);
    setShowForm(true);
  };

  const handleKembali = () => {
    setShowForm(false);
  };

  const handleFilterChange = async () => {
    fetchMenus();
  };

  const selectedAcademicYearObj = academicYears.find((year) => year.id === parseInt(selectedAcademicYear));
  const selectedSemesterObj = semesters.find((semester) => semester.id === parseInt(selectedSemester));

  const items = [
    {
      title: "Tahun Ajar",
      desc: selectedAcademicYearObj ? selectedAcademicYearObj.year : "Tidak ada data",
      icon: User,
    },
    {
      title: "Semester",
      desc: selectedSemesterObj ? `Semester ${selectedSemesterObj.number}` : "Tidak ada data",
      icon: School,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex mb-6 justify-around">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 items-center">
            <div className="bg-primary size-16 flex justify-center items-center text-white rounded-full">
              <item.icon className="text-2xl" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-300">{item.title}</p>
              <p className="font-bold text-lg">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md border mb-4">
        <div className="flex items-center gap-2 mb-4">
          <School className="text-primary" />
          <h3 className="text-lg font-semibold text-primary">Filter Menu Makanan</h3>
        </div>
        <div className="flex flex-wrap gap-6 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">Tahun Ajaran</label>
            <select value={selectedAcademicYear} onChange={(e) => setSelectedAcademicYear(e.target.value)} className="border border-gray-300 rounded-lg p-3 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Pilih Tahun Ajar</option>
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">Semester</label>
            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="border border-gray-300 rounded-lg p-3 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Pilih Semester</option>
              {semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  Semester {semester.number}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col justify-end">
            <Button onClick={handleFilterChange} className="bg-primary text-white font-semibold rounded-xl px-6 py-3 shadow hover:bg-primary-700 transition">
              Filter
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogTrigger asChild>
          <Button onClick={handleTambah} className="btn btn-primary mb-4">
            Tambah Menu
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Update Data" : "Form Menu"}</DialogTitle>
          </DialogHeader>
          <Form onSubmit={handleFormSubmit} initialData={editData} isEdit={isEdit} selectedSemester={selectedSemester} selectedAcademicYear={selectedAcademicYear} />
          <DialogFooter>
            <Button onClick={handleKembali} className="btn btn-secondary">
              Kembali
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <h1 className="text-lg font-bold text-primary mb-4 mt-8">Daftar Menu Makanan</h1>
      <Table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-3 text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">No</TableHead>
            <TableHead className="px-6 py-3 text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Hari</TableHead>
            <TableHead className="px-6 py-3 text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Tanggal</TableHead>
            <TableHead className="px-6 py-3 text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Menu</TableHead>
            <TableHead className="px-6 py-3 text-center text-xs font-bold text-primary uppercase tracking-wider bg-blue-50">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menus.map((menu, index) => (
            <TableRow key={menu.id} className="hover:bg-blue-50 transition">
              <TableCell className="text-center px-4 py-2 font-semibold text-gray-700">{index + 1}</TableCell>
              <TableCell className="text-center px-4 py-2">{menu.day}</TableCell>
              <TableCell className="text-center px-4 py-2">{format(parseISO(menu.date), "dd/MM/yyyy")}</TableCell>
              <TableCell className="text-center px-4 py-2">{menu.menu}</TableCell>
              <TableCell className="text-center px-4 py-2">
                <div className="flex justify-center gap-2">
                  <Button onClick={() => handleEdit(menu)} className="bg-blue-500 text-white font-semibold rounded-xl px-3 py-1">
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(menu.id)} className="bg-red-500 text-white font-semibold rounded-xl px-3 py-1">
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Form({ onSubmit, initialData, isEdit, selectedSemester, selectedAcademicYear }) {
  const [formData, setFormData] = useState({
    id: "",
    day: "",
    date: "",
    menu: "",
    semesterId: selectedSemester || "",
    academicYearId: selectedAcademicYear || "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || "",
        day: initialData.day || "",
        date: initialData.date ? new Date(initialData.date).toISOString().substring(0, 10) : "",
        menu: initialData.menu || "",
        semesterId: selectedSemester || initialData.semesterId,
        academicYearId: selectedAcademicYear || initialData.academicYearId,
      });
    }
  }, [initialData, selectedSemester, selectedAcademicYear]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    const date = new Date(value);
    const day = format(date, "EEEE");
    setFormData((prevData) => ({
      ...prevData,
      date: value,
      day,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      id: "",
      day: "",
      date: "",
      menu: "",
      semesterId: selectedSemester,
      academicYearId: selectedAcademicYear,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border-2 border-primary rounded-xl bg-white shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hari</label>
        <Input type="text" name="day" value={formData.day} onChange={handleChange} placeholder="Hari" className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition" disabled />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
        <Input type="date" name="date" value={formData.date} onChange={handleDateChange} placeholder="Tanggal" className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Menu</label>
        <Input type="text" name="menu" value={formData.menu} onChange={handleChange} placeholder="Menu" className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition" />
      </div>
      <Button type="submit" className="bg-primary text-white font-semibold rounded-xl px-4 mt-2">
        {isEdit ? "Update Data" : "Submit"}
      </Button>
    </form>
  );
}
