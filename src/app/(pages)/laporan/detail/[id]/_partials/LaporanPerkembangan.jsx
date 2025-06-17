"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const LaporanPerkembangan = () => {
  const { id } = useParams();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedProgressId, setSelectedProgressId] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    moralValue: "",
    motorGross: "",
    motorFine: "",
    cognitive: "",
    language: "",
    social: "",
    reflection: "",
    comments: "",
    childId: parseInt(id),
    semesterId: "",
    academicYearId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchProgressByChildId(id),
        fetchSemesters(),
        fetchAcademicYears(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const fetchProgressByChildId = async (childId) => {
    try {
      const res = await fetch(
        `/api/admin/laporan/laporanPerkembangan?childId=${childId}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch progress");
      }
      const data = await res.json();
      if (data.success) {
        setProgress(data.progress);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const res = await fetch("/api/semester");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setSemesters(data.semesters);
      } else {
        throw new Error(data.error || "Failed to fetch semesters");
      }
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  const fetchAcademicYears = async () => {
    try {
      const res = await fetch("/api/academicYear");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setAcademicYears(data.academicYears);
      } else {
        throw new Error(data.error || "Failed to fetch academic years");
      }
    } catch (error) {
      console.error("Error fetching academic years:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/laporan/laporanPerkembangan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          semesterId: parseInt(selectedSemester),
          academicYearId: parseInt(selectedAcademicYear),
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchProgressByChildId(id);
        setIsDialogOpen(false);
        alert("Data perkembangan berhasil ditambahkan");
        setFormData({
          date: "",
          moralValue: "",
          motorGross: "",
          motorFine: "",
          cognitive: "",
          language: "",
          social: "",
          reflection: "",
          comments: "",
          childId: parseInt(id),
          semesterId: "",
          academicYearId: "",
        });
      } else {
        throw new Error(data.error || "Failed to add progress");
      }
    } catch (error) {
      console.error("Error adding progress:", error);
      alert("Gagal menambahkan data: " + error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/laporan/laporanPerkembangan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          semesterId: parseInt(selectedSemester),
          academicYearId: parseInt(selectedAcademicYear),
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchProgressByChildId(id);
        setIsDialogOpen(false);
        alert("Data perkembangan berhasil diperbarui");
      } else {
        throw new Error(data.error || "Failed to update progress");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      alert("Gagal memperbarui data: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Soft delete progress details first
      await fetch(`/api/admin/laporan/detailPerkembangan/softDelete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progressId: id }),
      });

      // Then soft delete the progress
      const res = await fetch(`/api/admin/laporan/laporanPerkembangan/softDelete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        fetchProgressByChildId(id);
        setIsDeleteDialogOpen(false);
        alert("Data perkembangan berhasil dipindahkan ke sampah");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Gagal menghapus data");
    }
  };

  const handlePrint = async () => {
    try {
      if (!progress || progress.length === 0) {
        throw new Error('Tidak ada data laporan perkembangan');
      }

      // Fetch detail perkembangan dengan childId yang benar
      const detailRes = await fetch(`/api/admin/laporan/detailPerkembangan?childId=${id}&progressId=${progress[0]?.id}`);
      const detailData = await detailRes.json();

      if (!detailData.success) {
        throw new Error(detailData.error || 'Failed to fetch detail perkembangan');
      }

      // Log data untuk debugging
      console.log('Progress Data:', progress[0]);
      console.log('Detail Data:', detailData);

      const printWindow = window.open("", "", "width=900,height=650");
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Laporan Perkembangan Anak</title>
            <style>
              /* Atur margin halaman */
              @page {
                margin: 40px; /* Kurangi margin untuk memberi ruang lebih */
              }
              
              body { 
                font-family: Times New Roman, serif;
                color: #000;
                line-height: 1.5; /* Kurangi line height */
                margin: 0;
                padding: 0;
              }

              .header {
                text-align: center;
                margin-bottom: 20px; /* Kurangi margin bottom */
                border-bottom: 2px solid #000;
                padding-bottom: 15px; /* Kurangi padding */
              }

              .info-section {
                margin: 20px 0; /* Kurangi margin */
                page-break-inside: avoid;
              }

              .section-title {
                font-size: 16px; /* Kurangi ukuran font */
                font-weight: bold;
                margin: 15px 0; /* Kurangi margin */
                background-color: #f5f5f5;
                padding: 6px;
              }

              .report-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px; /* Kurangi gap */
                margin: 15px 0;
                page-break-inside: avoid; /* Penting: Pastikan container tidak terpotong */
              }

              .report-section {
                page-break-inside: avoid;
              }

              .info-grid {
                display: grid;
                grid-template-columns: 180px auto; /* Kurangi lebar kolom pertama */
                gap: 6px; /* Kurangi gap */
              }

              .label {
                font-weight: bold;
                font-size: 14px; /* Kurangi ukuran font */
              }

              .content {
                text-align: justify;
                font-size: 14px; /* Kurangi ukuran font */
              }

              .detail-category {
                margin: 12px 0; /* Kurangi margin */
                font-weight: bold;
              }

              .sub-category {
                margin: 4px 0 4px 15px; /* Kurangi margin */
                font-size: 14px; /* Kurangi ukuran font */
              }

              /* Hapus media print yang tidak perlu */
              @media print {
                .report-container {
                  break-inside: avoid; /* Pastikan container tidak terpotong saat print */
                }
              }
            </style>

          </head>
          <body>
            <div class="header">
              <h1>LAPORAN PERKEMBANGAN ANAK</h1>
              <p>LearnWithFirdaus</p>
            </div>

            <div class="info-section">
              <div class="section-title">Informasi Anak</div>
              <div class="info-grid">
                <div class="label">Nama</div>
                <div class="content">: ${progress[0]?.child?.name || "N/A"}</div>
                <div class="label">Nomor Induk</div>
                <div class="content">: ${progress[0]?.child?.studentId || "N/A"}</div>
                <div class="label">Semester</div>
                <div class="content">: ${progress[0]?.semester?.number || "N/A"}</div>
                <div class="label">Tahun Ajaran</div>
                <div class="content">: ${progress[0]?.academicYear?.year || "N/A"}</div>
              </div>
            </div>

            <div class="report-container">
              <div class="report-section">
                <div class="section-title">Aspek Perkembangan</div>
                <div class="info-grid">
                  <div class="label">Nilai Moral</div>
                  <div class="content">: ${progress[0]?.moralValue || "N/A"}</div>
                  <div class="label">Motorik Kasar</div>
                  <div class="content">: ${progress[0]?.motorGross || "N/A"}</div>
                  <div class="label">Motorik Halus</div>
                  <div class="content">: ${progress[0]?.motorFine || "N/A"}</div>
                  <div class="label">Kognitif</div>
                  <div class="content">: ${progress[0]?.cognitive || "N/A"}</div>
                  <div class="label">Bahasa</div>
                  <div class="content">: ${progress[0]?.language || "N/A"}</div>
                  <div class="label">Sosial</div>
                  <div class="content">: ${progress[0]?.social || "N/A"}</div>
                  <div class="label">Refleksi</div>
                  <div class="content">: ${progress[0]?.reflection || "N/A"}</div>
                  <div class="label">Komentar</div>
                  <div class="content">: ${progress[0]?.comments || "N/A"}</div>
                </div>
              </div>
              
              <div class="report-section">
                <div class="section-title">Detail Perkembangan</div>
                ${detailData.progressDetails?.length > 0 
                  ? detailData.progressDetails.map(detail => `
                      <div class="detail-category">${detail.category}</div>
                      ${detail.subDetails?.map(sub => `
                        <div class="sub-category">• ${sub.subCategory}: ${sub.status}</div>
                      `).join('')}
                    `).join('')
                  : '<div class="content">Tidak ada detail perkembangan</div>'
                }
              </div>
            </div>
          </body>
        </html>
      `);

      // Tambahkan timeout kecil untuk memastikan data terload
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 250);

    } catch (error) {
      console.error("Error printing:", error);
      alert('Gagal mencetak laporan: ' + error.message);
    }
  };


  if (loading) {
    return <div className="loader"></div>;
  }

  if (!progress || progress.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold">Detail Page</h1>
        
        {/* Tombol Sampah dan Cetak tetap ditampilkan */}
        <div className="flex justify-end gap-4">
          <Link href={`/laporan/detail/${id}/sampah`}>
            <Button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl px-4">
              Sampah
            </Button>
          </Link>
          <Button onClick={handlePrint} className="bg-primary text-white">
            Cetak PDF
          </Button>
        </div>

        <div className="text-center py-8">
          <p>Belum ada data perkembangan</p>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="mt-4 bg-primary text-white"
          >
            Tambah Data
          </Button>
        </div>

        {/* Dialog form tetap ada untuk menambah data baru */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Tambah Data Perkembangan</DialogTitle>
              <DialogDescription>
                Isi form berikut untuk menambahkan data perkembangan anak baru
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 max-h-[60vh] overflow-scroll gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="moralValue">Moral Value</Label>
                  <Input
                    id="moralValue"
                    name="moralValue"
                    type="text"
                    value={formData.moralValue}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="motorGross">Motor Gross</Label>
                  <Input
                    id="motorGross"
                    name="motorGross"
                    type="text"
                    value={formData.motorGross}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="motorFine">Motor Fine</Label>
                  <Input
                    id="motorFine"
                    name="motorFine"
                    type="text"
                    value={formData.motorFine}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cognitive">Cognitive</Label>
                  <Input
                    id="cognitive"
                    name="cognitive"
                    type="text"
                    value={formData.cognitive}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    name="language"
                    type="text"
                    value={formData.language}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="social">Social</Label>
                  <Input
                    id="social"
                    name="social"
                    type="text"
                    value={formData.social}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reflection">Reflection</Label>
                  <Input
                    id="reflection"
                    name="reflection"
                    type="text"
                    value={formData.reflection}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="comments">Comments</Label>
                  <Input
                    id="comments"
                    name="comments"
                    type="text"
                    value={formData.comments}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="semesterId">Semester</Label>
                  <select
                    id="semesterId"
                    name="semesterId"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                    required
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
                  <Label htmlFor="academicYearId">Tahun Ajar</Label>
                  <select
                    id="academicYearId"
                    name="academicYearId"
                    value={selectedAcademicYear}
                    onChange={(e) => setSelectedAcademicYear(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="">Pilih Tahun Ajar</option>
                    {academicYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Detail Page</h1>
      
      <div className="flex justify-end gap-4">
        <Link href={`/laporan/detail/${id}/sampah`}>
          <Button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl px-4">
            Sampah
          </Button>
        </Link>
        <Button onClick={handlePrint} className="bg-primary text-white">
          Cetak PDF
        </Button>
      </div>

      {/* Print Area */}
      <div id="print-area">
        <div className="p-4 border rounded-md shadow-md">
          <h2 className="text-lg font-semibold">Child Information</h2>
          <table className="w-full mt-4">
            <tbody>
              <tr>
                <td className="font-medium">Name</td>
                <td className="font-bold">{progress[0]?.child.name || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-medium">Student ID</td>
                <td className="font-bold">{progress[0]?.child.studentId || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {progress.map((item) => (
          <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`date-${item.id}`}>Date</Label>
              <Input 
                id={`date-${item.id}`} 
                type="text" 
                value={new Date(item.date).toLocaleDateString()} 
                readOnly 
              />
            </div>
            <div>
              <Label htmlFor={`moralValue-${item.id}`}>Moral Value</Label>
              <Input 
                id={`moralValue-${item.id}`} 
                type="text" 
                value={item.moralValue} 
                readOnly 
              />
            </div>
            <div>
              <Label htmlFor={`motorGross-${item.id}`}>Motor Gross</Label>
              <Input 
                id={`motorGross-${item.id}`} 
                type="text" 
                value={item.motorGross} 
                readOnly 
              />
            </div>
            <div>
              <Label htmlFor={`motorFine-${item.id}`}>Motor Fine</Label>
              <Input 
                id={`motorFine-${item.id}`} 
                type="text" 
                value={item.motorFine} 
                readOnly 
              />
            </div>
            <div>
              <Label htmlFor={`cognitive-${item.id}`}>Cognitive</Label>
              <Input 
                id={`cognitive-${item.id}`} 
                type="text" 
                value={item.cognitive} 
                readOnly 
              />
            </div>
            <div>
              <Label htmlFor={`language-${item.id}`}>Language</Label>
              <Input 
                id={`language-${item.id}`} 
                type="text" 
                value={item.language} 
                readOnly 
              />
            </div>
            <div>
              <Label htmlFor={`social-${item.id}`}>Social</Label>
              <Input 
                id={`social-${item.id}`} 
                type="text" 
                value={item.social} 
                readOnly 
              />
            </div>
            <div>
              <Label htmlFor={`reflection-${item.id}`}>Reflection</Label>
              <Input 
                id={`reflection-${item.id}`} 
                type="text" 
                value={item.reflection} 
                readOnly 
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor={`comments-${item.id}`}>Comments</Label>
              <Input 
                id={`comments-${item.id}`} 
                type="text" 
                value={item.comments} 
                readOnly 
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-4">
              <Button 
                onClick={() => {
                  setFormData({
                    id: item.id,
                    date: item.date,
                    moralValue: item.moralValue,
                    motorGross: item.motorGross,
                    motorFine: item.motorFine,
                    cognitive: item.cognitive,
                    language: item.language,
                    social: item.social,
                    reflection: item.reflection,
                    comments: item.comments,
                    childId: item.childId,
                    semesterId: item.semesterId,
                    academicYearId: item.academicYearId,
                  });
                  setSelectedSemester(item.semesterId);
                  setSelectedAcademicYear(item.academicYearId);
                  setIsDialogOpen(true);
                }} 
                className="bg-primary text-white"
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  setSelectedProgressId(item.id);
                  setIsDeleteDialogOpen(true);
                }}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Hapus
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog Edit/Add */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{formData.id ? "Edit Data Perkembangan" : "Tambah Data Perkembangan"}</DialogTitle>
            <DialogDescription>
              {formData.id 
                ? "Edit data perkembangan yang sudah ada" 
                : "Isi form berikut untuk menambahkan data perkembangan anak baru"
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formData.id ? handleUpdate : handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label>Tanggal</Label>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label>Nilai Moral dan Agama</Label>
                  <Textarea
                    name="moralValue"
                    value={formData.moralValue}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label>Motorik Kasar</Label>
                  <Textarea
                    name="motorGross"
                    value={formData.motorGross}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label>Motorik Halus</Label>
                  <Textarea
                    name="motorFine"
                    value={formData.motorFine}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Kognitif</Label>
                  <Textarea
                    name="cognitive"
                    value={formData.cognitive}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label>Bahasa</Label>
                  <Textarea
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label>Sosial Emosional</Label>
                  <Textarea
                    name="social"
                    value={formData.social}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <Label>Refleksi</Label>
                  <Textarea
                    name="reflection"
                    value={formData.reflection}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label>Komentar</Label>
                  <Textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Semester</Label>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Pilih Semester</option>
                      {semesters.map((semester) => (
                        <option key={semester.id} value={semester.id}>
                          {semester.number}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Tahun Ajaran</Label>
                    <select
                      value={selectedAcademicYear}
                      onChange={(e) => setSelectedAcademicYear(e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Pilih Tahun Ajaran</option>
                      {academicYears.map((year) => (
                        <option key={year.id} value={year.id}>
                          {year.year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-primary text-white">
                {formData.id ? "Simpan Perubahan" : "Tambah Data"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Data yang dihapus akan dipindahkan ke sampah dan dapat dipulihkan kembali.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outline"
              className="hover:bg-gray-200 font-semibold rounded-xl px-4"
            >
              Batal
            </Button>
            <Button
              onClick={() => handleDelete(selectedProgressId)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl px-4"
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LaporanPerkembangan;

