import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleEventExpanded, deleteEvent } from '../redux/slices/eventsSlice';
import { formatTime, getTimePosition, getEventHeight } from '../utils/dateUtils';

const EventTile = ({ event, onDragStart }) => {
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
    
    // Create a custom confirmation dialog instead of the basic window.confirm
    const confirmDelete = () => {
      dispatch(deleteEvent(event._id));
      
      // Show temporary success message
      const successMessage = document.createElement('div');
      successMessage.textContent = 'Event deleted';
      successMessage.style.position = 'fixed';
      successMessage.style.bottom = '20px';
      successMessage.style.right = '20px';
      successMessage.style.backgroundColor = '#10B981';
      successMessage.style.color = 'white';
      successMessage.style.padding = '10px 20px';
      successMessage.style.borderRadius = '4px';
      successMessage.style.zIndex = '9999';
      successMessage.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      
      document.body.appendChild(successMessage);
      
      // Remove after 3 seconds
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
    };
    
    // Show dialog (customize to match your app's design)
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      confirmDelete();
    }
  };
  
  // Handle drag and drop
  const handleDragStart = (e) => {
    const eventData = {
      id: event._id,
      startTime: event.startTime,
      endTime: event.endTime
    };
    
    e.dataTransfer.setData('text/plain', JSON.stringify(eventData));
    
    // Update the draggedEvent state in the parent Calendar component
    // You'll need to pass this function as a prop to EventTile
    onDragStart(eventData);
  };
  
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          handleDelete(e);
        }
      }}
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
            <DeleteButton onDelete={handleDelete} isVisible={event.isExpanded} />
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

const DeleteButton = ({ onDelete, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button 
      style={{
        opacity: isVisible ? 1 : 0,
        backgroundColor: isHovered ? 'rgba(239, 68, 68, 0.9)' : 'rgba(239, 68, 68, 0.7)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '4px 8px',
        fontSize: '0.75rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}
      onClick={onDelete}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ fontSize: '0.875rem' }}>✕</span> Delete
    </button>
  );
};

export default EventTile;