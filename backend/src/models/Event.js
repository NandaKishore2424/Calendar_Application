const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['exercise', 'eating', 'work', 'relax', 'family', 'social'],
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required'],
    validate: {
      validator: function(value) {
        return value > this.startTime;
      },
      message: 'End time must be after start time'
    }
  },
  date: {
    type: String,
    required: [true, 'Date string (YYYY-MM-DD) is required'],
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'] 
  },
  color: {
    type: String,
    default: function() {
      const colors = {
        exercise: '#4CAF50', 
        eating: '#FF9800',   
        work: '#2196F3',     
        relax: '#9C27B0',    
        family: '#E91E63',   
        social: '#FF5722'    
      };
      return colors[this.category] || '#607D8B'; 
    }
  },
  isExpanded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


const Event = mongoose.model('Event', eventSchema);

module.exports = Event;