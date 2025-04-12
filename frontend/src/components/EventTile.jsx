import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleEventExpanded, deleteEvent } from '../redux/slices/eventsSlice';
import { formatTime, getTimePosition, getEventHeight } from '../utils/dateUtils';

const EventTile = ({ event }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  
  // Convert event times to Date objects
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  
  // Calculate position and height based on time
  const top = getTimePosition(startTime, 60); // 60px per hour
  const height = getEventHeight(startTime, endTime, 60);
  
  // Generate lighter background and darker border colors
  const bgColor = event.color;
  
  // Helper to get contrasting text color
  const getTextColor = (backgroundColor) => {
    // Convert hex to RGB
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return black or white based on brightness
    return brightness > 140 ? '#1e293b' : '#ffffff';
  };
  
  const textColor = getTextColor(bgColor);
  
  // Event tile base styles
  const eventTileStyle = {
    position: 'absolute',
    top: `${top}px`,
    height: `${Math.max(height, 24)}px`, // Minimum height increased
    left: '2px',
    right: '8px',
    padding: '4px 8px',
    borderRadius: '6px',
    backgroundColor: bgColor,
    borderLeft: `3px solid ${bgColor}`,
    color: textColor,
    fontSize: '0.875rem',
    overflow: 'hidden',
    zIndex: event.isExpanded ? 30 : (isHovered ? 20 : 10),
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: event.isExpanded 
      ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
      : (isHovered 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          : '0 1px 3px rgba(0, 0, 0, 0.1)'),
    opacity: isHovered ? 1 : 0.9,
    transform: isHovered ? 'translateY(-1px)' : 'none'
  };
  
  // Toggle expanded state
  const handleToggleExpand = (e) => {
    e.stopPropagation();
    dispatch(toggleEventExpanded(event._id));
  };
  
  // Delete event
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this event?')) {
      dispatch(deleteEvent(event._id));
    }
  };
  
  // Handle drag and drop
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      id: event._id,
      startTime: event.startTime,
      endTime: event.endTime
    }));
  };
  
  return (
    <div
      style={eventTileStyle}
      onClick={handleToggleExpand}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable={true}
      onDragStart={handleDragStart}
    >
      <div style={{ 
        fontWeight: 600, 
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {event.title}
      </div>
      
      <div style={{ 
        fontSize: '0.75rem', 
        opacity: 0.9,
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <span style={{ 
          display: 'inline-block', 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%',
          backgroundColor: textColor,
          opacity: 0.7
        }}></span>
        {formatTime(startTime)} - {formatTime(endTime)}
      </div>
      
      {(event.isExpanded || isHovered) && (
        <div style={{ 
          marginTop: '4px', 
          fontSize: '0.75rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '4px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ 
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            color: textColor,
            fontWeight: '500',
            textTransform: 'capitalize'
          }}>
            {event.category}
          </div>
          
          {event.isExpanded && (
            <button 
              style={{
                alignSelf: 'flex-end',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                color: 'white',
                fontSize: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                marginTop: '4px',
                fontWeight: '500',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={e => e.target.style.backgroundColor = 'rgba(220, 38, 38, 1)'}
              onMouseLeave={e => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.9)'}
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default EventTile;