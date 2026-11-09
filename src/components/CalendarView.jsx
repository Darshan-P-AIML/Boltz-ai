import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from './Icons';

export default function CalendarView({ hackathons, onSelectHackathon }) {
  const [currentMonth, setCurrentMonth] = useState(9); // October 2026 (0-indexed: 9 = Oct)
  const currentYear = 2026;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Helper to map hackathons to day numbers and event types
  const getEventsForDay = (day) => {
    const formattedDay = String(day).padStart(2, '0');
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const targetDateStr = `${currentYear}-${monthStr}-${formattedDay}`;

    const items = [];

    hackathons.forEach((h) => {
      // 1. Deadline Day (🟣 Purple / Indigo)
      if (h.registrationDeadline && h.registrationDeadline.startsWith(targetDateStr)) {
        items.push({ hackathon: h, type: 'deadline', label: `🟣 ${h.title} (Deadline)` });
      }
      // 2. Start Date (🔵 Blue / Cyan)
      if (h.startDate && h.startDate === targetDateStr) {
        items.push({ hackathon: h, type: 'start', label: `🔵 ${h.title} (Starts)` });
      }
      // 3. End Date (🟠 Orange)
      if (h.endDate && h.endDate === targetDateStr) {
        items.push({ hackathon: h, type: 'end', label: `🟠 ${h.title} (Ends)` });
      }
      // 4. Ongoing during date range
      if (h.startDate <= targetDateStr && h.endDate >= targetDateStr && !items.some(i => i.hackathon.id === h.id)) {
        items.push({ hackathon: h, type: 'active', label: `🇮🇳 ${h.title}` });
      }
    });

    return items;
  };

  return (
    <div className="calendar-wrapper glass-panel">
      {/* Calendar Header Controls & Legend */}
      <div className="calendar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CalendarIcon size={22} color="var(--accent-indigo)" />
          <h2 style={{ fontSize: '1.4rem' }}>
            {monthNames[currentMonth]} {currentYear}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <span>🟣 Registration Deadline</span>
            <span>🔵 Hackathon Start</span>
            <span>🟠 Hackathon End</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary btn-icon"
              onClick={() => setCurrentMonth((prev) => (prev > 0 ? prev - 1 : 11))}
              title="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="btn btn-secondary btn-icon"
              onClick={() => setCurrentMonth((prev) => (prev < 11 ? prev + 1 : 0))}
              title="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Days Header */}
      <div className="calendar-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-day-head">
            {day}
          </div>
        ))}

        {/* Empty Padding Cells Before First Day */}
        {Array.from({ length: firstDayIndex }).map((_, idx) => (
          <div key={`empty-${idx}`} className="calendar-cell" style={{ opacity: 0.2 }} />
        ))}

        {/* Day Cells */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const events = getEventsForDay(dayNum);

          return (
            <div key={dayNum} className="calendar-cell">
              <span className="calendar-cell-num">{dayNum}</span>
              {events.map((evt, eIdx) => {
                let pillStyle = {
                  background: 'rgba(99, 91, 255, 0.15)',
                  color: '#A5B4FC',
                  border: '1px solid rgba(99, 91, 255, 0.3)'
                };

                if (evt.type === 'start') {
                  pillStyle = {
                    background: 'rgba(0, 184, 255, 0.15)',
                    color: '#38BDF8',
                    border: '1px solid rgba(0, 184, 255, 0.3)'
                  };
                } else if (evt.type === 'end') {
                  pillStyle = {
                    background: 'rgba(255, 122, 24, 0.15)',
                    color: '#FDBA74',
                    border: '1px solid rgba(255, 122, 24, 0.3)'
                  };
                }

                return (
                  <div
                    key={`${evt.hackathon.id}-${eIdx}`}
                    className="calendar-event-pill"
                    style={pillStyle}
                    onClick={() => onSelectHackathon(evt.hackathon)}
                    title={`${evt.hackathon.title} (${evt.hackathon.city || 'India'})`}
                  >
                    {evt.label}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
