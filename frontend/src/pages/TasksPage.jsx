import { useState } from "react";
import TaskItem from "../components/TaskItem.jsx";

const initialTasks = [
  { id: 1, name: "Design UI", deadline: "2025-10-01", priority: "high" },
  { id: 2, name: "Setup backend API", deadline: "2025-10-05", priority: "medium" },
  { id: 3, name: "Integrate authentication", deadline: "2025-10-10", priority: "low" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    deadline: "",
    priority: "medium"
  });

  const priorityOrder = { high: 3, medium: 2, low: 1 };

  const sortedTasks = [...tasks].sort((a, b) => {
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
        ...newTask
      };
      setTasks([...tasks, task]);
      setNewTask({ name: "", deadline: "", priority: "medium" });
      setShowForm(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {showForm ? "Cancel" : "Add Task"}
        </button>
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
                  Deadline
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
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
      
      {sortedTasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No tasks yet!</p>
          <p className="text-sm">Click "Add Task" to create your first task.</p>
        </div>
      )}
    </div>
  );
}
