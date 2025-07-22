import React, { useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, addMonths, subMonths } from 'date-fns';

function CalendarBox({ onDateClick, dateEmojis = {} }) {
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
        const cloneDay = new Date(day); // 날짜
        cloneDay.setHours(12);
        const formatted = format(cloneDay, 'd');
        const dateKey = format(cloneDay, 'yyyy-MM-dd'); // 날짜 키 생성
        const emoji = dateEmojis[dateKey]; // 해당 날짜 이모지 가져오기
        const isCurrentMonth = cloneDay.getMonth() === monthStart.getMonth();

        days.push(
          <div
            className={`calendar-cell ${!isCurrentMonth ? 'calendar-disabled' : ''}`}
            key={cloneDay}
            onClick={() => onDateClick(cloneDay)} // 날짜 전달
          >
            <div>{formatted}</div>
            {emoji && <div style={{ fontSize: '12px', marginTop: '2px' }}>{emoji}</div>}
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