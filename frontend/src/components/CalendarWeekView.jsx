import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteEvent } from '../redux/slices/eventsSlice';
import { formatTime } from '../utils/dateUtils';
import EventTile from './EventTile';

const CalendarWeekView = ({ selectedDate, events, loading, onSlotClick }) => {
  const dispatch = useDispatch();
  const [hoveredSlot, setHoveredSlot] = useState(null);
  
  // Generate days for the week (starting from Sunday)
  const generateWeekDays = () => {
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - dayOfWeek);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };
  
  const weekDays = generateWeekDays();
  
  // Get hours for the day (7am to 10pm)
  const hours = [];
  for (let i = 7; i <= 22; i++) {
    const hourDate = new Date();
    hourDate.setHours(i, 0, 0, 0);
    hours.push(hourDate);
  }
  
  // Check if an event should be displayed on a specific day
  const getDayEvents = (date) => {
    const dayStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === dayStr;
    });
  };
  
  // Styles
  const weekViewContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  };
  
  const dayHeadersStyle = {
    display: 'flex',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  };
  
  const timeColumnStyle = {
    width: '60px',
    flexShrink: 0
  };
  
  const dayHeaderStyle = (isToday) => ({
    flex: 1,
    padding: '0.75rem 0.5rem',
    textAlign: 'center',
    backgroundColor: isToday ? '#f0f4ff' : 'transparent',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem'
  });
  
  const dayNameStyle = {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase'
  };
  
  const dayNumberStyle = (isToday) => ({
    width: '2rem',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: isToday ? '#4f46e5' : 'transparent',
    color: isToday ? 'white' : '#1e293b',
    fontWeight: isToday ? '600' : '500',
    fontSize: '0.875rem'
  });
  
  const weekGridStyle = {
    display: 'flex',
    flex: 1,
    overflowY: 'auto'
  };
  
  const timeLabelsStyle = {
    width: '60px',
    flexShrink: 0,
    borderRight: '1px solid #e2e8f0'
  };
  
  const timeLabelStyle = {
    height: '60px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingRight: '0.5rem',
    paddingTop: '0.25rem',
    fontSize: '0.75rem',
    color: '#64748b',
    position: 'relative',
    fontWeight: '500'
  };
  
  const daysContainerStyle = {
    display: 'flex',
    flex: 1
  };
  
  const dayColumnStyle = (isToday) => ({
    flex: 1,
    borderRight: '1px solid #e2e8f0',
    position: 'relative',
    backgroundColor: isToday ? 'rgba(240, 244, 255, 0.25)' : 'transparent'
  });
  
  const hourCellStyle = (isHovered) => ({
    height: '60px',
    borderBottom: '1px solid #edf2f7',
    cursor: 'pointer',
    backgroundColor: isHovered ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
    transition: 'background-color 0.15s ease'
  });
  
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const handleDeleteEvent = (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      dispatch(deleteEvent(event._id));
    }
  };

  return (
    <div style={weekViewContainerStyle}>
      {/* Day Headers */}
      <div style={dayHeadersStyle}>
        <div style={timeColumnStyle} />
        {weekDays.map((day, index) => (
          <div key={index} style={dayHeaderStyle(isToday(day))}>
            <span style={dayNameStyle}>
              {day.toLocaleString('default', { weekday: 'short' })}
            </span>
            <span style={dayNumberStyle(isToday(day))}>
              {day.getDate()}
            </span>
          </div>
        ))}
      </div>
      
      {/* Week Grid */}
      <div style={weekGridStyle}>
        {/* Time Labels */}
        <div style={timeLabelsStyle}>
          {hours.map((hour, index) => (
            <div key={index} style={timeLabelStyle}>
              {formatTime(hour)}
            </div>
          ))}
        </div>
        
        {/* Days */}
        <div style={daysContainerStyle}>
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} style={dayColumnStyle(isToday(day))}>
              {hours.map((hour, hourIndex) => {
                const timeSlot = new Date(day);
                timeSlot.setHours(hour.getHours(), 0, 0, 0);
                
                const slotId = `${dayIndex}-${hourIndex}`;
                
                return (
                  <div 
                    key={hourIndex} 
                    style={hourCellStyle(hoveredSlot === slotId)}
                    onClick={() => onSlotClick({ time: timeSlot })}
                    onMouseEnter={() => setHoveredSlot(slotId)}
                    onMouseLeave={() => setHoveredSlot(null)}
                  />
                );
              })}
              
              {/* Render events for this day */}
              {getDayEvents(day).map(event => {
                const startTime = new Date(event.startTime);
                const top = ((startTime.getHours() - 7) * 60) + (startTime.getMinutes());
                
                return (
                  <EventTile 
                    key={event._id} 
                    event={event}
                    style={{ top: `${top}px` }}
                    onDelete={() => handleDeleteEvent(event)}
                  />
                );
              })}
            </div>
          ))}
        </div>
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

export default CalendarWeekView;