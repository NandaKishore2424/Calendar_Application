import React, { useState } from 'react';
import { formatTime } from '../utils/dateUtils';
import EventTile from './EventTile'; 

const CalendarWeekView = ({ selectedDate, events, loading, onSlotClick }) => {
  const [hoveredSlot, setHoveredSlot] = useState(null);
  
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
  
  const hours = [];
  for (let i = 0; i < 24; i++) { 
    const hourDate = new Date();
    hourDate.setHours(i, 0, 0, 0); 
    hours.push(hourDate);
  }
  
  const getDayEvents = (date) => {
    const localDateStr = formatDateToYYYYMMDD(date);
    if (!localDateStr) return [];

    return events.filter(event => {
      if (typeof event.date === 'string' && event.date.length === 10) { 
        return event.date === localDateStr;
      }
      
      console.warn(`Event ${event._id || event.id} missing or has invalid 'date' property. Falling back to startTime.`);
      const eventStartDate = new Date(event.startTime);
      return formatDateToYYYYMMDD(eventStartDate) === localDateStr;
    });
  };
  
  const formatDateToYYYYMMDD = (date) => {
    if (!(date instanceof Date)) {
       date = new Date(date); 
    }
    if (isNaN(date.getTime())) { 
       console.error("Invalid date passed to formatDateToYYYYMMDD:", date);
       return null; 
    }
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
    fontWeight: '500',
  };

  const daysContainerStyle = {
    display: 'flex',
    flex: 1
  };
  
  const dayColumnStyle = (isToday) => ({
    flex: 1,
    borderRight: '1px solid #e2e8f0',
    position: 'relative', 
    backgroundColor: isToday ? 'rgba(240, 244, 255, 0.25)' : 'transparent',
    height: '100%', 
    overflow: 'visible' 
  });
  
  const hourCellStyle = {
    height: '60px', 
    borderBottom: '1px solid #edf2f7',
  };
  
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const getLocalTime = (event, timeProp, fallbackDate) => {
    if (event[timeProp + 'Local']) {
      const [hours, minutes] = event[timeProp + 'Local'].split(':').map(Number);
      const localDate = new Date(fallbackDate);
      localDate.setHours(hours, minutes, 0, 0);
      return localDate;
    } else {
      const dateFromISO = new Date(event[timeProp]);
      const localDate = new Date(fallbackDate);
      localDate.setHours(dateFromISO.getHours(), dateFromISO.getMinutes(), 0, 0);
      return localDate;
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
            <div 
              key={dayIndex} 
              style={dayColumnStyle(isToday(day))}
              onClick={(e) => {
                if (e.target !== e.currentTarget) return;
                
                const rect = e.currentTarget.getBoundingClientRect();
                const clickY = e.clientY - rect.top;
                
                const clickHour = Math.floor(clickY / 60); 
                const clickMinutes = Math.round((clickY % 60) / 15) * 15; // Round to nearest 15 min
                
                const clickTime = new Date(day);
                clickTime.setHours(Math.min(clickHour, 23), clickMinutes, 0, 0);
                
                onSlotClick({ time: clickTime });
              }}
              onDragOver={(e) => {
                e.preventDefault(); 
                e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.05)'; // Visual feedback
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.backgroundColor = isToday(day) ? 'rgba(240, 244, 255, 0.25)' : 'transparent';
              }}
              onDrop={(e) => {
                console.log('DROP DETECTED on day column');
                e.preventDefault();
                e.currentTarget.style.backgroundColor = isToday(day) ? 'rgba(240, 244, 255, 0.25)' : 'transparent';
                
                try {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const dropY = e.clientY - rect.top;
                  
                  const dropHour = Math.min(Math.max(Math.floor(dropY / 60), 0), 23); // Limit to 0-23
                  const dropMinutes = Math.min(Math.max(Math.round((dropY % 60) / 15) * 15, 0), 45); // Limit to 0, 15, 30, 45
                  
                  console.log('Calculated drop position:', dropHour, ':', dropMinutes);
                  
                  const dropDate = new Date(day);
                  console.log('Initial dropDate:', dropDate);
                  
                  if (isNaN(dropDate.getTime())) {
                    console.error('Invalid day reference:', day);
                    return;
                  }
                  
                  dropDate.setHours(dropHour, dropMinutes, 0, 0);
                  console.log('Final dropDate after setting hours:', dropDate);
                  
                  // Final validation check
                  if (isNaN(dropDate.getTime())) {
                    console.error('Invalid drop date created');
                    return;
                  }
                  const dateCopy = new Date(dropDate.getTime());
                  
                  console.log('Creating calendarDrop event with date:', dateCopy);
                  const dropEvent = new CustomEvent('calendarDrop', {
                    detail: { date: dateCopy, dayIndex }
                  });
                  
                  console.log('About to dispatch calendarDrop event');
                  document.dispatchEvent(dropEvent);
                  console.log('calendarDrop event dispatched');
                } catch (err) {
                  console.error('Error in drop handler:', err);
                }
              }}
            >
              {hours.map((hour, hourIndex) => {
                const timeSlot = new Date(day);
                timeSlot.setHours(hour.getHours(), 0, 0, 0);
                
                const slotId = `${dayIndex}-${hourIndex}`;
                
                return (
                  <div 
                    key={hourIndex} 
                    style={{
                      ...hourCellStyle,
                      backgroundColor: hoveredSlot === slotId ? 'rgba(79, 70, 229, 0.05)' : 'transparent'
                    }}
                    onClick={() => onSlotClick({ time: timeSlot })}
                    onMouseEnter={() => setHoveredSlot(slotId)}
                    onMouseLeave={() => setHoveredSlot(null)}
                  />
                );
              })}
              
              {/* Render events for this day */}
              {getDayEvents(day).map(event => {
                const localStartTime = getLocalTime(event, 'startTime', day);
                const localEndTime = getLocalTime(event, 'endTime', day);
              
                const startMinutesPastMidnight = localStartTime.getHours() * 60 + localStartTime.getMinutes();
                const gridStartMinutes = 0; 
                const top = startMinutesPastMidnight - gridStartMinutes;
              
                console.log('Event:', event.title, 'Top:', top, 'Start Time:', localStartTime);
              
                const durationMinutes = (localEndTime.getTime() - localStartTime.getTime()) / (1000 * 60);
                const height = Math.max(durationMinutes, 30);
              
                return (
                  <EventTile 
                    key={event._id} 
                    event={event}
                    top={top}
                    height={height}
                    onDragStart={(draggedEvent) => {
                      const dragStartEvent = new CustomEvent('eventDragStart', {
                        detail: { event: draggedEvent }
                      });
                      document.dispatchEvent(dragStartEvent);
                    }}
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