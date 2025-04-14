import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createEvent } from '../redux/slices/eventsSlice';

const EventModal = ({ onClose, initialTime, selectedDate, preset }) => {
  const dispatch = useDispatch();
  
  // Round the initial time to the nearest 15 minutes
  const roundedTime = new Date(initialTime);
  roundedTime.setMinutes(Math.round(roundedTime.getMinutes() / 15) * 15, 0, 0);
  
  // Initialize with preset data if available
  const [eventData, setEventData] = useState({
    title: preset?.title || '',
    category: preset?.category || 'work',
    startTime: formatTimeInput(roundedTime),
    endTime: formatTimeInput(new Date(roundedTime.getTime() + 30 * 60000)),
    date: selectedDate,
    color: preset?.color
  });
  
  // Format time for input field (HH:MM)
  function formatTimeInput(date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new Date object with the date part only
    const dateStr = selectedDate.split('T')[0]; // Make sure we only have YYYY-MM-DD
    
    // Create start and end time Date objects and preserve local time
    const [startHours, startMinutes] = eventData.startTime.split(':').map(Number);
    const [endHours, endMinutes] = eventData.endTime.split(':').map(Number);
    
    // Create ISO strings but preserve local timezone information
    const startDate = new Date(dateStr);
    startDate.setHours(startHours, startMinutes, 0, 0);
    
    const endDate = new Date(dateStr);
    endDate.setHours(endHours, endMinutes, 0, 0);
    
    const eventToCreate = {
      title: eventData.title,
      category: eventData.category,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      date: dateStr
    };
    
    dispatch(createEvent(eventToCreate));
    onClose();
  };
  
  // Category options with colors and labels
  const categories = [
    { value: 'exercise', label: 'Exercise', color: '#4CAF50' },
    { value: 'eating', label: 'Eating', color: '#FF9800' },
    { value: 'work', label: 'Work', color: '#2196F3' },
    { value: 'relax', label: 'Relax', color: '#9C27B0' },
    { value: 'family', label: 'Family', color: '#E91E63' },
    { value: 'social', label: 'Social', color: '#FF5722' }
  ];
  
  // Modal animation
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animation after modal is mounted
    setTimeout(() => setIsVisible(true), 10);
  }, []);
  
  // Enhanced modal styles
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    backdropFilter: 'blur(4px)',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.3s ease'
  };
  
  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.75rem',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    opacity: isVisible ? 1 : 0,
    transition: 'transform 0.3s ease, opacity 0.3s ease'
  };
  
  const formGroupStyle = {
    marginBottom: '1.5rem'
  };
  
  const formRowStyle = {
    display: 'flex',
    gap: '1rem'
  };
  
  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#374151'
  };
  
  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    backgroundColor: '#f9fafb'
  };
  
  const inputFocusStyle = {
    ...inputStyle,
    outline: 'none',
    borderColor: '#4f46e5',
    boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.2)'
  };
  
  const categoryOptionsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginTop: '0.5rem'
  };
  
  const categoryOptionStyle = (cat) => ({
    padding: '0.5rem 1rem',
    border: `2px solid ${cat.color}`,
    borderRadius: '9999px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    backgroundColor: eventData.category === cat.value ? cat.color : 'transparent',
    color: eventData.category === cat.value ? getContrastText(cat.color) : cat.color
  });
  
  const modalActionsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '2rem'
  };
  
  const cancelButtonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };
  
  const saveButtonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 1px 3px rgba(79, 70, 229, 0.25)'
  };
  
  // Handle input focus states
  const [focusedInput, setFocusedInput] = useState(null);
  
  // Helper to get contrasting text color
  const getContrastText = (backgroundColor) => {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return black or white based on brightness
    return brightness > 140 ? '#1e293b' : '#ffffff';
  };
  
  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div 
        style={modalContentStyle}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '700', 
          marginBottom: '1.5rem',
          color: '#1e293b',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '0.75rem'
        }}>
          Create Event
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="title">Event Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              required
              placeholder="Enter event title"
              style={focusedInput === 'title' ? inputFocusStyle : inputStyle}
              onFocus={() => setFocusedInput('title')}
              onBlur={() => setFocusedInput(null)}
            />
          </div>
          
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="category">Category</label>
            <div style={categoryOptionsStyle}>
              {categories.map(cat => (
                <label 
                  key={cat.value} 
                  style={categoryOptionStyle(cat)}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={eventData.category === cat.value}
                    onChange={handleChange}
                    style={{ 
                      position: 'absolute',
                      width: '1px',
                      height: '1px',
                      padding: 0,
                      margin: '-1px',
                      overflow: 'hidden',
                      clip: 'rect(0, 0, 0, 0)',
                      whiteSpace: 'nowrap',
                      borderWidth: 0,
                    }}
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          </div>
          
          <div style={formRowStyle}>
            <div style={{ ...formGroupStyle, flex: 1 }}>
              <label style={labelStyle} htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={eventData.startTime}
                onChange={handleChange}
                required
                style={focusedInput === 'startTime' ? inputFocusStyle : inputStyle}
                onFocus={() => setFocusedInput('startTime')}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
            
            <div style={{ ...formGroupStyle, flex: 1 }}>
              <label style={labelStyle} htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={eventData.endTime}
                onChange={handleChange}
                required
                style={focusedInput === 'endTime' ? inputFocusStyle : inputStyle}
                onFocus={() => setFocusedInput('endTime')}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
          </div>
          
          <div style={modalActionsStyle}>
            <button 
              type="button" 
              onClick={onClose}
              style={cancelButtonStyle}
              onMouseEnter={e => e.target.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={e => e.target.style.backgroundColor = '#f3f4f6'}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={saveButtonStyle}
              onMouseEnter={e => e.target.style.backgroundColor = '#4338ca'}
              onMouseLeave={e => e.target.style.backgroundColor = '#4f46e5'}
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;