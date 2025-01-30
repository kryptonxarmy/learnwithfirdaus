"use client";

import React, { useEffect, useState } from "react";
import AddActivityModal from "./_partials/AddActivtyModal";
import Calendar from "./_partials/Calendar";
import { Check, Trash } from "lucide-react";
import useUser from "@/hooks/useUser";

export default function Page() {
  const { name, role } = useUser();
  const [activities, setActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      const res = await fetch("/api/admin/kalenderAkademik");
      const data = await res.json();
      if (data.success) {
        setActivities(data.academicCalendar);
      } else {
        console.error("Failed to fetch activities:", data.message);
      }
    };
    fetchActivities();
  }, []);

  const addActivity = async (activity) => {
    try {
      const res = await fetch("/api/admin/kalenderAkademik", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activity),
      });
      const newActivity = await res.json();
      setActivities((prevActivities) => [...prevActivities, newActivity.academicCalendar]);
    } catch (error) {
      console.error("Failed to add activity:", error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const activity = activities.find((activity) => activity.id === id);
      const res = await fetch(`/api/admin/kalenderAkademik`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, completed: !activity.completed }),
      });
      const updatedActivity = await res.json();
      if (updatedActivity.success) {
        setActivities((prevActivities) => prevActivities.map((activity) => (activity.id === id ? { ...activity, completed: !activity.completed } : activity)));
      } else {
        console.error("Failed to update activity:", updatedActivity.message);
      }
    } catch (error) {
      console.error("Failed to update activity:", error);
    }
  };

  const deleteActivity = async (id) => {
    try {
      const res = await fetch(`/api/admin/kalenderAkademik`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setActivities((prevActivities) => prevActivities.filter((activity) => activity.id !== id));
      } else {
        console.error("Failed to delete activity:", data.message);
      }
    } catch (error) {
      console.error("Failed to delete activity:", error);
    }
  };

  return (
    <div className="flex">
      <div className="w-[65%]">
        <Calendar activities={activities} />
      </div>
      <div className="flex flex-col h-screen justify-between">
        <div>
          <h1 className="text-xl mb-4 font-bold">List Aktivitas</h1>
          <div className="flex flex-col gap-4">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-purple-200 flex gap-4 rounded-xl p-4">
                <div
                  className={`border-2 border-primary my-auto w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer transition-colors
                    ${activity.completed ? "bg-primary" : "bg-transparent"}`}
                  onClick={() => toggleComplete(activity.id)}
                  style={{ pointerEvents: role === "PARENT" ? "none" : "auto" }}
                >
                  {activity.completed && <Check className="text-white" />}
                </div>
                <div className="my-auto">
                  <p className="text-primary text-sm">
                    {new Date(activity.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-gray-700 font-bold">{activity.activity}</p>
                  <p className="text-gray-500">{activity.description}</p>
                </div>
                {role !== "PARENT" && (
                  <div className="ml-auto my-auto cursor-pointer" onClick={() => deleteActivity(activity.id)}>
                    <Trash className="text-red-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {role !== "PARENT" && ( // Sembunyikan tombol jika role adalah parent
          <button className="bg-blue-500 text-white p-2 rounded" onClick={() => setIsModalOpen(true)}>
            Tambah Aktivitas
          </button>
        )}
      </div>
      <AddActivityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addActivity} />
    </div>
  );
}