import { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

// Utility functions for recurring tasks
const generateRecurringInstances = (recurringTask, maxInstances = 10) => {
  const instances = [];
  const startDate = new Date(recurringTask.deadline);
  const endDate = recurringTask.recurrence.endDate ? new Date(recurringTask.recurrence.endDate) : null;
  const { type, interval } = recurringTask.recurrence;
  
  let currentDate = new Date(startDate);
  let instanceCount = 0;
  
  while (instanceCount < maxInstances) {
    // Check if we've reached the end date
    if (endDate && currentDate > endDate) break;
    
    // Create instance
    const instance = {
      ...recurringTask,
      id: `${recurringTask.id}_instance_${instanceCount}`,
      deadline: currentDate.toISOString().split('T')[0],
      isInstance: true,
      parentId: recurringTask.id,
      instanceNumber: instanceCount + 1,
      status: 'pending' // Reset status for new instances
    };
    
    instances.push(instance);
    
    // Calculate next occurrence
    switch (type) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + interval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + (interval * 7));
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + interval);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + interval);
        break;
    }
    
    instanceCount++;
  }
  
  return instances;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: 'Complete project proposal',
      description: 'Draft and finalize the project proposal for the client meeting.',
      deadline: '2025-10-15',
      priority: 'high',
      status: 'in-progress',
      createdAt: '2025-10-01T10:00:00Z',
      updatedAt: '2025-10-01T10:00:00Z'
    },
    {
      id: 2,
      name: 'Review design mockups',
      description: 'Go through the latest design mockups and provide feedback.',
      deadline: '2025-10-10',
      priority: 'medium',
      status: 'pending',
      createdAt: '2025-10-01T11:00:00Z',
      updatedAt: '2025-10-01T11:00:00Z'
    },
    {
      id: 3,
      name: 'Update documentation',
      description: 'Update the API documentation with recent changes.',
      deadline: '2025-10-08',
      priority: 'low',
      status: 'completed',
      createdAt: '2025-09-28T14:00:00Z',
      updatedAt: '2025-10-01T09:00:00Z'
    },
    {
      id: 4,
      name: 'Daily standup meeting',
      description: 'Participate in the daily team standup meeting.',
      deadline: '2025-10-02',
      priority: 'medium',
      status: 'pending',
      isRecurring: true,
      recurrence: {
        type: 'daily',
        interval: 1,
        endDate: '2025-10-31'
      },
      createdAt: '2025-10-01T12:00:00Z',
      updatedAt: '2025-10-01T12:00:00Z'
    },
    {
      id: 5,
      name: 'Weekly team retrospective',
      description: 'Reflect on the week and plan improvements for the next sprint.',
      deadline: '2025-10-07',
      priority: 'high',
      status: 'pending',
      isRecurring: true,
      recurrence: {
        type: 'weekly',
        interval: 1,
        endDate: ''
      },
      createdAt: '2025-10-01T13:00:00Z',
      updatedAt: '2025-10-01T13:00:00Z'
    }
  ]);

  // Task management functions
  const addTask = (taskData) => {
    let updatedTasks = [...tasks, taskData];
    
    // If it's a recurring task, generate instances
    if (taskData.isRecurring) {
      const instances = generateRecurringInstances(taskData, 5);
      updatedTasks = [...updatedTasks, ...instances];
    }
    
    setTasks(updatedTasks);
  };

  const updateTask = (taskId, updatedData) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updatedData, updatedAt: new Date().toISOString() } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTaskStatus = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      updateTask(taskId, { status: newStatus });
    }
  };

  // Helper functions for different views
  const getTasksForDate = (date) => {
    const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
    return tasks.filter(task => task.deadline === dateStr);
  };

  const getTasksForWeek = (weekStartDate) => {
    const weekStart = new Date(weekStartDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return taskDate >= weekStart && taskDate <= weekEnd;
    });
  };

  const getUpcomingTasks = (limit = 10) => {
    const today = new Date().toISOString().split('T')[0];
    return tasks
      .filter(task => task.deadline >= today && task.status !== 'completed')
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, limit);
  };

  const getOverdueTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.deadline < today && task.status !== 'completed');
  };

  const getTaskStats = () => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: getOverdueTasks().length
    };
  };

  const contextValue = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getTasksForDate,
    getTasksForWeek,
    getUpcomingTasks,
    getOverdueTasks,
    getTaskStats,
    setTasks
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};