export default function TailwindDemo() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-10">
      <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">Tailwind CSS is Working!</h1>
      <button className="bg-white text-blue-600 px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition">
        Click Me
      </button>
    </div>
  );
}
