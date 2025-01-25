"use client";

import { Button } from "@/components/ui/button";
import useUser from "@/hooks/useUser";
import { Edit, EditIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

export default function Page() {
  const { name, role } = useUser();

  const [activities, setActivities] = useState([]);
  const [academicCalendar, setAcademicCalendar] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [newActivity, setNewActivity] = useState({ title: "", image: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [editActivityId, setEditActivityId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchActivities();
    fetchAcademicCalendar();
    setCurrentDate(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/kegiatan");
      const data = await res.json();
      if (data.success) {
        setActivities(data.kegiatan);
      } else {
        console.error("Failed to fetch activities:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  };

  const fetchAcademicCalendar = async () => {
    try {
      const res = await fetch("/api/admin/kalenderAkademik");
      const data = await res.json();
      if (data.success) {
        setAcademicCalendar(data.academicCalendar);
      } else {
        console.error("Failed to fetch academic calendar:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch academic calendar:", error);
    }
  };

  const handleAddOrUpdateActivity = async (e) => {
    e.preventDefault();

    const method = isEdit ? "PUT" : "POST";
    const endpoint = isEdit ? `/api/kegiatan` : `/api/kegiatan`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newActivity, id: editActivityId }),
      });

      const data = await res.json();
      if (data.success) {
        fetchActivities();
        setNewActivity({ title: "", image: "" });
        setIsEdit(false);
        setEditActivityId(null);
        setIsDrawerOpen(false);
      } else {
        console.error(`Failed to ${isEdit ? "update" : "add"} activity:`, data.error);
      }
    } catch (error) {
      console.error(`Failed to ${isEdit ? "update" : "add"} activity:`, error);
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      const res = await fetch(`/api/kegiatan`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        fetchActivities();
      } else {
        console.error("Failed to delete activity:", data.error);
      }
    } catch (error) {
      console.error("Failed to delete activity:", error);
    }
  };

  const handleUploadSuccess = (result) => {
    setNewActivity((prevData) => ({ ...prevData, image: result.info.public_id }));
  };

  const handleEditActivity = (activity) => {
    setNewActivity({ title: activity.title, image: activity.image });
    setIsEdit(true);
    setEditActivityId(activity.id);
    setIsDrawerOpen(true);
  };

  const handleAddActivity = () => {
    setNewActivity({ title: "", image: "" });
    setIsEdit(false);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-8 p-4">
        {/* CARD ATAS */}
        <div className="flex justify-between bg-primary text-primary-foreground rounded-xl shadow-lg">
          <div className="flex justify-between flex-col p-8">
            <p>{currentDate}</p>
            <div className="flex flex-col gap-4">
              <h1 className="font-bold text-4xl">Selamat Datang, {name} !</h1>
              <p>Dapatkan Informasi terbaru di LearnWithFirdaus.com</p>
            </div>
          </div>
          <div className="flex relative">
            <img className="h-64" src="/assets/guru/College Studentt.png" alt="backpack" />
          </div>
        </div>
        {/* CARD ATAS */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* KIRI */}
          <div className="col-span-2 flex flex-col gap-8">
            <div className="flex justify-between">
              <h1 className="font-bold text-xl">Aktivitas</h1>
              {role === "ADMIN" && (
                <Button onClick={handleAddActivity} className="bg-primary text-white font-semibold rounded-xl px-4">
                  Tambah Kegiatan
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {activities.map((activity) => (
                <div key={activity.id} className="p-4 shadow-lg rounded-lg">
                  <div className="relative">
                    <img src={`https://res.cloudinary.com/dsp8lxkqu/image/upload/${activity.image}.jpg`} alt={activity.title} className="w-full h-40 object-cover rounded-lg" />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-primary to-transparent rounded-b-lg" />
                    <h2 className="absolute bottom-2 left-2 text-white font-bold">{activity.title}</h2>
                  </div>
                  {role === "ADMIN" && (
                    <div className="flex gap-2 mt-4 justify-end">
                      <Button onClick={() => handleEditActivity(activity)} className="bg-blue-500 text-white font-semibold rounded-xl px-4">
                        <EditIcon className="w-6 h-6" />
                      </Button>
                      <Button onClick={() => handleDeleteActivity(activity.id)} className="bg-red-500 text-white font-semibold rounded-xl px-4">
                        <Trash2Icon className="w-6 h-6" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div>
              <h1 className="font-bold text-xl">Laporan</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border-4 border-primary bg-purple-500/30 rounded-xl p-6 flex gap-6 items-center justify-between">
                  <div className="flex flex-col gap-6">
                    <p className="text-primary text-2xl font-bold">Laporan</p>
                    <Link href={role != "ADMIN" ? "/ortu/laporan" : "/laporan"}>
                      <Button className="bg-primary text-white font-semibold rounded-xl px-4">Lihat</Button>
                    </Link>
                  </div>
                  <img src="/assets/guru/icons/icon-computer.png" alt="com" />
                </div>
                <div className="border-4 border-primary bg-purple-500/30 rounded-xl p-6 flex gap-6 items-center justify-between">
                  <div className="flex flex-col gap-6">
                    <p className="text-primary text-2xl font-bold">Aktivitas</p>
                    <Link href={role != "ADMIN" ? "/ortu/aktivitas" : "/aktivitas"}>
                      <Button className="bg-primary text-white font-semibold rounded-xl px-4">Lihat</Button>
                    </Link>
                  </div>
                  <img src="/assets/guru/icons/icon-chart.png" alt="com" />
                </div>
              </div>
            </div>
          </div>
          {/* KIRI END */}

          {/* KANAN */}
          <div className="flex flex-col gap-8">
            <div>
              <div className="flex justify-between">
                <h1 className="text-xl font-bold">Pesan</h1>
                <Link href="/notifikasi">
                  <p className="text-primary font-bold">Lihat Semua</p>
                </Link>
              </div>
              <div className="flex gap-4 mt-4 items-center">
                <img src="/assets/guru/icons/icon-message.svg" className="bg-[#FFE0EB] rounded-xl p-4" alt="msg" />
                <div className="flex flex-col gap-2">
                  
                  <p className="font-semibold">{role === "PARENT" ? "Admin" : "Orang Tua"}</p>
                  <p className="text-gray-300">Pesan Baru!</p>
                </div>
                <Link href={"/notifikasi"}>
                  <Button className="bg-transparent text-primary border border-primary font-semibold rounded-full px-4">Baca</Button>
                </Link>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <h1 className="text-xl font-bold">Kalender Akademik</h1>
                <Link href="/kalender-akademik">
                  <p className="text-primary font-bold">Lihat Semua</p>
                </Link>
              </div>
              <div className="p-4 bg-white shadow-xl flex flex-col gap-6 rounded-xl">
                <div className="max-h-96 overflow-y-hidden flex flex-col gap-6">
                  {academicCalendar.map((event) => (
                    <div key={event.id} className="bg-purple-200 flex gap-4 rounded-xl p-4">
                      <div className="my-auto">
                        <p className="font-bold">
                          {new Date(event.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-gray-700">{event.activity}</p>
                        <p className="text-gray-500">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/kalender-akademik">
                  <h1 className="text-primary">Lihat Selengkapnya...</h1>
                </Link>
              </div>
            </div>
          </div>
          {/* KANAN END */}
        </div>
      </div>

      {/* Drawer for Adding/Updating Activity */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative bg-white w-96 p-6 shadow-lg z-50 ml-auto">
            <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Kegiatan" : "Tambah Kegiatan"}</h2>
            <form onSubmit={handleAddOrUpdateActivity} className="flex flex-col gap-4">
              <input type="text" name="title" value={newActivity.title} onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })} placeholder="Judul Kegiatan" className="border border-gray-300 rounded-md p-2" required />
              <CldUploadWidget uploadPreset="tpa_firdaus" onSuccess={handleUploadSuccess} options={{ zIndex: 9999 }}>
                {({ open }) => (
                  <Button type="button" onClick={() => open()} className="w-full p-2 border border-gray-300 rounded">
                    Upload Gambar
                  </Button>
                )}
              </CldUploadWidget>
              {newActivity.image && <img src={`https://res.cloudinary.com/dsp8lxkqu/image/upload/${newActivity.image}.jpg`} alt="Activity" className="w-full h-40 object-cover rounded-lg mt-2" />}
              <div className="flex gap-4">
                <Button type="submit" className="bg-primary text-white font-semibold rounded-xl px-4">
                  {isEdit ? "Update" : "Tambah"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setNewActivity({ title: "", image: "" });
                  }}
                  className="bg-gray-500 text-white font-semibold rounded-xl px-4"
                >
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
