import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Class() {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({ name: "", ageGroup: "", semesterId: "" });
  const [editClass, setEditClass] = useState(null);
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchSemesters();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/class");
      const result = await res.json();
      if (result.success) {
        setClasses(result.classes);
      } else {
        console.error("Failed to fetch classes:", result.error);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddClass = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newClass, semesterId: parseInt(newClass.semesterId) }),
      });
      const result = await res.json();
      if (result.success) {
        setClasses([...classes, result.class]);
        setNewClass({ name: "", ageGroup: "", semesterId: "" });
        setIsClassDialogOpen(false);
      } else {
        console.error("Failed to add class:", result.error);
      }
    } catch (error) {
      console.error("Failed to add class:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClass = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/class`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...editClass, semesterId: parseInt(editClass.semesterId) }),
      });
      const result = await res.json();
      if (result.success) {
        setClasses(classes.map((cls) => (cls.id === editClass.id ? result.class : cls)));
        setEditClass(null);
      } else {
        console.error("Failed to update class:", result.error);
      }
    } catch (error) {
      console.error("Failed to update class:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/class`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (result.success) {
        setClasses(classes.filter((cls) => cls.id !== id));
      } else {
        console.error("Failed to delete class:", result.error);
      }
    } catch (error) {
      console.error("Failed to delete class:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Classes</h2>
      <Button onClick={() => setIsClassDialogOpen(true)} className="bg-primary text-white p-2 rounded mb-4">
        Add Class
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">{cls.name}</h3>
            <p>Age Group: {cls.ageGroup}</p>
            <p>Semester: {semesters.find((sem) => sem.id === cls.semesterId)?.number}</p>
            <div className="flex gap-2 mt-2">
              <Button onClick={() => setEditClass(cls)} className="bg-blue-500 text-white p-2 rounded">
                Edit
              </Button>
              <Button onClick={() => handleDeleteClass(cls.id)} className="bg-red-500 text-white p-2 rounded">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Class Dialog */}
      <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Class</DialogTitle>
            <DialogDescription>Enter the details for the new class.</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Input
              type="text"
              placeholder="Class Name"
              value={newClass.name}
              onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
              className="p-2 border rounded w-full"
            />
            <Input
              type="text"
              placeholder="Age Group"
              value={newClass.ageGroup}
              onChange={(e) => setNewClass({ ...newClass, ageGroup: e.target.value })}
              className="p-2 border rounded w-full mt-2"
            />
            <select
              value={newClass.semesterId}
              onChange={(e) => setNewClass({ ...newClass, semesterId: parseInt(e.target.value) })}
              className="p-2 border rounded w-full mt-2"
            >
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  Semester {semester.number}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button onClick={handleAddClass} className="bg-primary text-white p-2 rounded mt-2">
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Class Form */}
      {editClass && (
        <div className="mt-6">
          <h2 className="text-lg font-bold">Edit Class</h2>
          <Input
            type="text"
            placeholder="Class Name"
            value={editClass.name}
            onChange={(e) => setEditClass({ ...editClass, name: e.target.value })}
            className="p-2 border rounded w-full mt-2"
          />
          <Input
            type="text"
            placeholder="Age Group"
            value={editClass.ageGroup}
            onChange={(e) => setEditClass({ ...editClass, ageGroup: e.target.value })}
            className="p-2 border rounded w-full mt-2"
          />
          <select
            value={editClass.semesterId}
            onChange={(e) => setEditClass({ ...editClass, semesterId: parseInt(e.target.value) })}
            className="p-2 border rounded w-full mt-2"
          >
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                Semester {semester.number}
              </option>
            ))}
          </select>
          <Button onClick={handleEditClass} className="bg-primary text-white p-2 rounded mt-2">
            Update
          </Button>
        </div>
      )}
    </div>
  );
}