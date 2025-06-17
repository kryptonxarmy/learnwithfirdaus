"use client";

import DropZone from "@/components/DropZone";
import { ArrowRight, School, Timer, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import Detail from "./components/Detail";
import ModalLearningModule from "./components/ModalLearningModule";
import { Toaster } from "@/components/ui/toast";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCldImageUrl } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Aktivitas() {
  const [isSelengkapnyaClicked, setIsSelengkapnyaClicked] = useState(false);
  const [learningModules, setLearningModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchLearningModule();
  }, []);

  useEffect(() => {
    if (selectedModuleId) {
      const module = learningModules.find((module) => module.id === parseInt(selectedModuleId));
      setSelectedModule(module);
    }
  }, [selectedModuleId, learningModules]);

  const fetchLearningModule = async () => {
    try {
      const res = await fetch("/api/learningModule");
      const data = await res.json();
      if (data.success) {
        setLearningModules(data.learningModules);
        setSelectedModuleId(data.learningModules[0]?.id.toString() || "");
      } else {
        console.error("Failed to fetch Learning Module:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch Learning Module:", error);
    }
  };

  const handleImageClicked = (public_id) => {
    window.open(`https://res.cloudinary.com/dsp8lxkqu/image/upload/v1737181752/${public_id}.jpg`, '_blank');
  };

  const handleSelengkapnyaClick = () => {
    if (!selectedModule) {
      setIsAlertOpen(true);
    } else {
      setIsSelengkapnyaClicked(!isSelengkapnyaClicked);
    }
  };

  const items = [
    {
      title: "Modul Ajar",
      desc: selectedModule ? selectedModule.title : "Tidak ada data",
      icon: User,
    },
    {
      title: "Alokasi Waktu",
      desc: selectedModule ? `${selectedModule.durationWeeks} minggu` : "Tidak ada data",
      icon: Timer,
    },
    {
      title: "Semester",
      desc: selectedModule ? `Semester ${selectedModule.semester.number}` : "Tidak ada data",
      icon: School,
    },
  ];

  return (
    <>
      <Toaster />
      <div className="flex flex-col gap-8">
        <div className="flex justify-around">
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
        <div className="flex flex-col gap-4">
          <label htmlFor="module-select" className="text-lg font-bold">Pilih Modul Ajar:</label>
          <select
            id="module-select"
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            className="p-2 border rounded"
          >
            {learningModules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.title}
              </option>
            ))}
          </select>
        </div>
        {isSelengkapnyaClicked ? (
          <Detail data={selectedModule} />
        ) : (
          <>
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">Peta Konsep</h1>
              <Link href="/aktivitas/tambah-modul-ajar">
                <Button className="bg-primary text-white">Atur Modul Ajar</Button>
              </Link>
              <div>
                {selectedModule && selectedModule.conceptMap ? (
                  <div className="w-full h-64 overflow-hidden" onClick={() => handleImageClicked(selectedModule.conceptMap)}>
                    <img
                      src={getCldImageUrl({
                        src: selectedModule.conceptMap,
                        width: 640,
                        height: 400,
                      })}
                      alt="Concept Map"
                      className="mt-2 w-full h-auto"
                    />
                  </div>
                ) : (
                  <p>Peta konsep belum ditambahkan</p>
                )}
              </div>
            </div>

            <div className="flex justify-around gap-4">
              <div className="flex flex-col p-4 2xl:flex-1 2xl:h-96 2xl:p-10 gap-4 bg-[#E2D4F780] rounded-xl">
                <h1 className="text-lg text-primary font-semibold 2xl:text-2xl text-center">
                  PROFIL PELAJAR PANCASILA YANG BERKAITAN
                </h1>
                <div dangerouslySetInnerHTML={{ __html: selectedModule ? selectedModule.pancasilaDesc : "Belum ada data, harap memilih Modul ajar/menambahkannya terlebih dahulu" }} />
              </div>
              <div className="flex flex-col p-4 2xl:flex-1 2xl:h-96 2xl:p-10 gap-4 bg-[#E2D4F780] rounded-xl">
                <h1 className="text-lg text-primary font-semibold 2xl:text-2xl text-center">
                  SARANA DAN PRASARANA
                </h1>
                <div dangerouslySetInnerHTML={{ __html: selectedModule ? selectedModule.facilityDesc : "Belum ada data, harap memilih Modul ajar/menambahkannya terlebih dahulu" }} />
              </div>
            </div>
            <p
              onClick={handleSelengkapnyaClick}
              className={`flex self-end gap-4 text-primary font-bold hover:cursor-pointer ${!selectedModule ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Lihat Selengkapnya <ArrowRight />{" "}
            </p>
          </>
        )}
      </div>

      {/* Alert Modal */}
      <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alert</DialogTitle>
            <DialogDescription>
              Anda belum memilih modul ajar. Harap pilih terlebih dahulu.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsAlertOpen(false)} className="bg-primary text-white p-2 rounded mt-2">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}