const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Goal name is required'],
    trim: true,
    unique: true
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    validate: {
      validator: function(value) {
        // Simple hex color validation
        return /^#([0-9A-F]{3}){1,2}$/i.test(value);
      },
      message: 'Color must be a valid hex color code (e.g., #00CED1)'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for tasks (link to tasks)
goalSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'goalId'
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;