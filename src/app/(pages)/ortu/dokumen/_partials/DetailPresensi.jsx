import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

function formatTime(timeStr) {
  if (!timeStr) return "-";
  if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  if (timeStr.includes(" ")) {
    const [, time] = timeStr.split(" ");
    return time ? time.slice(0, 5) : "-";
  }
  if (timeStr.length >= 5) return timeStr.slice(0, 5);
  return timeStr;
}

export default function DetailPresensi({ data, onBack }) {
  if (!data) {
    return <div>Loading...</div>;
  }

  const isPresent = data.status === "present";

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-6">
      <h1 className="text-2xl font-bold text-primary mb-6 text-center">Detail Presensi</h1>
      <div className="mb-4">
        <label htmlFor="namaAnak" className="block text-sm font-medium text-gray-700 mb-1">
          Nama Anak
        </label>
        <Input
          type="text"
          name="namaAnak"
          id="namaAnak"
          value={data.child?.name || ""}
          readOnly
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label htmlFor="kehadiran" className="block text-sm font-medium text-gray-700 mb-1">
            Kehadiran
          </label>
          <Input
            type="text"
            name="kehadiran"
            id="kehadiran"
            value={isPresent ? "Hadir" : data.status === "excused" ? "Sakit" : "Alpa"}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal
          </label>
          <Input
            type="date"
            name="tanggal"
            id="tanggal"
            value={data.date ? new Date(data.date).toISOString().split("T")[0] : ""}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 bg-gradient-to-br from-purple-200 to-purple-100 px-6 py-4 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-2 text-primary">Pengantar</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">Nama Pengantar</p>
              <p className="mb-2">{isPresent ? data.pengantar : "-"}</p>
            </div>
            <p className="text-3xl font-bold text-primary">
              {isPresent ? formatTime(data.arrivalTime) : "-"}
            </p>
          </div>
        </div>
        <div className="flex-1 bg-gradient-to-br from-purple-200 to-purple-100 px-6 py-4 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-2 text-primary">Penjemput</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">Nama Penjemput</p>
              <p className="mb-2">{isPresent ? data.penjemput : "-"}</p>
            </div>
            <p className="text-3xl font-bold text-primary">
              {isPresent ? formatTime(data.departureTime) : "-"}
            </p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
          Keterangan
        </label>
        <Input
          type="text"
          name="remarks"
          id="remarks"
          value={data.remarks || ""}
          readOnly
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
        />
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onBack} className="bg-primary text-white font-semibold rounded-xl px-6 py-2">
          Kembali
        </Button>
      </div>
    </div>
  );
}