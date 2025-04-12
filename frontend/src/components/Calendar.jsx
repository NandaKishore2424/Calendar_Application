import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, setSelectedDate, updateEvent } from '../redux/slices/eventsSlice';
import { formatDisplayDate, generateTimeSlots, getNextDay, getPreviousDay } from '../utils/dateUtils';
import EventModal from './EventModal';
import EventTile from './EventTile';
import CalendarMonthView from './CalendarMonthView';
import CalendarWeekView from './CalendarWeekView';
import CalendarYearView from './CalendarYearView';

const Calendar = () => {
  const dispatch = useDispatch();
  const { events, selectedDate, loading } = useSelector(state => state.events);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [eventPreset, setEventPreset] = useState(null);
  const [viewMode, setViewMode] = useState('day'); // day, week, month, year
  
  // Generate time slots from 7 AM to 9 PM
  const timeSlots = generateTimeSlots(15, 7, 21);
  
  // Fetch events when selectedDate changes
  useEffect(() => {
    dispatch(fetchEvents(selectedDate));
  }, [dispatch, selectedDate]);
  
  // Navigation functions
  const goToToday = () => {
    dispatch(setSelectedDate(new Date().toISOString().split('T')[0]));
  };
  
  const goToNextPeriod = () => {
    const currentDate = new Date(selectedDate);
    let nextDate;
    
    switch(viewMode) {
      case 'day':
        nextDate = getNextDay(currentDate);
        break;
      case 'week':
        // Add 7 days
        nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 7);
        break;
      case 'month':
        // Go to next month, same day
        nextDate = new Date(currentDate);
        nextDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'year':
        // Go to next year, same month/day
        nextDate = new Date(currentDate);
        nextDate.setFullYear(currentDate.getFullYear() + 1);
        break;
      default:
        nextDate = getNextDay(currentDate);
    }
    
    dispatch(setSelectedDate(nextDate.toISOString().split('T')[0]));
  };
  
  const goToPrevPeriod = () => {
    const currentDate = new Date(selectedDate);
    let prevDate;
    
    switch(viewMode) {
      case 'day':
        prevDate = getPreviousDay(currentDate);
        break;
      case 'week':
        // Subtract 7 days
        prevDate = new Date(currentDate);
        prevDate.setDate(currentDate.getDate() - 7);
        break;
      case 'month':
        // Go to previous month, same day
        prevDate = new Date(currentDate);
        prevDate.setMonth(currentDate.getMonth() - 1);
        break;
      case 'year':
        // Go to previous year, same month/day
        prevDate = new Date(currentDate);
        prevDate.setFullYear(currentDate.getFullYear() - 1);
        break;
      default:
        prevDate = getPreviousDay(currentDate);
    }
    
    dispatch(setSelectedDate(prevDate.toISOString().split('T')[0]));
  };
  
  // Open modal when clicking on a time slot
  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setShowModal(true);
  };
  
  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
    setEventPreset(null);
  };

  // Handle event drop
  const handleDrop = (e) => {
    e.preventDefault();
    
    try {
      // Get the dragged data
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      // Calculate the drop position time
      const calendarRect = e.currentTarget.getBoundingClientRect();
      const dropY = e.clientY - calendarRect.top;
      
      // Convert Y position to hours (assuming 60px per hour)
      const hourHeight = 60;
      const droppedHours = (dropY / hourHeight) + 7; // Add 7 because our day starts at 7 AM
      
      // Round to nearest interval (15 minutes)
      const hours = Math.floor(droppedHours);
      const minutes = Math.round((droppedHours - hours) * 60 / 15) * 15;
      
      // Create a date object for the time
      const dropTime = new Date(selectedDate);
      dropTime.setHours(hours, minutes, 0, 0);
      
      // Check if this is a task or an event based on the data structure
      if (data.id && data.startTime && data.endTime) {
        // This is an existing event being moved
        const originalStart = new Date(data.startTime);
        const originalEnd = new Date(data.endTime);
        const durationMs = originalEnd - originalStart;
        
        // Apply the same duration to the new time
        const newEndTime = new Date(dropTime.getTime() + durationMs);
        
        // Dispatch action to update the event
        dispatch(updateEvent({
          id: data.id,
          eventData: {
            startTime: dropTime.toISOString(),
            endTime: newEndTime.toISOString(),
            date: selectedDate
          }
        }));
      } else {
        // This is a task being converted to an event
        // Default event duration of 30 minutes
        const endTime = new Date(dropTime.getTime() + 30 * 60000);
        
        // Create a new event from the task
        setSelectedSlot({
          time: dropTime,
          endTime: endTime
        });
        
        // Open modal with pre-populated data from task
        setEventPreset({
          title: data.title || 'New Event',
          category: data.category || 'work',
          color: data.color
        });
        
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow drop
  };

  // ===== STYLES =====
  
  // Calendar container styles
  const calendarContainerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f0f0f0',
    overflow: 'hidden'
  };
  
  // Header styles
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #f0f0f0'
  };
  
  const headerLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  };
  
  const headerRightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  };
  
  const navButtonStyle = {
    backgroundColor: '#e5e7eb',
    color: '#374151',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    transition: 'all 0.2s ease'
  };
  
  const viewButtonsContainerStyle = {
    display: 'flex',
    backgroundColor: '#f3f4f6',
    borderRadius: '0.5rem',
    padding: '0.25rem',
    gap: '0.25rem'
  };
  
  const viewButtonStyle = (isActive) => ({
    backgroundColor: isActive ? '#ffffff' : 'transparent',
    color: isActive ? '#4f46e5' : '#6b7280',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
    transition: 'all 0.15s ease'
  });
  
  const dateDisplayStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    backgroundColor: '#f8fafc',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.04)'
  };
  
  // Calendar grid styles (for day view)
  const calendarGridStyle = {
    flex: 1,
    display: 'flex',
    overflowY: 'auto',
    position: 'relative',
    borderRadius: '0.5rem',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
    backgroundColor: '#fafafa'
  };
  
  // Time labels styles
  const timeLabelsStyle = {
    width: '70px',
    flexShrink: 0,
    borderRight: '1px solid #e2e8f0',
    position: 'relative',
    zIndex: 10,
    backgroundColor: '#f8fafc',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem'
  };
  
  const timeLabelStyle = {
    height: '15px',
    textAlign: 'right',
    paddingRight: '12px',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#64748b',
    lineHeight: 1,
    transform: 'translateY(-50%)'
  };
  
  // Time grid styles
  const timeGridStyle = {
    flex: 1,
    position: 'relative',
    minHeight: '100%',
    padding: '0.5rem 0',
    backgroundColor: 'white'
  };
  
  const timeSlotStyle = {
    height: '15px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease'
  };
  
  const timeSlotHoverStyle = {
    ...timeSlotStyle,
    backgroundColor: 'rgba(79, 70, 229, 0.05)'
  };
  
  const timeSlotLineStyle = (isHour) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '1px',
    backgroundColor: isHour ? '#cbd5e1' : '#edf2f7',
    pointerEvents: 'none'
  });
  
  // State for hover effects
  const [hoveredSlot, setHoveredSlot] = useState(null);
  
  // Display title based on view mode
  const getViewTitle = () => {
    const date = new Date(selectedDate);
    
    switch(viewMode) {
      case 'day':
        return formatDisplayDate(date);
      case 'week': {
        // Get start of week (Sunday) and end of week (Saturday)
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const startMonth = startOfWeek.toLocaleString('default', { month: 'short' });
        const endMonth = endOfWeek.toLocaleString('default', { month: 'short' });
        
        return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${date.getFullYear()}`;
      }
      case 'month':
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
      case 'year':
        return date.getFullYear().toString();
      default:
        return formatDisplayDate(date);
    }
  };
  
  // Render the calendar view based on the selected mode
  const renderCalendarView = () => {
    switch(viewMode) {
      case 'day':
        return renderDayView();
      case 'week':
        return <CalendarWeekView 
                 selectedDate={selectedDate} 
                 events={events} 
                 loading={loading}
                 onSlotClick={handleSlotClick}
               />;
      case 'month':
        return <CalendarMonthView 
                 selectedDate={selectedDate} 
                 events={events} 
                 loading={loading}
                 onDateClick={(date) => dispatch(setSelectedDate(date))}
               />;
      case 'year':
        return <CalendarYearView 
                 selectedDate={selectedDate} 
                 onMonthClick={(date) => {
                   dispatch(setSelectedDate(date));
                   setViewMode('month');
                 }}
               />;
      default:
        return renderDayView();
    }
  };
  
  // Day view rendering
  const renderDayView = () => {
    return (
      <div style={calendarGridStyle}>
        {/* Time labels column */}
        <div style={timeLabelsStyle}>
          {timeSlots.map((slot, index) => (
            <div 
              key={`time-${index}`} 
              style={timeLabelStyle}
            >
              {index % 4 === 0 && slot.label}
            </div>
          ))}
        </div>
        
        {/* Main calendar grid with time slots */}
        <div 
          style={timeGridStyle}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {timeSlots.map((slot, index) => (
            <div 
              key={`slot-${index}`} 
              style={hoveredSlot === index ? timeSlotHoverStyle : timeSlotStyle}
              onClick={() => handleSlotClick(slot)}
              onMouseEnter={() => setHoveredSlot(index)}
              onMouseLeave={() => setHoveredSlot(null)}
            >
              <div style={timeSlotLineStyle(index % 4 === 0)}></div>
            </div>
          ))}
          
          {/* Current time indicator */}
          <CurrentTimeIndicator />
          
          {/* Render events */}
          {!loading && events.map(event => (
            <EventTile 
              key={event._id} 
              event={event} 
            />
          ))}
          
          {/* Loading indicator */}
          {loading && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
              }}></div>
              <span style={{ color: '#4b5563', fontWeight: '500' }}>Loading events...</span>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div style={calendarContainerStyle}>
      {/* Calendar header with navigation and view options */}
      <div style={headerStyle}>
        <div style={headerLeftStyle}>
          <div style={viewButtonsContainerStyle}>
            <button 
              style={viewButtonStyle(viewMode === 'day')}
              onClick={() => setViewMode('day')}
            >
              Day
            </button>
            <button 
              style={viewButtonStyle(viewMode === 'week')}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
            <button 
              style={viewButtonStyle(viewMode === 'month')}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
            <button 
              style={viewButtonStyle(viewMode === 'year')}
              onClick={() => setViewMode('year')}
            >
              Year
            </button>
          </div>
          
          <button 
            style={navButtonStyle}
            onClick={goToToday}
          >
            Today
          </button>
        </div>
        
        <div style={dateDisplayStyle}>
          {getViewTitle()}
        </div>
        
        <div style={headerRightStyle}>
          <button 
            style={navButtonStyle}
            onClick={goToPrevPeriod}
          >
            ← Previous
          </button>
          
          <button 
            style={navButtonStyle}
            onClick={goToNextPeriod}
          >
            Next →
          </button>
        </div>
      </div>
      
      {/* Calendar content based on view mode */}
      {renderCalendarView()}
      
      {/* Event creation modal */}
      {showModal && (
        <EventModal 
          onClose={handleCloseModal} 
          initialTime={selectedSlot ? selectedSlot.time : new Date()}
          selectedDate={selectedDate}
          preset={eventPreset}
        />
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Current time indicator component
const CurrentTimeIndicator = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate position
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const top = ((hours - 7) * 60 + minutes) * (15 / 60); // Convert to pixels
  
  // Only show if current time is in view (7am-9pm)
  if (hours < 7 || hours >= 21) return null;
  
  return (
    <>
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${top}px`,
        height: '2px',
        backgroundColor: '#ef4444',
        zIndex: 5,
        boxShadow: '0 0 4px rgba(239, 68, 68, 0.5)',
      }}></div>
      <div style={{
        position: 'absolute',
        left: '-8px',
        top: `${top}px`,
        transform: 'translateY(-50%)',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#ef4444',
        zIndex: 6,
      }}></div>
    </>
  );
};

export default Calendar;