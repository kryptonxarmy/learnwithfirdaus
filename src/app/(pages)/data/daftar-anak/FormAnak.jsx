"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";

export default function FormAnak({ 
  status, 
  data, 
  onKembali, 
  fetchChildren, 
  selectedAcademicYear, 
  selectedSemester 
}) {
  const [formData, setFormData] = useState({
    name: "",
    parentId: "",
    studentId: "",
    phone: "",
    birthDate: "",
    gender: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    classId: "",
    profilePhoto: "", // Add this line
  });

  const [parents, setParents] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (status === "edit" && data) {
      setFormData(data);
    }
    fetchParents();
    fetchClasses();
  }, [status, data]);

  const fetchParents = async () => {
    try {
      const res = await fetch("/api/parent");
      const data = await res.json();
      setParents(data.parents);
    } catch (error) {
      console.error("Failed to fetch parents:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/class");
      const data = await res.json();
      setClasses(data.classes);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

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
        academicYear: selectedAcademicYear, // Gunakan filter yang dipilih
        semester: selectedSemester,         // Gunakan filter yang dipilih
      };

      const method = status === "edit" ? "PUT" : "POST";
      const res = await fetch(`/api/admin/child`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Failed to ${status === "edit" ? "update" : "add"} child`);
      }

      fetchChildren(); // Update daftar anak setelah submit
      onKembali(); // Kembali ke tampilan tabel
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex gap-4 flex-col">
      <div className="mb-4 border-b-2 border-primary w-fit">
        <h1 className="text-xl font-bold text-primary">Profile</h1>
      </div>
      <div className="flex gap-4 justify-around">
        <div className="size-36 overflow-hidden rounded-full border-2 border-primary">
          <img
            className="object-cover object-center"
            src={formData.profilePhoto ? `https://res.cloudinary.com/dsp8lxkqu/image/upload/${formData.profilePhoto}.jpg` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa4xjShh4ynJbrgYrW_aB4lhKSxeMzQ3cO_A&s"}
            alt="profile"
          />
        </div>
        <div className="flex flex-col w-[70%] gap-4">
          <h1 className="text-xl font-bold">{status === "edit" ? "Edit Anak" : "Tambah Anak"}</h1>
          <CldUploadWidget uploadPreset="tpa_firdaus" onSuccess={handleUploadSuccess}>
            {({ open }) => (
              <Button type="button" onClick={() => open()} className="w-full p-2 border border-gray-300 rounded">
                Upload Profile Photo
              </Button>
            )}
          </CldUploadWidget>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nama Anak" className="border border-gray-300 rounded-md p-2" />
          <select name="parentId" value={formData.parentId} onChange={handleChange} className="border border-gray-300 rounded-md text-black p-2">
            <option value="">Pilih Orang Tua</option>
            {parents.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.user.name}
              </option>
            ))}
          </select>
          <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="Nomor Induk" className="border border-gray-300 rounded-md p-2" />
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="No Telp" className="border border-gray-300 rounded-md p-2" />
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} placeholder="Tanggal Lahir" className="border border-gray-300 rounded-md p-2" />
          <select name="gender" value={formData.gender} onChange={handleChange} className="border border-gray-300 rounded-md p-2">
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Laki-Laki">Laki-Laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Alamat" className="border border-gray-300 rounded-md p-2" />
          <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Kota" className="border border-gray-300 rounded-md p-2" />
          <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Kode Pos" className="border border-gray-300 rounded-md p-2" />
          <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Negara" className="border border-gray-300 rounded-md p-2" />
          <select name="classId" value={formData.classId} onChange={handleChange} className="border border-gray-300 rounded-md p-2">
            <option value="">Pilih Kelas</option>
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>
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