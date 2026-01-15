export default function Home() {
  return (
    <div className="min-h-screen pt-20 px-6">
      <h1 className="text-red-500 text-4xl font-bold mb-4">
        Testing Tailwind CSS - This should be RED
      </h1>
      <p className="text-blue-600 text-xl mb-2">
        This text should be BLUE
      </p>
      <p className="text-green-500 text-xl mb-2">
        This text should be GREEN
      </p>
      <div className="bg-yellow-200 p-4 rounded-lg mt-4">
        <p className="text-gray-800">
          This should have a yellow background
        </p>
      </div>
    </div>
  );
}