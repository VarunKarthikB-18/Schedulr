export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-16 rounded-lg shadow-lg mb-12">
      <h1 className="text-5xl font-bold mb-4">Welcome to Schedulr</h1>
      <p className="text-lg max-w-xl">
        Organize your tasks and schedule smartly with Schedulr. Boost productivity and stay on track effortlessly.
      </p>
      <button className="mt-6 px-6 py-3 bg-white text-blue-700 rounded-lg shadow hover:bg-gray-100 transition">
        Get Started
      </button>
    </section>
  );
}
