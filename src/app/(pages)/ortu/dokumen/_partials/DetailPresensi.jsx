import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

export default function DetailPresensi({ data, onBack }) {
  if (!data) {
    return <div>Loading...</div>;
  }

  const isPresent = data.status === "present";

  return (
    <div>
      <h1 className="text-2xl font-bold">Detail Presensi</h1>
      <div className="mt-6">
        <div className="mb-4">
          <label htmlFor="namaAnak" className="block text-sm font-medium text-gray-700">
            Nama Anak
          </label>
          <Input type="text" name="namaAnak" id="namaAnak" value={data.child?.name || ""} readOnly className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        </div>
        <div className="flex justify-between mb-4">
          <div className="w-1/2 pr-2">
            <label htmlFor="kehadiran" className="block text-sm font-medium text-gray-700">
              Kehadiran
            </label>
            <Input type="text" name="kehadiran" id="kehadiran" value={isPresent ? "Hadir" : data.status === "excused" ? "Sakit" : "Alpa"} readOnly className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
          </div>
          <div className="w-1/2 pl-2">
            <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">
              Tanggal
            </label>
            <Input type="date" name="tanggal" id="tanggal" value={data.date ? new Date(data.date).toISOString().split("T")[0] : ""} readOnly className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
          </div>
        </div>
        <div className="flex justify-between gap-4 mb-4">
          <div className="w-1/2 bg-gradient-to-br from-purple-200 to-purple-100 px-8 py-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-2">PENGANTAR</h2>
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Nama Pengantar</p>
                <p className="mb-2">{isPresent ? data.pengantar : "-"}</p>
              </div>
              <p className="text-3xl font-bold">{isPresent ? (data.arrivalTime ? data.arrivalTime : "-") : "-"}</p>
            </div>
          </div>
          <div className="w-1/2 pl-2 bg-gradient-to-br from-purple-200 to-purple-100 px-8 py-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-2">PENJEMPUT</h2>
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Nama Penjemput</p>
                <p className="mb-2">{isPresent ? data.penjemput : "-"}</p>
              </div>
              <p className="text-3xl font-bold">{isPresent ? (data.departureTime ? data.departureTime : "-") : "-"}</p>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
            Keterangan
          </label>
          <Input type="text" name="remarks" id="remarks" value={data.remarks || ""} readOnly className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        </div>
        <div className="mt-4">
          <Button onClick={onBack}>Kembali</Button>
        </div>
      </div>
    </div>
  );
}