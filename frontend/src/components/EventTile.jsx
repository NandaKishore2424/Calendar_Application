import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleEventExpanded, deleteEvent } from '../redux/slices/eventsSlice';
import { formatTime } from '../utils/dateUtils';

const getCategoryColor = (category) => {
  const colors = {
    exercise: '#4CAF50', 
    eating: '#FF9800',   
    work: '#2196F3',     
    relax: '#9C27B0',  
    family: '#E91E63',   
    social: '#FF5722',   
    default: '#607D8B'   
  };
  
  return colors[category] || colors.default;
};

const EventTile = ({ event, top, height, onDragStart }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  
  const getContrastText = (bgColor) => {
    const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 2), 16);
    const b = parseInt(color.substring(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? '#1e293b' : '#ffffff';
  };
  
  const backgroundColor = event.color || getCategoryColor(event.category);
  const textColor = getContrastText(backgroundColor);
  
  const eventTileStyle = {
    position: 'absolute', 
    top: `${top}px`,
    height: `${Math.max(height, 30)}px`,
    left: '2px',
    right: '8px',
    padding: '4px 8px',
    borderRadius: '6px',
    backgroundColor: event.color || getCategoryColor(event.category),
    color: '#fff',
    fontSize: '0.75rem',
    overflow: 'hidden',
    zIndex: 20,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: event.isExpanded 
      ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
      : (isHovered 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          : '0 1px 3px rgba(0, 0, 0, 0.1)'),
    opacity: isHovered ? 1 : 0.9,
    transform: isHovered ? 'translateY(-1px)' : 'none',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '4px',
      right: '4px',
      width: '8px',
      height: '8px',
      borderBottom: '2px solid rgba(255,255,255,0.5)',
      borderRight: '2px solid rgba(255,255,255,0.5)',
      transform: event.isExpanded ? 'rotate(-135deg)' : 'rotate(45deg)',
      transition: 'transform 0.2s ease'
    }
  };
  
  const handleToggleExpand = (e) => {
    console.log('Event clicked:', event.title);
    e.stopPropagation();
    dispatch(toggleEventExpanded(event._id));
  };
  
  // Delete 
  const handleDelete = (e) => {
    e.stopPropagation();
    
    const confirmDelete = () => {
      dispatch(deleteEvent(event._id));
      
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
      
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
    };
    
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      confirmDelete();
    }
  };
  
  const handleDragStart = (e) => {
    const eventData = {
      _id: event._id,
      id: event._id,
    };
    
    e.dataTransfer.setData('text/plain', JSON.stringify(eventData));
    
    const draggedElement = e.currentTarget;
    draggedElement.classList.add('dragging');
    
    onDragStart(eventData);
    
    const handleDragEnd = () => {
      if (draggedElement) {
        draggedElement.classList.remove('dragging');
      }
      document.removeEventListener('dragend', handleDragEnd);
    };
    document.addEventListener('dragend', handleDragEnd);
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
      style={{
        ...eventTileStyle,
        height: event.isExpanded ? 'auto' : `${height}px`, 
        minHeight: `${height}px`, 
        zIndex: event.isExpanded ? 30 : (isHovered ? 20 : 10) 
      }}
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
            <div style={{ 
              marginTop: '8px',
              padding: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              animation: 'fadeIn 0.2s ease'
            }}>
              <div style={{ marginBottom: '4px' }}>Category: {event.category}</div>
              <DeleteButton onDelete={handleDelete} isVisible={true} />
            </div>
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