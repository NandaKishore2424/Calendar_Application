import React from 'react';

const CalendarMonthView = ({ selectedDate, events, loading, onDateClick }) => {
  const getDaysInMonthGrid = () => {
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); 
    
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();
    
    // Days from previous month to include
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Add days from previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const day = prevMonthLastDay - firstDayOfWeek + i + 1;
      days.push({
        date: new Date(prevYear, prevMonth, day),
        isCurrentMonth: false
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDate; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Add days from next month to complete grid
    const totalDaysNeeded = Math.ceil(days.length / 7) * 7;
    const nextMonthDays = totalDaysNeeded - days.length;
    
    for (let i = 1; i <= nextMonthDays; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      days.push({
        date: new Date(nextYear, nextMonth, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };
  
  const daysInMonth = getDaysInMonthGrid();
  const weeks = [];
  
  // Group days into weeks
  for (let i = 0; i < daysInMonth.length; i += 7) {
    weeks.push(daysInMonth.slice(i, i + 7));
  }
  
  // Get events for a specific day
  const getDayEvents = (date) => {
    const localDateStr = formatDateToYYYYMMDD(date); 
    return events.filter(event => {
      return typeof event.date === 'string' && event.date === localDateStr;
    });
  };

  const formatDateToYYYYMMDD = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  // Check if a date is the selected date
  const isSelectedDate = (date) => {
    const selected = new Date(selectedDate);
    return date.getDate() === selected.getDate() && 
           date.getMonth() === selected.getMonth() && 
           date.getFullYear() === selected.getFullYear();
  };
  
  // Styles
  const monthViewStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  };
  
  const weekDaysHeaderStyle = {
    display: 'flex',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  };
  
  const weekDayHeaderStyle = {
    flex: 1,
    padding: '0.75rem',
    textAlign: 'center',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase'
  };
  
  const monthGridStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  };
  
  const weekRowStyle = {
    display: 'flex',
    flex: 1,
    minHeight: '100px',
    borderBottom: '1px solid #e2e8f0'
  };
  
  const dayStyle = (isCurrentMonth, isSelected, isToday) => ({
    flex: 1,
    padding: '0.5rem',
    backgroundColor: isSelected ? '#f0f4ff' : (isToday ? '#fef2f2' : 'transparent'),
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    cursor: 'pointer',
    opacity: isCurrentMonth ? 1 : 0.4,
    transition: 'background-color 0.15s ease'
  });
  
  const dayNumberStyle = (isToday, isSelected) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.75rem',
    height: '1.75rem',
    borderRadius: '50%',
    backgroundColor: isToday ? '#ef4444' : (isSelected ? '#4f46e5' : 'transparent'),
    color: (isToday || isSelected) ? 'white' : '#334155',
    fontSize: '0.875rem',
    fontWeight: (isToday || isSelected) ? '600' : '500',
    marginBottom: '0.25rem'
  });
  
  const dayEventsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    overflowY: 'auto',
    flex: 1
  };
  
  const eventDotStyle = (color) => ({
    height: '1.5rem',
    padding: '0.25rem 0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    backgroundColor: color,
    color: 'white',
    borderRadius: '0.25rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  });
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div style={monthViewStyle}>
      {/* Week days header */}
      <div style={weekDaysHeaderStyle}>
        {weekDays.map((day, index) => (
          <div key={index} style={weekDayHeaderStyle}>
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div style={monthGridStyle}>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} style={weekRowStyle}>
            {week.map((day, dayIndex) => {
              const dayEvents = getDayEvents(day.date);
              const isSelectedDay = isSelectedDate(day.date);
              const isTodayDate = isToday(day.date);
              
              return (
                <div 
                  key={dayIndex} 
                  style={dayStyle(day.isCurrentMonth, isSelectedDay, isTodayDate)}
                  onClick={() => onDateClick(day.date.toISOString().split('T')[0])}
                >
                  <div style={dayNumberStyle(isTodayDate, isSelectedDay)}>
                    {day.date.getDate()}
                  </div>
                  
                  <div style={dayEventsStyle}>
                    {dayEvents.slice(0, 3).map(event => (
                      <div 
                        key={event._id} 
                        style={eventDotStyle(event.color)}
                        title={event.title}
                      >
                        <span style={{
                          width: '0.5rem',
                          height: '0.5rem',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)'
                        }} />
                        {event.title}
                      </div>
                    ))}
                    
                    {dayEvents.length > 3 && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        textAlign: 'right',
                        fontWeight: '500'
                      }}>
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '1rem',
              height: '1rem',
              borderRadius: '50%',
              border: '2px solid #e2e8f0',
              borderTopColor: '#4f46e5',
              animation: 'spin 1s linear infinite'
            }} />
            <span style={{ color: '#4b5563', fontWeight: '500' }}>Loading events...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarMonthView;