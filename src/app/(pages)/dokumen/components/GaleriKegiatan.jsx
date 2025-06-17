"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Image, School, User, CalendarCheck, GraduationCap, Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function GaleriKegiatan() {
  const [documents, setDocuments] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSemesters();
    fetchAcademicYears();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/admin/document/galeriKegiatan");
      const data = await response.json();
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
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
    if (!selectedAcademicYear || !selectedSemester) {
      setError("Please select both academic year and semester.");
      return;
    }

    try {
      const response = await fetch("/api/admin/document/galeriKegiatan", {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        fetchDocuments();
        setShowForm(false);
        setEditData(null);
        setIsEdit(false);
        setError("");
      } else {
        console.error("Failed to save document:", data.error);
      }
    } catch (error) {
      console.error("Failed to save document:", error);
    }
  };

  const handleEdit = (data) => {
    setEditData(data);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleTambah = () => {
    setEditData(null);
    setIsEdit(false);
    setShowForm(true);
  };

  const handleKembali = () => {
    setShowForm(false);
    setEditData(null);
    setIsEdit(false);
  };

  const handleFilterChange = async () => {
    if (!selectedAcademicYear || !selectedSemester) {
      setError("Please select both academic year and semester.");
      return;
    }

    try {
      const response = await fetch(`/api/admin/document/galeriKegiatan?semesterId=${selectedSemester}&academicYearId=${selectedAcademicYear}`);
      const data = await response.json();
      if (data.success) {
        setDocuments(data.documents);
        setError("");
      }
    } catch (error) {
      console.error("Failed to fetch filtered documents:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admin/document/galeriKegiatan?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        fetchDocuments();
      } else {
        console.error("Failed to delete document:", data.error);
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  const selectedAcademicYearObj = academicYears.find(year => year.id === parseInt(selectedAcademicYear));
  const selectedSemesterObj = semesters.find(semester => semester.id === parseInt(selectedSemester));

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
      {/* Filter Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="text-primary" />
          <h3 className="text-lg font-semibold text-primary">Filter Galeri Kegiatan</h3>
        </div>
        <div className="flex flex-wrap gap-6 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
              <GraduationCap className="w-4 h-4" /> Tahun Ajaran
            </label>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
                  <span className="text-lg">!</span> Pilih filter terlebih dahulu
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <Button
              onClick={handleFilterChange}
              className="bg-primary text-white font-semibold rounded-xl px-6 py-3 shadow hover:bg-primary-700 transition"
            >
              Filter
            </Button>
          </div>
        </div>
      </div>
      {/* Notifikasi jika filter belum dipilih */}
      {!selectedAcademicYear || !selectedSemester ? (
        <p className="text-center text-gray-500 mt-4">
          Harap memilih tahun ajar dan semester terlebih dahulu untuk menampilkan galeri kegiatan.
        </p>
      ) : (
        <>
          {showForm ? (
            <div className="flex flex-col gap-4">
              <Button onClick={handleKembali} className="btn btn-secondary self-start">
                Tutup
              </Button>
              <Form onSubmit={handleFormSubmit} initialData={editData} isEdit={isEdit} selectedSemester={selectedSemester} selectedAcademicYear={selectedAcademicYear} />
            </div>
          ) : (
            <>
              <h1 className="text-lg font-bold text-primary mb-4 mt-8">Galeri Kegiatan</h1>
              <Button onClick={handleTambah} className="btn btn-primary mb-4">
                Tambah Kegiatan
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 max-w-xl h-[50vh] shadow-2xl rounded-xl">
                    <div className="flex flex-col gap-4">
                      <div className="p-2 rounded-full size-14 flex justify-center items-center shadow-xl bg-primary">
                        <Image className="text-white" />
                      </div>
                      <div>
                        <Separator orientation="vertical" />
                        <h1 className="text-xl font-semibold">{doc.title}</h1>
                      </div>
                      <div className="flex gap-4 text-primary items-center">
                        <Link href={doc.link} target="_blank" className="text-primary">
                          <p className="font-semibold hover:underline">Lihat Selengkapnya</p>
                        </Link>
                        <ArrowRight />
                      </div>
                      <div className="flex flex-col gap-4">
                        <Button onClick={() => handleEdit(doc)} className="bg-primary text-white font-semibold rounded-xl px-4">
                          Edit
                        </Button>
                        <Button onClick={() => handleDelete(doc.id)} className="bg-red-500 text-white font-semibold rounded-xl px-4">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function Form({ onSubmit, initialData, isEdit, selectedSemester, selectedAcademicYear }) {
  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    title: initialData?.title || "",
    link: initialData?.link || "",
    semesterId: parseInt(selectedSemester) || initialData?.semesterId || "",
    academicYearId: parseInt(selectedAcademicYear) || initialData?.academicYearId || "",
  });

  useEffect(() => {
    if (selectedAcademicYear && selectedSemester) {
      fetchDocuments();
    }
  }, [selectedAcademicYear, selectedSemester]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        title: initialData.title,
        link: initialData.link,
        semesterId: selectedSemester || initialData.semesterId,
        academicYearId: selectedAcademicYear || initialData.academicYearId,
      });
    }
  }, [initialData, selectedSemester, selectedAcademicYear]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Judul Kegiatan
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Masukkan judul kegiatan"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition"
          required
        />
      </div>
      <div>
        <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
          Link Galeri (Google Drive, dll)
        </label>
        <input
          type="text"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleChange}
          placeholder="Masukkan link galeri"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition"
          required
        />
      </div>
      {/* Hidden inputs tetap */}
      <input
        type="hidden"
        name="semesterId"
        value={formData.semesterId}
        onChange={handleChange}
      />
      <input
        type="hidden"
        name="academicYearId"
        value={formData.academicYearId}
        onChange={handleChange}
      />
      <Button type="submit" className="bg-primary text-white font-semibold rounded-xl px-4 py-2 mt-2">
        {isEdit ? "Update" : "Submit"}
      </Button>
    </form>
  );
}