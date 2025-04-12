import React from 'react';

const CalendarYearView = ({ selectedDate, onMonthClick }) => {
  const date = new Date(selectedDate);
  const year = date.getFullYear();
  
  // Generate month grid
  const months = [];
  for (let i = 0; i < 12; i++) {
    months.push(new Date(year, i, 1));
  }
  
  // Check if a month is the current month
  const isCurrentMonth = (date) => {
    const today = new Date();
    return date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  // Check if a month is the selected month
  const isSelectedMonth = (date) => {
    const selected = new Date(selectedDate);
    return date.getMonth() === selected.getMonth() && 
           date.getFullYear() === selected.getFullYear();
  };
  
  // Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  // Styles
  const yearViewStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    padding: '1.5rem',
    overflow: 'auto',
    height: '100%'
  };
  
  const monthCardStyle = (isSelected, isCurrent) => ({
    backgroundColor: isSelected ? '#f0f4ff' : (isCurrent ? '#fef2f2' : 'white'),
    borderRadius: '0.5rem',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    border: `1px solid ${isSelected ? '#c7d2fe' : (isCurrent ? '#fecaca' : '#e2e8f0')}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });
  
  const monthHeaderStyle = (isSelected, isCurrent) => ({
    padding: '0.75rem',
    borderBottom: `1px solid ${isSelected ? '#c7d2fe' : (isCurrent ? '#fecaca' : '#e2e8f0')}`,
    backgroundColor: isSelected ? '#e0e7ff' : (isCurrent ? '#fee2e2' : '#f8fafc'),
    fontWeight: '600',
    fontSize: '0.875rem',
    textAlign: 'center',
    color: isSelected ? '#4f46e5' : (isCurrent ? '#ef4444' : '#334155')
  });
  
  const miniCalendarStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    padding: '0.5rem',
    gap: '0.25rem'
  };
  
  const miniDayHeaderStyle = {
    fontSize: '0.625rem',
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: '0.25rem'
  };
  
  const miniDayStyle = {
    fontSize: '0.625rem',
    color: '#475569',
    width: '1.25rem',
    height: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%'
  };
  
  // Render mini month calendar
  const renderMiniMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday, 6 = Saturday
    const daysInMonth = getDaysInMonth(date);
    
    const days = [];
    // Empty cells for days before the 1st
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} style={miniDayStyle}></div>);
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div key={i} style={miniDayStyle}>{i}</div>
      );
    }
    
    return days;
  };
  
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  return (
    <div style={yearViewStyle}>
      {months.map((month, index) => {
        const isSelected = isSelectedMonth(month);
        const isCurrent = isCurrentMonth(month);
        
        return (
          <div 
            key={index} 
            style={monthCardStyle(isSelected, isCurrent)}
            onClick={() => onMonthClick(month.toISOString().split('T')[0])}
          >
            <div style={monthHeaderStyle(isSelected, isCurrent)}>
              {month.toLocaleString('default', { month: 'long' })}
            </div>
            
            <div style={miniCalendarStyle}>
              {/* Week day headers */}
              {weekDays.map((day, idx) => (
                <div key={idx} style={miniDayHeaderStyle}>
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {renderMiniMonth(month)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CalendarYearView;