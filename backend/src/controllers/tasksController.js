const Task = require('../models/Task');
const Goal = require('../models/Goal');

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    let query;
    
    if (req.query.goalId) {
      query = Task.find({ goalId: req.query.goalId });
    } else {
      query = Task.find();
    }
    
    if (req.query.populate === 'true') {
      query = query.populate('goalId');
    }
    
    const tasks = await query;
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('goalId');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create task
exports.createTask = async (req, res) => {
  try {
    const goal = await Goal.findById(req.body.goalId);
    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }
    
    // Create task
    const task = await Task.create({
      ...req.body,
      color: goal.color 
    });
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    if (req.body.goalId && req.body.goalId !== task.goalId.toString()) {
      const goal = await Goal.findById(req.body.goalId);
      if (!goal) {
        return res.status(404).json({
          success: false,
          error: 'New goal not found'
        });
      }
      req.body.color = goal.color;
    }
    
    task = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    await task.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};