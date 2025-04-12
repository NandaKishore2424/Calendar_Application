const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Task name is required'],
    trim: true
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: [true, 'Goal reference is required']
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware to inherit color from goal
taskSchema.pre('save', async function(next) {
  if (!this.color || this.isModified('goalId')) {
    try {
      const Goal = mongoose.model('Goal');
      const goal = await Goal.findById(this.goalId);
      if (goal) {
        this.color = goal.color;
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;