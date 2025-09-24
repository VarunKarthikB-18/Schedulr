export default function TaskItem({ task }) {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: '🔴',
          label: 'High',
          borderColor: 'border-l-red-500'
        };
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: '🟡',
          label: 'Medium',
          borderColor: 'border-l-yellow-500'
        };
      case 'low':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: '🟢',
          label: 'Low',
          borderColor: 'border-l-green-500'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '⚪',
          label: 'Normal',
          borderColor: 'border-l-gray-500'
        };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  
  // Calculate urgency based on deadline
  const today = new Date();
  const deadline = new Date(task.deadline);
  const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  
  const getUrgencyIndicator = (days) => {
    if (days < 0) return { text: 'Overdue', color: 'text-red-600 font-bold' };
    if (days === 0) return { text: 'Due Today', color: 'text-red-500 font-semibold' };
    if (days === 1) return { text: 'Due Tomorrow', color: 'text-orange-500 font-semibold' };
    if (days <= 3) return { text: `${days} days left`, color: 'text-orange-400' };
    if (days <= 7) return { text: `${days} days left`, color: 'text-yellow-600' };
    return { text: `${days} days left`, color: 'text-gray-500' };
  };

  const urgency = getUrgencyIndicator(daysUntilDeadline);

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${priorityConfig.borderColor} transition hover:scale-[1.02] hover:shadow-lg`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg font-semibold text-blue-700">{task.name}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityConfig.color}`}>
              {priorityConfig.icon} {priorityConfig.label}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="text-gray-600">
              📅 Deadline: {new Date(task.deadline).toLocaleDateString()}
            </div>
            <div className={urgency.color}>
              ⏰ {urgency.text}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs transition">
            Details
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs transition">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
