import React, { useState, useEffect } from 'react';
import DayCell from './DayCell';

const Calendar = ({ currentYear, currentMonth, statuses, onDayClick, selectedDate }) => {
    const [days, setDays] = useState([]);

    useEffect(() => {
        generateCalendar(currentYear, currentMonth);
    }, [currentYear, currentMonth]);

    const generateCalendar = (year, month) => {
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const calendarDays = [];

        // Previous month padding
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push({ date: null, isCurrentMonth: false });
        }

        // Current days
        for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push({
                date: new Date(year, month, i),
                isCurrentMonth: true
            });
        }

        setDays(calendarDays);
    };

    const handleDateClick = (date) => {
        if (date) {
            onDayClick(date);
        }
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const formatDateKey = (date) => {
        if (!date) return null;
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <div className="calendar-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            {/* Week Header */}
            <div className="week-header" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 'var(--spacing-xs)',
                textAlign: 'right',
                paddingRight: '8px'
            }}>
                {weekDays.map(day => (
                    <div key={day} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="days-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 'var(--spacing-xs)',
                flex: 1
            }}>
                {days.map((dayItem, index) => {
                    const dateKey = formatDateKey(dayItem.date);
                    const dayStatuses = dateKey ? (statuses[dateKey] || []) : [];
                    const isSelected = selectedDate && dateKey === formatDateKey(selectedDate);

                    return (
                        <DayCell
                            key={index}
                            date={dayItem.date}
                            isCurrentMonth={dayItem.isCurrentMonth}
                            statusList={dayStatuses}
                            onClick={dayItem.isCurrentMonth ? handleDateClick : () => { }}
                            isSelected={isSelected}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
