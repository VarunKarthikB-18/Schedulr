export default function TaskItem({ task }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center transition hover:scale-105 hover:shadow-lg">
      <div>
        <span className="text-lg font-semibold text-blue-700">{task.name}</span>
        <div className="text-gray-500 text-xs mt-2">Deadline: {task.deadline}</div>
      </div>
      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
        Details
      </button>
    </div>
  );
}
