import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CapaianPembelajaran from "./_partials/CapaianPembelajaran";
import TujuanKegiatan from "./_partials/TujuanKegiatan";
import KegiatanInti from "./_partials/KegiatanInti";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Detail({ data }) {
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div className="">
      <Button onClick={() => window.location.reload()} className="bg-primary px-4 text-white">
        Kembali
      </Button>
      <Tabs defaultValue="Capaian Pembelajaran" className="w-full mt-4">
        <TabsList className="bg-gray-100 rounded-xl p-1 flex gap-2 shadow-inner w-fit mb-6">
          <TabsTrigger
            value="Capaian Pembelajaran"
            className="transition-all px-6 py-2 rounded-lg font-semibold text-gray-700 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Capaian Pembelajaran
          </TabsTrigger>
          <TabsTrigger
            value="Tujuan Kegiatan"
            className="transition-all px-6 py-2 rounded-lg font-semibold text-gray-700 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Tujuan Kegiatan
          </TabsTrigger>
          <TabsTrigger
            value="Kegiatan Inti"
            className="transition-all px-6 py-2 rounded-lg font-semibold text-gray-700 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Kegiatan Inti
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Capaian Pembelajaran">
          <CapaianPembelajaran data={data} />
        </TabsContent>
        <TabsContent value="Tujuan Kegiatan">
          <TujuanKegiatan data={data.description} />
        </TabsContent>
        <TabsContent value="Kegiatan Inti">
          <KegiatanInti data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
