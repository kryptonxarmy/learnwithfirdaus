"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Stepper from "../../../[id]/Stepper";



const categoryOptions = ["Kepekaan Panca Indra", "Motorik Kasar", "Motorik Halus", "Kemampuan Berkomunikasi", "Reaksi Emosi dan Interaksi Sosial", "Kemampuan Kognitif"];

export default function DetailPerkembangan() {
  const { id } = useParams();
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [progressDetails, setProgressDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const steps = ["Belum Berkembang", "Sedang Berkembang", "Berkembang Baik"];
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    subDetails: [{ subCategory: "", status: "" }],
  });
  const [progressId, setProgressId] = useState(null);

  useEffect(() => {
    fetchProgressId();
    fetchProgressDetails();
  }, [id]);

  const fetchProgressId = async () => {
    try {
      const res = await fetch(`/api/admin/laporan/laporanPerkembangan?childId=${id}`);
      const data = await res.json();
      if (data.success && data.progress.length > 0) {
        setProgressId(data.progress[0].id);
      } else {
        console.error("Failed to fetch progress ID:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch progress ID:", error);
    }
  };

  const fetchProgressDetails = async () => {
    try {
      const res = await fetch(`/api/admin/laporan/detailPerkembangan?childId=${id}`);
      const data = await res.json();
      
      // Debug response
      console.log('Progress Details Response:', data);
      
      if (data.success) {
        // Ubah ini sesuai struktur response baru
        setProgressDetails(data.progressDetails || []);
      } else {
        console.error("Failed to fetch progress details:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch progress details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value) => {
    setFormData({
      ...formData,
      category: value,
      subDetails: [{ subCategory: "", status: "" }],
    });
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith("subCategory") || name.startsWith("status")) {
      const subDetails = [...formData.subDetails];
      subDetails[index][name] = value;
      setFormData({ ...formData, subDetails });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddSubDetail = () => {
    setFormData({
      ...formData,
      subDetails: [...formData.subDetails, { subCategory: "", status: "" }],
    });
  };

  const handleRemoveSubDetail = (index) => {
    const subDetails = [...formData.subDetails];
    subDetails.splice(index, 1);
    setFormData({ ...formData, subDetails });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!progressId) {
      console.error("Progress ID is not available");
      return;
    }
    try {
      const res = await fetch("/api/admin/laporan/detailPerkembangan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, progressId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProgressDetails();
        setIsAddDialogOpen(false);
      } else {
        console.error("Failed to add progress detail:", data.message);
      }
    } catch (error) {
      console.error("Failed to add progress detail:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/laporan/detailPerkembangan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, id: selectedDetail.id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProgressDetails();
        setIsEditDialogOpen(false);
      } else {
        console.error("Failed to update progress detail:", data.message);
      }
    } catch (error) {
      console.error("Failed to update progress detail:", error);
    }
  };

  const handleDelete = async (detailId) => {
    try {
      const res = await fetch("/api/admin/laporan/detailPerkembangan", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: detailId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProgressDetails();
      } else {
        console.error("Failed to delete progress detail:", data.message);
      }
    } catch (error) {
      console.error("Failed to delete progress detail:", error);
    }
  };

  const handleViewDetail = (detail) => {
    if (selectedDetail && selectedDetail.id === detail.id) {
      setSelectedDetail(null);
    } else {
      setSelectedDetail(detail);
    }
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setFormData({
      category: "",
      subDetails: [{ subCategory: "", status: "" }],
    });
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedDetail(null);
    setFormData({
      category: "",
      subDetails: [{ subCategory: "", status: "" }],
    });
  };

  const availableCategories = categoryOptions.filter((category) => !progressDetails.some((detail) => detail.category === category));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mt-6 flex flex-col gap-6">
        <h1 className="text-xl font-bold">Detail Perkembangan</h1>
        {progressDetails && progressDetails.length > 0 ? (
          progressDetails.map((item) => (
            <div key={item.id} className="flex flex-col w-full">
              <div className="flex justify-between items-center">
                <h1 className="text-bold text-xl">{item.category}</h1>
                <div className="flex gap-2">
                  <Button onClick={() => handleViewDetail(item)} className="bg-blue-500 text-white px-6 rounded-xl">
                    {selectedDetail && selectedDetail.id === item.id ? "Sembunyikan Detail" : "Lihat Detail"}
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedDetail(item);
                      setFormData({
                        category: item.category,
                        subDetails: item.subDetails.map((sub) => ({ subCategory: sub.subCategory, status: sub.status })),
                      });
                      setIsEditDialogOpen(true);
                    }}
                    className="bg-primary text-white px-6 rounded-xl"
                  >
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-6 rounded-xl">
                    Delete
                  </Button>
                </div>
              </div>
              {selectedDetail && selectedDetail.id === item.id && (
                <div className="mt-4">
                  {/* {item.subDetails.map((subDetail, index) => (
                    <div key={index} className="flex flex-col border-2 border-gray-300 p-3 rounded-xl shadow- mb-4">
                      <p className="font-semibold">{subDetail.subCategory}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2 relative">
                          <div className={`w-8 h-8 rounded-full border-2 ${subDetail.status === "Belum Berkembang" ? "bg-primary border-primary" : "border-primary"}`}></div>
                          <div className="absolute left-4 top-4 w-8 h-8 border-t-2 border-primary"></div>
                          <span className="absolute left-0 top-10 text-xs">Belum Berkembang</span>
                        </div>
                        <div className="flex items-center gap-2 relative">
                          <div className={`w-8 h-8 rounded-full border-2 ${subDetail.status === "Sedang Berkembang" ? "bg-primary border-primary" : "border-primary"}`}></div>
                          <div className="absolute left-4 top-4 w-8 h-8 border-t-2 border-primary"></div>
                          <span className="absolute left-0 top-10 text-xs">Sedang Berkembang</span>
                        </div>
                        <div className="flex items-center gap-2 relative">
                          <div className={`w-8 h-8 rounded-full border-2 ${subDetail.status === "Berkembang Baik" ? "bg-primary border-primary" : "border-primary"}`}></div>
                          <span className="absolute left-0 top-10 text-xs">Berkembang Baik</span>
                        </div>
                      </div>
                    </div>
                  ))} */}
                  {item.subDetails.map((subDetail, index) => {
                    const currentStep = steps.indexOf(subDetail.status);
                    return (
                      <div key={index} className="flex flex-col border-2 border-gray-300 p-3 rounded-xl shadow- mb-4">
                        <p className="font-semibold">{subDetail.subCategory}</p>
                        <div className="mt-4">
                          <Stepper steps={steps} currentStep={currentStep} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No details available</p>
        )}
      </div>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
            Add Progress Detail
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Progress Detail</DialogTitle>
            <DialogDescription>Fill in the form below to add a progress detail.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select name="category" value={formData.category} onValueChange={handleCategoryChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.subDetails.map((subDetail, index) => (
                <div key={index} className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor={`subCategory-${index}`}>Sub Category</Label>
                    <Input id={`subCategory-${index}`} name="subCategory" type="text" value={subDetail.subCategory} onChange={(e) => handleInputChange(e, index)} required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold text-lg" htmlFor={`status-${index}`}>
                      Status
                    </Label>
                    <Select name="status" value={subDetail.status} onValueChange={(value) => handleInputChange({ target: { name: "status", value } }, index)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Belum Berkembang">Belum Berkembang</SelectItem>
                        <SelectItem value="Sedang Berkembang">Sedang Berkembang</SelectItem>
                        <SelectItem value="Berkembang Baik">Berkembang Baik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="button" onClick={() => handleRemoveSubDetail(index)} className="mt-2 bg-red-500 text-white">
                    Remove Sub Detail
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={handleAddSubDetail} className="mt-2">
                Add Sub Detail
              </Button>
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Progress Detail</DialogTitle>
            <DialogDescription>Fill in the form below to edit the progress detail.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select name="category" value={formData.category} disabled>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              {formData.subDetails.map((subDetail, index) => (
                <div key={index} className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor={`subCategory-${index}`}>Sub Category</Label>
                    <Input id={`subCategory-${index}`} name="subCategory" type="text" value={subDetail.subCategory} onChange={(e) => handleInputChange(e, index)} required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold text-lg" htmlFor={`status-${index}`}>
                      Status
                    </Label>
                    <Select name="status" value={subDetail.status} onValueChange={(value) => handleInputChange({ target: { name: "status", value } }, index)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Belum Berkembang">Belum Berkembang</SelectItem>
                        <SelectItem value="Sedang Berkembang">Sedang Berkembang</SelectItem>
                        <SelectItem value="Berkembang Baik">Berkembang Baik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="button" onClick={() => handleRemoveSubDetail(index)} className="mt-2 bg-red-500 text-white">
                    Remove Sub Detail
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={handleAddSubDetail} className="mt-2">
                Add Sub Detail
              </Button>
            </div>
            <DialogFooter>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
