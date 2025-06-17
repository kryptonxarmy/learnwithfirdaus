import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import LaporanPerkembangan from "./_partials/LaporanPerkembangan";
import DetailPerkembangan from "./_partials/DetailPerkembangan";

export default function page() {
  return (
    <div>
      <div className="">
                <Tabs defaultValue="Laporan Perkembangan Anak" className="w-full mt-4">
          <TabsList className="bg-gray-100 rounded-xl p-1 flex gap-2 shadow-inner w-fit mb-6">
            <TabsTrigger
              value="Laporan Perkembangan Anak"
              className="transition-all px-6 py-2 rounded-lg font-semibold text-gray-700 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Laporan Perkembangan Anak
            </TabsTrigger>
            <TabsTrigger
              value="Detail Perkembangan"
              className="transition-all px-6 py-2 rounded-lg font-semibold text-gray-700 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Detail Perkembangan
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Laporan Perkembangan Anak">
            <LaporanPerkembangan />
          </TabsContent>
          <TabsContent value="Detail Perkembangan">
            <DetailPerkembangan />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
