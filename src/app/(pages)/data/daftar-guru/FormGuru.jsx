"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";

export default function FormGuru({ status, data, onKembali, fetchTeachers, selectedAcademicYear, selectedSemester }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nip: "",
    birthDate: "",
    gender: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    profilePhoto: "", // Add this line
  });

  useEffect(() => {
    if (status === "edit" && data) {
      setFormData(data);
    }
  }, [status, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUploadSuccess = (result) => {
    setFormData((prevData) => ({ ...prevData, profilePhoto: result.info.public_id }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        academicYear: selectedAcademicYear, // Gunakan selectedAcademicYear dari props
        semester: selectedSemester, // Gunakan selectedSemester dari props
      };

      const method = status === "edit" ? "PUT" : "POST";
      const res = await fetch(`/api/admin/teacher`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Failed to ${status === "edit" ? "update" : "add"} teacher`);
      }

      fetchTeachers(); // Update daftar guru setelah submit
      onKembali(); // Kembali ke tampilan tabel setelah submit
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex gap-4 flex-col">
      <div className="mb-4 border-b-2 border-primary w-fit">
        <h1 className="text-xl font-bold text-primary">Profile</h1>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Filter Aktif:</h3>
            <p>Tahun Ajaran: {selectedAcademicYear ? "Dipilih" : "Belum dipilih"}</p>
            <p>Semester: {selectedSemester ? "Dipilih" : "Belum dipilih"}</p>
          </div>
      <div className="flex gap-4 justify-around">
        <div className="size-36 overflow-hidden rounded-full border-2 border-primary">
          <img
            className="object-cover object-bottom"
            src={formData.profilePhoto ? `https://res.cloudinary.com/dsp8lxkqu/image/upload/${formData.profilePhoto}.jpg` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa4xjShh4ynJbrgYrW_aB4lhKSxeMzQ3cO_A&s"}
            alt="profile"
          />
        </div>
        <div className="flex flex-col w-[70%] gap-4">
          <h1 className="text-xl font-bold">{status === "edit" ? "Edit Guru" : "Tambah Guru"}</h1>
          <CldUploadWidget uploadPreset="tpa_firdaus" onSuccess={handleUploadSuccess}>
            {({ open }) => (
              <Button type="button" onClick={() => open()} className="w-full p-2 border border-gray-300 rounded">
                Upload Profile Photo
              </Button>
            )}
          </CldUploadWidget>

          
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nama Guru" className="border border-gray-300 rounded-md p-2" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border border-gray-300 rounded-md p-2" />
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="No Telp" className="border border-gray-300 rounded-md p-2" />
          <input type="text" name="nip" value={formData.nip} onChange={handleChange} placeholder="NIP" className="border border-gray-300 rounded-md p-2" />
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} placeholder="Tanggal Lahir" className="border border-gray-300 rounded-md p-2" />
          <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Jenis Kelamin" className="border border-gray-300 rounded-md p-2" />
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Alamat" className="border border-gray-300 rounded-md p-2" />
          <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Kota" className="border border-gray-300 rounded-md p-2" />
          <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Kode Pos" className="border border-gray-300 rounded-md p-2" />
          <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Negara" className="border border-gray-300 rounded-md p-2" />
          <div className="flex gap-4">
            <Button onClick={handleSubmit} className="bg-primary text-white font-semibold rounded-xl px-4">
              {status === "edit" ? "Update" : "Tambah"}
            </Button>
            <Button onClick={onKembali} className="bg-gray-500 text-white font-semibold rounded-xl px-4">
              Kembali
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
