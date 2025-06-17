"use client";

import React, { useState, useEffect } from "react";
import { Separator } from "@radix-ui/react-separator";
import { ArrowRight, Image } from "lucide-react";
import Link from "next/link";

export default function GaleriKegiatan() {
  const [documents, setDocuments] = useState([]);

  const ensureUrlHasScheme = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `http://${url}`;
    }
    return url;
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/admin/document/galeriKegiatan");
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents);
      } else {
        console.error("Failed to fetch documents:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };
  return (
       <div className="p-6">
      <h1 className="text-lg font-bold text-primary mb-4 mt-8">Galeri Kegiatan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col justify-between bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition p-6 h-[48vh] max-w-xl"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 rounded-full w-16 h-16 flex justify-center items-center shadow bg-primary">
                <Image className="text-white w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-primary text-center">{doc.title}</h2>
            </div>
            <Separator className="my-3" />
            <div className="flex gap-2 justify-center items-center mb-4">
              <a
                href={ensureUrlHasScheme(doc.link)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline transition"
              >
                Lihat Selengkapnya
              </a>
              <ArrowRight className="text-primary" />
            </div>
            {/* Optional: Tambahkan tombol aksi jika diperlukan */}
            {/* <div className="flex gap-2">
              <Button
                onClick={() => handleEdit(doc)}
                className="bg-primary text-white font-semibold rounded-xl px-4 flex-1"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(doc.id)}
                className="bg-red-500 text-white font-semibold rounded-xl px-4 flex-1"
              >
                Delete
              </Button>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
