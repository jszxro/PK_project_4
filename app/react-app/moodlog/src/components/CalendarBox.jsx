import React, { useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, addMonths, subMonths } from 'date-fns';

function CalendarBox({ onDateClick }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="calendar-header">
        <button onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}>◀</button>
        <h4>{format(currentMonth, 'MMMM yyyy')}</h4>
        <button onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}>▶</button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="calendar-days">
        {days.map((day, index) => (
          <div className="calendar-cell calendar-day-name" key={index}>{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day); // ✅ 정확한 날짜 복제
        cloneDay.setHours(12); // ✅ 이거 추가!
        const formatted = format(cloneDay, 'd');
        const isCurrentMonth = cloneDay.getMonth() === monthStart.getMonth();

        days.push(
          <div
            className={`calendar-cell ${!isCurrentMonth ? 'calendar-disabled' : ''}`}
            key={cloneDay}
            onClick={() => onDateClick(cloneDay)} // ✅ 정확한 날짜 복사 전달
          >
            {formatted}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="calendar-row" key={day}>{days}</div>);
      days = [];
    }

    return <div className="calendar-body">{rows}</div>;
  };

  return (
    <div className="calendar-container">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}

export default CalendarBox; 