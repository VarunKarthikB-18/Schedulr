import TaskItem from "../components/TaskItem.jsx";

const tasks = [
  { id: 1, name: "Design UI", deadline: "2025-10-01" },
  { id: 2, name: "Setup backend API", deadline: "2025-10-05" },
  { id: 3, name: "Integrate authentication", deadline: "2025-10-10" },
];

export default function TasksPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
