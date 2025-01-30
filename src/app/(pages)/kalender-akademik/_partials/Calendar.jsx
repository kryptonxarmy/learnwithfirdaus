'use client';

import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Calendar = ({ activities }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weeks = [];
  let currentWeek = [];

  allDays.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getEventsForDate = (date) => {
    return activities.filter((activity) => new Date(activity.date).toDateString() === date.toDateString());
  };

  const getEventColor = (color) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="mx-auto p-6">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
            <div className="flex items-center space-x-2">
              <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-gray-100 rounded-md">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-gray-100 rounded-md">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-px">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-sm text-gray-500 text-center py-2">
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar grid */}
        <div className="border-gray-200">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
              {week.map((day, dayIndex) => {
                const dayEvents = getEventsForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);

                return (
                  <div key={dayIndex} className={`min-h-[120px] border-r last:border-r-0 p-1 ${!isCurrentMonth ? 'bg-gray-50' : ''} ${isToday(day) ? 'bg-blue-50' : ''}`}>
                    {/* Date number */}
                    <div className="flex items-center justify-between p-1">
                      <span className={`text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isToday(day) ? 'font-bold' : ''}`}>{format(day, 'd')}</span>
                      <button onClick={() => setIsModalOpen(true)} className="invisible group-hover:visible p-1 hover:bg-gray-100 rounded-full">
                        <Plus className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    {/* Events */}
                    <div className="space-y-1">
                      {dayEvents.map((event) => (
                        <TooltipProvider key={event.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={`px-2 py-1 text-xs rounded-md border ${getEventColor(event.color)} cursor-pointer truncate`}>{event.activity}</div>
                            </TooltipTrigger>
                            <TooltipContent side="top">{event.activity}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;