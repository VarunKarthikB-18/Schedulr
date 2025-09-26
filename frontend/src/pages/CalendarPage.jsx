import Calendar from "../components/Calendar.jsx";

// Sample tasks data - in a real app, this would come from state management or API
const sampleTasks = [
  { id: 1, name: "Design UI", deadline: "2025-09-25" },
  { id: 2, name: "Setup backend API", deadline: "2025-09-28" },
  { id: 3, name: "Integrate authentication", deadline: "2025-10-01" },
  { id: 4, name: "Deploy to production", deadline: "2025-10-05" },
];

export default function CalendarPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Calendar</h1>
        <p className="text-gray-600">
          View your tasks and deadlines in an interactive calendar format.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Calendar */}
        <div className="lg:col-span-2">
          <Calendar tasks={sampleTasks} />
        </div>
        
        {/* Upcoming Tasks Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Upcoming Tasks
            </h3>
            <div className="space-y-3">
              {sampleTasks
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{task.name}</p>
                      <p className="text-sm text-gray-500">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                ))
              }
            </div>
            
            <button className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Add New Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
