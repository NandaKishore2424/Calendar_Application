import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchGoals, 
  selectGoal, 
  createGoal, 
  deleteGoal 
} from '../redux/slices/goalsSlice';
import { 
  fetchTasks, 
  createTask, 
  deleteTask, 
  filterTasksByGoal 
} from '../redux/slices/tasksSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { goals, selectedGoalId, loading: goalsLoading } = useSelector(state => state.goals);
  const { tasks, filteredTasks, loading: tasksLoading } = useSelector(state => state.tasks);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', color: '#4f46e5' });
  const [newTask, setNewTask] = useState({ name: '' });
  const [hoveredGoal, setHoveredGoal] = useState(null);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  // Fetch goals on component mount
  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  // Fetch tasks when goals change
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Filter tasks when selected goal changes
  useEffect(() => {
    dispatch(filterTasksByGoal(selectedGoalId));
  }, [dispatch, selectedGoalId, tasks]);

  // Handle goal selection
  const handleGoalSelect = (goalId) => {
    dispatch(selectGoal(goalId));
  };

  // Handle submitting new goal
  const handleGoalSubmit = (e) => {
    e.preventDefault();
    dispatch(createGoal(newGoal));
    setNewGoal({ name: '', color: '#4f46e5' });
    setShowGoalForm(false);
  };

  // Handle submitting new task
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!selectedGoalId) return;
    
    dispatch(createTask({
      ...newTask,
      goalId: selectedGoalId
    }));
    setNewTask({ name: '' });
    setShowTaskForm(false);
  };

  // Handle deleting a goal
  const handleDeleteGoal = (goalId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this goal? All associated tasks will also be deleted.')) {
      dispatch(deleteGoal(goalId));
    }
  };

  // Handle deleting a task
  const handleDeleteTask = (taskId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId));
    }
  };

  // Handle drag start for tasks
  const handleDragStart = (task, e) => {
    // Set data for dragging to calendar
    const taskData = {
      id: task._id,
      title: task.name,
      category: 'work', // Default category
      color: task.color
    };
    e.dataTransfer.setData('text/plain', JSON.stringify(taskData));
    
    // Add dragging class to improve appearance during drag
    e.currentTarget.classList.add('dragging');
    
    // Remove class when drag ends
    const handleDragEnd = () => {
      e.currentTarget.classList.remove('dragging');
      document.removeEventListener('dragend', handleDragEnd);
    };
    document.addEventListener('dragend', handleDragEnd);
  };

  // Enhanced styles
  const sidebarStyle = {
    width: '280px',
    height: '100%',
    backgroundColor: 'white',
    boxShadow: '4px 0 10px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #f0f0f0',
    overflow: 'hidden'
  };
  
  const sidebarContentStyle = {
    padding: '1.5rem',
    overflowY: 'auto',
    flex: 1
  };
  
  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #f1f5f9'
  };
  
  const addButtonStyle = {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    boxShadow: '0 1px 2px rgba(79, 70, 229, 0.15)',
    transition: 'all 0.2s ease',
    marginBottom: '1.5rem'
  };
  
  const addButtonHoverStyle = {
    ...addButtonStyle,
    backgroundColor: '#4338ca',
    boxShadow: '0 3px 6px rgba(79, 70, 229, 0.25)'
  };
  
  const formStyle = {
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04), inset 0 1px 2px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f1f5f9',
    animation: 'fadeIn 0.2s ease'
  };
  
  const inputStyle = {
    width: '100%',
    padding: '0.65rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    backgroundColor: 'white',
    marginBottom: '0.75rem'
  };
  
  const inputFocusStyle = {
    ...inputStyle,
    borderColor: '#4f46e5',
    boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.2)',
    outline: 'none'
  };
  
  const colorInputStyle = {
    width: '2rem',
    height: '2rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    overflow: 'hidden'
  };
  
  const formActionsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '0.75rem'
  };
  
  const cancelButtonStyle = {
    padding: '0.375rem 0.75rem',
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };
  
  const saveButtonStyle = {
    padding: '0.375rem 0.75rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };
  
  const sectionTitleStyle = {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };
  
  const goalItemStyle = (isSelected, isHovered) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0.75rem',
    borderRadius: '0.375rem',
    marginBottom: '0.375rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    backgroundColor: isSelected ? '#f0f4ff' : (isHovered ? '#f8fafc' : 'transparent'),
    border: `1px solid ${isSelected ? '#c7d2fe' : 'transparent'}`,
    transform: isHovered && !isSelected ? 'translateY(-1px)' : 'none',
    boxShadow: isHovered && !isSelected ? '0 2px 4px rgba(0, 0, 0, 0.04)' : 'none'
  });
  
  const goalNameStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#334155'
  };
  
  const goalColorDotStyle = (color) => ({
    width: '0.75rem',
    height: '0.75rem',
    borderRadius: '50%',
    backgroundColor: color,
    display: 'inline-block',
    boxShadow: '0 0 2px rgba(0, 0, 0, 0.1)'
  });
  
  const deleteButtonStyle = {
    width: '1.25rem',
    height: '1.25rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1rem',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    opacity: 0.6
  };
  
  const deleteButtonHoverStyle = {
    ...deleteButtonStyle,
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    opacity: 1
  };
  
  const tasksSectionStyle = {
    marginTop: '1.5rem'
  };
  
  const tasksSectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  };
  
  const addTaskButtonStyle = {
    backgroundColor: 'transparent',
    color: '#4f46e5',
    border: 'none',
    fontSize: '0.75rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    cursor: 'pointer',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    transition: 'all 0.15s ease'
  };
  
  const addTaskButtonHoverStyle = {
    ...addTaskButtonStyle,
    backgroundColor: '#f0f4ff'
  };
  
  const taskItemStyle = (isHovered) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: isHovered ? '#f8fafc' : '#f1f5f9',
    borderRadius: '0.375rem',
    marginBottom: '0.5rem',
    cursor: 'grab',
    border: '1px solid #e2e8f0',
    transition: 'all 0.15s ease',
    transform: isHovered ? 'translateY(-1px)' : 'none',
    boxShadow: isHovered ? '0 2px 4px rgba(0, 0, 0, 0.08)' : 'none'
  });
  
  const taskNameStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#334155'
  };
  
  const taskColorBarStyle = (color) => ({
    width: '0.25rem',
    height: '1.25rem',
    backgroundColor: color,
    borderRadius: '1rem',
    display: 'inline-block'
  });
  
  const messageStyle = {
    fontSize: '0.875rem',
    color: '#64748b',
    fontStyle: 'italic',
    padding: '0.75rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.375rem',
    textAlign: 'center'
  };
  
  const loadingStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    color: '#64748b'
  };
  
  const spinnerStyle = {
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    border: '2px solid #e2e8f0',
    borderTopColor: '#4f46e5',
    animation: 'spin 1s linear infinite'
  };
  
  // State for focused inputs
  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <div style={sidebarStyle}>
      <div style={sidebarContentStyle}>
        <h2 style={titleStyle}>Goals &amp; Tasks</h2>
        
        {/* Add Goal Button */}
        <button 
          style={hoveredButton === 'addGoal' ? addButtonHoverStyle : addButtonStyle}
          onClick={() => setShowGoalForm(true)}
          onMouseEnter={() => setHoveredButton('addGoal')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <span style={{ fontSize: '1rem' }}>+</span> Add Goal
        </button>
        
        {/* Goal Form */}
        {showGoalForm && (
          <div style={formStyle}>
            <form onSubmit={handleGoalSubmit}>
              <input
                type="text"
                placeholder="Goal name"
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                style={focusedInput === 'goalName' ? inputFocusStyle : inputStyle}
                onFocus={() => setFocusedInput('goalName')}
                onBlur={() => setFocusedInput(null)}
                required
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: '500' }}>Color:</label>
                <input
                  type="color"
                  value={newGoal.color}
                  onChange={(e) => setNewGoal({...newGoal, color: e.target.value})}
                  style={colorInputStyle}
                />
              </div>
              <div style={formActionsStyle}>
                <button
                  type="button"
                  onClick={() => setShowGoalForm(false)}
                  style={hoveredButton === 'cancelGoal' ? {...cancelButtonStyle, backgroundColor: '#e5e7eb'} : cancelButtonStyle}
                  onMouseEnter={() => setHoveredButton('cancelGoal')}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={hoveredButton === 'saveGoal' ? {...saveButtonStyle, backgroundColor: '#4338ca'} : saveButtonStyle}
                  onMouseEnter={() => setHoveredButton('saveGoal')}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Goals List */}
        <div>
          <h3 style={sectionTitleStyle}>My Goals</h3>
          {goalsLoading ? (
            <div style={loadingStyle}>
              <div style={spinnerStyle}></div>
              <span>Loading goals...</span>
            </div>
          ) : goals.length === 0 ? (
            <div style={messageStyle}>
              No goals yet. Create one to get started!
            </div>
          ) : (
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {goals.map(goal => (
                <li 
                  key={goal._id}
                  style={goalItemStyle(goal._id === selectedGoalId, hoveredGoal === goal._id)}
                  onClick={() => handleGoalSelect(goal._id)}
                  onMouseEnter={() => setHoveredGoal(goal._id)}
                  onMouseLeave={() => setHoveredGoal(null)}
                >
                  <div style={goalNameStyle}>
                    <span style={goalColorDotStyle(goal.color)}></span>
                    <span>{goal.name}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteGoal(goal._id, e)}
                    style={hoveredGoal === goal._id ? deleteButtonHoverStyle : deleteButtonStyle}
                    aria-label={`Delete ${goal.name}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Tasks Section */}
        {selectedGoalId && (
          <div style={tasksSectionStyle}>
            <div style={tasksSectionHeaderStyle}>
              <h3 style={sectionTitleStyle}>Tasks</h3>
              <button 
                style={hoveredButton === 'addTask' ? addTaskButtonHoverStyle : addTaskButtonStyle}
                onClick={() => setShowTaskForm(true)}
                onMouseEnter={() => setHoveredButton('addTask')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <span style={{ fontSize: '0.875rem' }}>+</span> Add Task
              </button>
            </div>
            
            {/* Task Form */}
            {showTaskForm && (
              <div style={formStyle}>
                <form onSubmit={handleTaskSubmit}>
                  <input
                    type="text"
                    placeholder="Task name"
                    value={newTask.name}
                    onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                    style={focusedInput === 'taskName' ? inputFocusStyle : inputStyle}
                    onFocus={() => setFocusedInput('taskName')}
                    onBlur={() => setFocusedInput(null)}
                    required
                  />
                  <div style={formActionsStyle}>
                    <button
                      type="button"
                      onClick={() => setShowTaskForm(false)}
                      style={hoveredButton === 'cancelTask' ? {...cancelButtonStyle, backgroundColor: '#e5e7eb'} : cancelButtonStyle}
                      onMouseEnter={() => setHoveredButton('cancelTask')}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={hoveredButton === 'saveTask' ? {...saveButtonStyle, backgroundColor: '#4338ca'} : saveButtonStyle}
                      onMouseEnter={() => setHoveredButton('saveTask')}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      Save Task
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Tasks List */}
            {tasksLoading ? (
              <div style={loadingStyle}>
                <div style={spinnerStyle}></div>
                <span>Loading tasks...</span>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div style={messageStyle}>
                No tasks yet. Add a task for this goal.
              </div>
            ) : (
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {filteredTasks.map(task => (
                  <li 
                    key={task._id}
                    style={taskItemStyle(hoveredTask === task._id)}
                    draggable
                    onDragStart={(e) => handleDragStart(task, e)}
                    onMouseEnter={() => setHoveredTask(task._id)}
                    onMouseLeave={() => setHoveredTask(null)}
                  >
                    <div style={taskNameStyle}>
                      <span style={taskColorBarStyle(task.color)}></span>
                      <span>{task.name}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteTask(task._id, e)}
                      style={hoveredTask === task._id ? deleteButtonHoverStyle : deleteButtonStyle}
                      aria-label={`Delete ${task.name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        {!selectedGoalId && !goalsLoading && goals.length > 0 && (
          <div style={{...messageStyle, marginTop: '1.5rem'}}>
            Select a goal to see or add tasks.
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .dragging {
          opacity: 0.6;
          transform: scale(0.98);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;