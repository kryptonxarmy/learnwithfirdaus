"use client";
import React from "react";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alertdialog";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { user, loading, role } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const adminMenu = [
    { icon: "/assets/sidebar/dashboard.svg", title: "Beranda", link: "/dashboard" },
    { icon: "/assets/sidebar/data.svg", title: "Data", link: "/data" },
    { icon: "/assets/sidebar/aktivitas.svg", title: "Aktivitas", link: "/aktivitas" },
    { icon: "/assets/sidebar/laporan.svg", title: "Laporan", link: "/laporan" },
    { icon: "/assets/sidebar/dokumen.svg", title: "Dokumen", link: "/dokumen" },
    { icon: "/assets/sidebar/bantuan.svg", title: "Masukan dan Saran", link: "/masukan-saran" },
  ];

  const parentMenu = [
    { icon: "/assets/sidebar/dashboard.svg", title: "Beranda", link: "/dashboard" },
    { icon: "/assets/sidebar/data.svg", title: "Data Anak", link: "/ortu/data-anak" },
    { icon: "/assets/sidebar/aktivitas.svg", title: "Aktivitas", link: "/ortu/aktivitas" },
    { icon: "/assets/sidebar/laporan.svg", title: "Laporan", link: "/ortu/laporan" },
    { icon: "/assets/sidebar/dokumen.svg", title: "Dokumen", link: "/ortu/dokumen" },
    { icon: "/assets/sidebar/bantuan.svg", title: "Bantuan", link: "/ortu/bantuan" },
  ];

  const menu = role === "ADMIN" ? adminMenu : parentMenu;

  return (
    <div className="flex flex-col bg-primary items-center text-primary-foreground fixed h-full w-64 overflow-y-auto p-4">
      <img src="/assets/guru/icons/icon-firdaus.svg" alt="icon" className="mb-20 w-32 h-32" />
      <div className="flex flex-col gap-2 md:gap-4 lg:gap-8 xl:gap-12 flex-1">
        {loading ? (
          <div>Loading...</div>
        ) : (
          menu.map((item, index) => (
            <Link href={item.link} key={index} className="flex items-center gap-4 hover:bg-white/30 rounded-lg p-4 hover:cursor-pointer">
              <img src={item.icon} alt={item.title} className="w-6 h-6" />
              <p className="font-semibold">{item.title}</p>
            </Link>
          ))
        )}
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="flex hover:cursor-pointer items-center gap-4 mt-6">
            <img src="/assets/guru/icons/icon-logout.svg" alt="logout" className="w-6 h-6" />
            <p className="font-semibold">Keluar</p>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
            <AlertDialogDescription>Apakah Anda yakin ingin keluar?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Keluar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
