import { useState } from "react";
import TaskItem from "../components/TaskItem.jsx";

const initialTasks = [];

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    deadline: "",
    priority: "medium",
    description: "",
    isRecurring: false,
    recurrence: {
      type: "daily",
      interval: 1,
      endDate: ""
    }
  });

  const priorityOrder = { high: 3, medium: 2, low: 1 };

  // Function to generate recurring task instances
  const expandRecurringTasks = (tasks) => {
    const expanded = [];
    const now = new Date();
    const futureLimit = new Date();
    futureLimit.setMonth(futureLimit.getMonth() + 3); // Show 3 months ahead

    tasks.forEach(task => {
      if (!task.isRecurring) {
        expanded.push(task);
        return;
      }

      const startDate = new Date(task.deadline);
      const endDate = task.recurrence.endDate ? new Date(task.recurrence.endDate) : futureLimit;
      let currentDate = new Date(startDate);
      let instanceCount = 0;
      const maxInstances = 50; // Prevent infinite loops

      while (currentDate <= endDate && currentDate <= futureLimit && instanceCount < maxInstances) {
        if (currentDate >= now || currentDate.toDateString() === now.toDateString()) {
          expanded.push({
            ...task,
            id: `${task.id}-${currentDate.toISOString().split('T')[0]}`,
            deadline: currentDate.toISOString().split('T')[0],
            isInstance: true,
            originalId: task.id
          });
        }

        // Calculate next occurrence
        switch (task.recurrence.type) {
          case 'daily':
            currentDate.setDate(currentDate.getDate() + task.recurrence.interval);
            break;
          case 'weekly':
            currentDate.setDate(currentDate.getDate() + (7 * task.recurrence.interval));
            break;
          case 'monthly':
            currentDate.setMonth(currentDate.getMonth() + task.recurrence.interval);
            break;
          case 'yearly':
            currentDate.setFullYear(currentDate.getFullYear() + task.recurrence.interval);
            break;
          default:
            currentDate = new Date(endDate.getTime() + 1); // Break the loop
        }
        instanceCount++;
      }
    });

    return expanded;
  };

  const expandedTasks = expandRecurringTasks(tasks);
  const sortedTasks = [...expandedTasks].sort((a, b) => {
    // Sort by priority first, then by deadline
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.name && newTask.deadline) {
      const task = {
        id: Date.now(),
        ...newTask,
        // Ensure recurrence data is clean
        recurrence: newTask.isRecurring ? newTask.recurrence : null,
        createdAt: new Date().toISOString(),
        description: newTask.description || ""
      };
      setTasks([...tasks, task]);
      setNewTask({ 
        name: "", 
        deadline: "", 
        priority: "medium",
        isRecurring: false,
        description: "",
        recurrence: {
          type: "daily",
          interval: 1,
          endDate: ""
        }
      });
      setShowForm(false);
    }
  };

  const handleShowDetails = (task) => {
    setSelectedTask(task);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedTask(null);
    setShowDetails(false);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      if (taskToDelete.isInstance) {
        // For recurring task instances, just filter out this specific instance
        setTasks(tasks.filter(t => t.id !== taskToDelete.id));
      } else {
        // For regular tasks or recurring parent tasks, remove completely
        setTasks(tasks.filter(t => 
          t.id !== taskToDelete.id && 
          t.originalId !== taskToDelete.id
        ));
      }
    }
    setTaskToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleClearAllClick = () => {
    setShowClearAllConfirm(true);
  };

  const handleConfirmClearAll = () => {
    setTasks([]);
    setShowClearAllConfirm(false);
  };

  const handleCancelClearAll = () => {
    setShowClearAllConfirm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <div className="flex gap-3">
          {sortedTasks.length > 0 && (
            <button
              onClick={handleClearAllClick}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {showForm ? "Cancel" : "Add Task"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
          <form onSubmit={handleAddTask}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Name
                </label>
                <input
                  type="text"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {newTask.isRecurring ? "Start Date" : "Deadline"}
                </label>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">🔴 High Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="low">🟢 Low Priority</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any additional details or notes about this task..."
                rows="3"
              />
            </div>
            
            {/* Recurrence Controls */}
            <div className="mb-4">
              <label className="flex items-center space-x-3 mb-3">
                <input
                  type="checkbox"
                  checked={newTask.isRecurring}
                  onChange={(e) => setNewTask({ ...newTask, isRecurring: e.target.checked })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">🔄 Make this a recurring task</span>
              </label>
              
              {newTask.isRecurring && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Repeat
                      </label>
                      <select
                        value={newTask.recurrence.type}
                        onChange={(e) => setNewTask({ 
                          ...newTask, 
                          recurrence: { ...newTask.recurrence, type: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="daily">📅 Daily</option>
                        <option value="weekly">📆 Weekly</option>
                        <option value="monthly">🗓️ Monthly</option>
                        <option value="yearly">📋 Yearly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Every
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={newTask.recurrence.interval}
                          onChange={(e) => setNewTask({ 
                            ...newTask, 
                            recurrence: { ...newTask.recurrence, interval: parseInt(e.target.value) || 1 }
                          })}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">
                          {newTask.recurrence.type === 'daily' && 'day(s)'}
                          {newTask.recurrence.type === 'weekly' && 'week(s)'}
                          {newTask.recurrence.type === 'monthly' && 'month(s)'}
                          {newTask.recurrence.type === 'yearly' && 'year(s)'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={newTask.recurrence.endDate}
                        onChange={(e) => setNewTask({ 
                          ...newTask, 
                          recurrence: { ...newTask.recurrence, endDate: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min={newTask.deadline}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 This task will repeat automatically based on your settings
                  </p>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Add Task
            </button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {sortedTasks.map((task) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onShowDetails={handleShowDetails}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>
      
      {sortedTasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No tasks yet!</p>
          <p className="text-sm">Click "Add Task" to create your first task.</p>
        </div>
      )}

      {/* Task Details Modal */}
      {showDetails && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Task Details</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Task Name</label>
                  <p className="text-lg font-semibold text-blue-700">{selectedTask.name}</p>
                </div>
                
                {selectedTask.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                      {selectedTask.description}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Priority</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTask.priority === 'high' ? 'bg-red-100 text-red-800' :
                      selectedTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedTask.priority === 'high' && '🔴 High Priority'}
                      {selectedTask.priority === 'medium' && '🟡 Medium Priority'}
                      {selectedTask.priority === 'low' && '🟢 Low Priority'}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {selectedTask.isRecurring && !selectedTask.isInstance ? 'Start Date' : 'Due Date'}
                    </label>
                    <p className="text-gray-800">{new Date(selectedTask.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {selectedTask.isRecurring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Recurrence</label>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-800">
                        🔄 Repeats every {selectedTask.recurrence?.interval || 1} {selectedTask.recurrence?.type}
                        {selectedTask.recurrence?.interval > 1 ? 's' : ''}
                      </p>
                      {selectedTask.recurrence?.endDate && (
                        <p className="text-blue-600 text-sm mt-1">
                          Ends: {new Date(selectedTask.recurrence.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedTask.isInstance && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Instance Info</label>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-800">🔄 This is a recurring task instance</p>
                      <p className="text-blue-600 text-sm">Generated from recurring schedule</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const today = new Date();
                      const deadline = new Date(selectedTask.deadline);
                      const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
                      
                      if (daysUntil < 0) {
                        return <span className="text-red-600 font-semibold">⚠️ Overdue by {Math.abs(daysUntil)} day(s)</span>;
                      } else if (daysUntil === 0) {
                        return <span className="text-red-500 font-semibold">🔥 Due Today</span>;
                      } else if (daysUntil === 1) {
                        return <span className="text-orange-500 font-semibold">⏰ Due Tomorrow</span>;
                      } else {
                        return <span className="text-green-600">✅ {daysUntil} days remaining</span>;
                      }
                    })()}
                  </div>
                </div>
                
                {selectedTask.createdAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Created</label>
                    <p className="text-gray-500 text-sm">
                      {new Date(selectedTask.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={handleCloseDetails}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleCloseDetails();
                    handleDeleteClick(selectedTask);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="text-red-500 text-2xl mr-3">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-800">Delete Task</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{taskToDelete.name}"?
              </p>
              
              {taskToDelete.isRecurring && !taskToDelete.isInstance && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ This will delete the recurring task and all its future instances.
                  </p>
                </div>
              )}
              
              {taskToDelete.isInstance && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
                  <p className="text-blue-800 text-sm">
                    ℹ️ This will only delete this specific instance of the recurring task.
                  </p>
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Tasks Confirmation Modal */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="text-red-500 text-2xl mr-3">🗑️</div>
                <h3 className="text-lg font-semibold text-gray-800">Clear All Tasks</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete all tasks? This action cannot be undone.
              </p>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4">
                <p className="text-red-800 text-sm">
                  ⚠️ This will permanently delete all {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''}, including recurring tasks and their instances.
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelClearAll}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmClearAll}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Clear All Tasks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
