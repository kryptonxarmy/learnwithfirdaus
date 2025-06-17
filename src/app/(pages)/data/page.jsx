import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex gap-12 justify-center items-center">
      <div className="flex flex-col justify-around border-2 border-primary h-[80vh] p-16 rounded-xl bg-[#DBCFF3]">
        <h1 className="font-bold text-2xl text-primary text-center">DAFTAR ANAK</h1>
        <img src="/assets/guru/anak.png" alt="anak" />
        <div className="w-full flex justify-center items-center">
          <Link href="/data/daftar-anak">
            <Button className="bg-primary w-full text-white font-semibold rounded-xl px-4">Lihat</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col justify-around border-2 border-primary h-[80vh] p-16 rounded-xl bg-[#DBCFF3]">
        <h1 className="font-bold text-2xl text-primary text-center">DAFTAR GURU</h1>
        <img src="/assets/guru/guru.png" alt="guru" />
        <div className="w-full flex justify-center items-center">
          <Link href="/data/daftar-guru">
            <Button className="bg-primary text-white font-semibold rounded-xl px-4">Lihat</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
