import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function AcademicYear() {
  const [academicYears, setAcademicYears] = useState([]);
  const [newAcademicYear, setNewAcademicYear] = useState({ year: "" });
  const [editAcademicYear, setEditAcademicYear] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academicYear");
      const result = await res.json();
      if (result.success) {
        setAcademicYears(result.academicYears);
      } else {
        console.error("Failed to fetch academic years:", result.error);
      }
    } catch (error) {
      console.error("Failed to fetch academic years:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAcademicYear = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academicYear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAcademicYear),
      });
      const result = await res.json();
      if (result.success) {
        setAcademicYears([...academicYears, result.academicYear]);
        setNewAcademicYear({ year: "" });
        setIsDialogOpen(false);
      } else {
        console.error("Failed to add academic year:", result.error);
      }
    } catch (error) {
      console.error("Failed to add academic year:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAcademicYear = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academicYear", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editAcademicYear),
      });
      const result = await res.json();
      if (result.success) {
        setAcademicYears(
          academicYears.map((year) =>
            year.id === editAcademicYear.id ? result.academicYear : year
          )
        );
        setEditAcademicYear(null);
      } else {
        console.error("Failed to update academic year:", result.error);
      }
    } catch (error) {
      console.error("Failed to update academic year:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAcademicYear = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/academicYear/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        setAcademicYears(academicYears.filter((year) => year.id !== id));
      } else {
        console.error("Failed to delete academic year:", result.error);
      }
    } catch (error) {
      console.error("Failed to delete academic year:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Academic Years</h1>
      {loading && <div className="loader"></div>}
      {/* <Button onClick={() => setIsDialogOpen(true)} className="bg-primary text-white p-2 rounded mb-4">
        Add Academic Year
      </Button> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {academicYears.map((year) => (
          <div key={year.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">{year.year}</h3>
            <div className="flex gap-2 mt-2">
              <Button onClick={() => setEditAcademicYear(year)} className="bg-blue-500 text-white p-2 rounded">
                Edit
              </Button>
              <Button onClick={() => handleDeleteAcademicYear(year.id)} className="bg-red-500 text-white p-2 rounded">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary text-white p-2 rounded mt-6">Add Academic Year</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Academic Year</DialogTitle>
            <DialogDescription>Enter the year for the new academic year.</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Input
              type="text"
              placeholder="Year"
              value={newAcademicYear.year}
              onChange={(e) => setNewAcademicYear({ ...newAcademicYear, year: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddAcademicYear} className="bg-primary text-white p-2 rounded mt-2">
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editAcademicYear && (
        <div className="mt-6">
          <h2 className="text-lg font-bold">Edit Academic Year</h2>
          <Input
            type="text"
            placeholder="Year"
            value={editAcademicYear.year}
            onChange={(e) => setEditAcademicYear({ ...editAcademicYear, year: e.target.value })}
            className="p-2 border rounded w-full"
          />
          <Button onClick={handleEditAcademicYear} className="bg-primary text-white p-2 rounded mt-2">
            Update
          </Button>
        </div>
      )}
    </div>
  );
}