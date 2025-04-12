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
    type: Date,
    required: [true, 'Date is required']
  },
  color: {
    type: String,
    default: function() {
      const colors = {
        exercise: '#4CAF50', // green
        eating: '#FF9800',   // orange
        work: '#2196F3',     // blue
        relax: '#9C27B0',    // purple
        family: '#E91E63',   // pink
        social: '#FF5722'    // deep orange
      };
      return colors[this.category] || '#607D8B'; // default gray
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

// Index for efficient queries
eventSchema.index({ date: 1, startTime: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;