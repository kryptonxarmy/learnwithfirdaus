import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Semester() {
  const [semesters, setSemesters] = useState([]);
  const [newSemester, setNewSemester] = useState({ number: "", academicYearId: "", weeks: "" });
  const [editSemester, setEditSemester] = useState(null);
  const [isSemesterDialogOpen, setIsSemesterDialogOpen] = useState(false);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSemesters();
    fetchAcademicYears();
  }, []);

  const fetchSemesters = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/semester");
      const result = await res.json();
      if (result.success) {
        setSemesters(result.semesters);
      } else {
        console.error("Failed to fetch semesters:", result.error);
      }
    } catch (error) {
      console.error("Failed to fetch semesters:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddSemester = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/semester", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newSemester,
          number: parseInt(newSemester.number) || 0, // Ensure number is posted as an integer
          academicYearId: parseInt(newSemester.academicYearId) || 0, // Ensure academicYearId is posted as an integer
          weeks: parseInt(newSemester.weeks) || 0, // Ensure weeks is posted as an integer
        }),
      });
      const result = await res.json();
      if (result.success) {
        setSemesters([...semesters, result.semester]);
        setNewSemester({ number: "", academicYearId: "", weeks: "" });
        setIsSemesterDialogOpen(false);
      } else {
        console.error("Failed to add semester:", result.error);
      }
    } catch (error) {
      console.error("Failed to add semester:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSemester = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/semester`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editSemester,
          number: parseInt(editSemester.number) || 0, // Ensure number is posted as an integer
          academicYearId: parseInt(editSemester.academicYearId) || 0, // Ensure academicYearId is posted as an integer
          weeks: parseInt(editSemester.weeks) || 0, // Ensure weeks is posted as an integer
        }),
      });
      const result = await res.json();
      if (result.success) {
        setSemesters(semesters.map((semester) => (semester.id === editSemester.id ? result.semester : semester)));
        setEditSemester(null);
      } else {
        console.error("Failed to update semester:", result.error);
      }
    } catch (error) {
      console.error("Failed to update semester:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSemester = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/semester`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (result.success) {
        setSemesters(semesters.filter((semester) => semester.id !== id));
      } else {
        console.error("Failed to delete semester:", result.error);
      }
    } catch (error) {
      console.error("Failed to delete semester:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Semesters</h2>
      <Button onClick={() => setIsSemesterDialogOpen(true)} className="bg-primary text-white p-2 rounded mb-4">
        Add Semester
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {semesters.map((semester) => (
          <div key={semester.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">Semester {semester.number}</h3>
            <p>Academic Year: {academicYears.find((year) => year.id === semester.academicYearId)?.year}</p>
            <p>Weeks: {semester.weeks}</p>
            <div className="flex gap-2 mt-2">
              <Button onClick={() => setEditSemester(semester)} className="bg-blue-500 text-white p-2 rounded">
                Edit
              </Button>
              <Button onClick={() => handleDeleteSemester(semester.id)} className="bg-red-500 text-white p-2 rounded">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Semester Dialog */}
      <Dialog open={isSemesterDialogOpen} onOpenChange={setIsSemesterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Semester</DialogTitle>
            <DialogDescription>Enter the details for the new semester.</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <select
              value={newSemester.number}
              onChange={(e) => setNewSemester({ ...newSemester, number: e.target.value })}
              className="p-2 border rounded w-full"
            >
              <option value="">Select Semester</option>
              <option value="1">1 (ganjil)</option>
              <option value="2">2 (genap)</option>
            </select>
            <select
              value={newSemester.academicYearId}
              onChange={(e) => setNewSemester({ ...newSemester, academicYearId: e.target.value })}
              className="p-2 border rounded w-full mt-2"
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year}
                </option>
              ))}
            </select>
            <Input
              type="text"
              placeholder="Weeks"
              value={newSemester.weeks}
              onChange={(e) => setNewSemester({ ...newSemester, weeks: e.target.value })}
              className="p-2 border rounded w-full mt-2"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddSemester} className="bg-primary text-white p-2 rounded mt-2">
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Semester Form */}
      {editSemester && (
        <div className="mt-6">
          <h2 className="text-lg font-bold">Edit Semester</h2>
          <select
            value={editSemester.number}
            onChange={(e) => setEditSemester({ ...editSemester, number: e.target.value })}
            className="p-2 border rounded w-full"
          >
            <option value="">Select Semester</option>
            <option value="1">1 (ganjil)</option>
            <option value="2">2 (genap)</option>
          </select>
          <select
            value={editSemester.academicYearId}
            onChange={(e) => setEditSemester({ ...editSemester, academicYearId: e.target.value })}
            className="p-2 border rounded w-full mt-2"
          >
            <option value="">Select Academic Year</option>
            {academicYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.year}
              </option>
            ))}
          </select>
          <Input
            type="text"
            placeholder="Weeks"
            value={editSemester.weeks}
            onChange={(e) => setEditSemester({ ...editSemester, weeks: e.target.value })}
            className="p-2 border rounded w-full mt-2"
          />
          <Button onClick={handleEditSemester} className="bg-primary text-white p-2 rounded mt-2">
            Update
          </Button>
        </div>
      )}
    </div>
  );
}