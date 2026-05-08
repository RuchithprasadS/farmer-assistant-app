import { useState } from "react";

function App() {
  const [location, setLocation] = useState("");
  const [result, setResult] = useState("");

  const getCropSuggestion = async () => {
    if (!location) {
      setResult("Please enter a location ❗");
      return;
    }

    try {
      setResult("loading");

      const response = await fetch(
        `https://former-assistant-service.onrender.com/crop?location=${location}`
      );

      const data = await response.json();

      if (data.error) {
        setResult(data.error);
      } else {
        setResult(data);
      }
    } catch (error) {
      setResult("Something went wrong ❌");
    }
  };

  // 🌦 Weather Icon Logic
  const getWeatherIcon = (condition) => {
    if (!condition) return "🌤";
    const c = condition.toLowerCase();
    if (c.includes("rain")) return "🌧";
    if (c.includes("cloud")) return "☁";
    if (c.includes("clear")) return "☀";
    return "🌤";
  };

  // 🎯 Confidence Mapping
  const confidenceMap = {
    High: "90%",
    Medium: "70%",
    Low: "50%",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef')",
      }}
    >
      <div className="w-full max-w-xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 text-white">

        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-2">
          🌾 Agri AI Assistant
        </h1>

        <p className="text-center text-green-100 mb-6">
          Smart farming powered by real-time AI insights
        </p>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter city (e.g., Bangalore)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-4 rounded-xl bg-white/20 border border-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-green-300 transition"
        />

        {/* Button */}
        <button
          onClick={getCropSuggestion}
          className="w-full mt-5 py-4 rounded-xl bg-green-400 text-green-900 font-semibold hover:bg-green-300 transition transform hover:scale-105 active:scale-95"
        >
          🤖 Analyze & Recommend
        </button>

        {/* Result */}
        <div className="mt-8">
          {result === "loading" ? (
            <p className="text-center animate-pulse text-lg">
              ⏳ AI is analyzing weather...
            </p>
          ) : typeof result === "string" ? (
            <p className="text-center text-red-300 font-semibold">
              {result}
            </p>
          ) : (
            result && (
              <div className="mt-6 p-6 rounded-2xl bg-white/20 border border-white/30 space-y-4">

                {/* Location */}
                <p className="text-center text-sm text-green-200">
                  📍 Showing results for <strong>{location}</strong>
                </p>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center">
                  🌱 Recommended Crops
                </h2>

                {/* Crops */}
                <p className="text-center text-lg font-semibold text-green-200">
                  🌽 {result.crops?.join(" 🌾 ")}
                </p>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">

                  <div>
                    📅 <strong>Season:</strong><br />
                    {result.season}
                  </div>

                  <div>
                    🌡 <strong>Temp:</strong><br />
                    {result.temperature}
                  </div>

                  <div>
                    💧 <strong>Humidity:</strong><br />
                    {result.humidity}
                  </div>

                  <div>
                    {getWeatherIcon(result.condition)}{" "}
                    <strong>Weather:</strong><br />
                    {result.condition}
                  </div>

                  <div>
                    🚿 <strong>Water:</strong><br />
                    {result.water}
                  </div>
                </div>

                {/* Advice */}
                <div className="mt-4 p-3 bg-white/10 rounded-xl">
                  📊 <strong>Advice:</strong> {result.advice}
                </div>

                {/* Confidence Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>🎯 Confidence</span>
                    <span>
                      {confidenceMap[result.confidence] ||
                        result.confidence}
                    </span>
                  </div>

                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-green-300 h-2 rounded-full"
                      style={{
                        width:
                          confidenceMap[result.confidence] ||
                          result.confidence ||
                          "70%",
                      }}
                    />
                  </div>
                </div>

                {/* Explanation */}
                <div className="text-sm mt-4 opacity-90">
                  <p className="font-semibold mb-1">
                    Why this recommendation?
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Based on real-time weather conditions</li>
                    <li>Temperature & humidity suitability</li>
                    <li>Seasonal crop alignment</li>
                  </ul>
                </div>

              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}

export default App;