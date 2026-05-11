import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [location, setLocation] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCropSuggestion = async () => {
    if (!location) return;

    setLoading(true);
    setResult(null);

    const res = await fetch(
      `https://former-assistant-service.onrender.com/crop?location=${location}`
    );
    const data = await res.json();

    setTimeout(() => {
      setResult(data);
      setLoading(false);
    }, 500);
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await res.json();

      const city =
        data.address.city ||
        data.address.town ||
        data.address.village;

      setLocation(city);
    });
  };

  const chartData =
    result && typeof result === "object"
      ? [
          { name: "Temp", value: parseFloat(result.temperature) },
          { name: "Humidity", value: parseFloat(result.humidity) },
        ]
      : [];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100">

      {/* 🌿 Floating Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      {/* Main */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-green-700"
        >
          🌾 Agri AI
        </motion.h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Intelligent Farming Made Beautiful
        </p>

        {/* Input */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex gap-3 flex-wrap">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location..."
              className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            />

            <button
              onClick={getCurrentLocation}
              className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition active:scale-90"
            >
              📍
            </button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={getCropSuggestion}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </motion.button>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="mt-6 text-center animate-pulse text-green-700">
            🌱 Growing insights...
          </div>
        )}

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >

            {/* Crops */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="font-semibold mb-4">🌱 Recommended Crops</h2>

              <div className="flex flex-wrap gap-3">
                {result.crops?.map((crop, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-full shadow-sm cursor-pointer"
                  >
                    {crop}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ["🌡 Temp", result.temperature],
                ["💧 Humidity", result.humidity],
                ["☁ Weather", result.condition],
                ["📅 Season", result.season],
              ].map(([label, value], i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white p-4 rounded-xl shadow-md text-center"
                >
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-lg font-semibold">{value}</p>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Advice */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-2xl shadow-lg"
            >
              💡 {result.advice}
            </motion.div>

          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;