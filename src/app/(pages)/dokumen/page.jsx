"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GaleriKegiatan from "./components/GaleriKegiatan";
import DaftarMenuMakanan from "./components/DaftarMenuMakanan";

export default function Page() {
  return (
    <div className="">
      <Tabs defaultValue="Galeri Kegiatan" className="w-full mt-4">
        <TabsList className="bg-gray-100 rounded-xl p-1 flex gap-2 shadow-inner w-fit mb-6">
          <TabsTrigger
            value="Galeri Kegiatan"
            className="transition-all px-6 py-2 rounded-lg font-semibold text-gray-700 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Galeri Kegiatan
          </TabsTrigger>
          <TabsTrigger
            value="Daftar Menu Makan"
            className="transition-all px-6 py-2 rounded-lg font-semibold text-gray-700 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Daftar Menu Makan
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Galeri Kegiatan">
          <GaleriKegiatan />
        </TabsContent>
        <TabsContent value="Daftar Menu Makan">
          <DaftarMenuMakanan />
        </TabsContent>
      </Tabs>
    </div>
  );
}
