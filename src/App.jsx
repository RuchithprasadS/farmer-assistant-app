import { useState } from "react";

function App() {
  const [location, setLocation] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // 🌾 Fetch Crop Suggestion
  const getCropSuggestion = async () => {
    if (!location) {
      setResult("Please enter a location ❗");
      return;
    }

    try {
      setLoading(true);
      setResult("");

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
    } finally {
      setLoading(false);
    }
  };

  // 📍 GPS Auto Location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setResult("Geolocation not supported ❌");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocode (free API)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village;

          setLocation(city || "");
          setResult(`📍 Auto-detected: ${city}`);

        } catch {
          setResult("Unable to fetch location ❌");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setResult("Location permission denied ❌");
        setLoading(false);
      }
    );
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
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 text-white backdrop-blur-xl">

        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-2">
          🌾 Agri AI Assistant
        </h1>

        <p className="text-center text-green-200 mb-6">
          Smart farming powered by AI + Real-time Weather
        </p>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter city (e.g., Bangalore)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-4 rounded-xl bg-white/20 border border-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-green-300"
        />

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={getCropSuggestion}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-green-400 text-green-900 font-semibold hover:bg-green-300 transition transform hover:scale-105 disabled:opacity-50"
          >
            🤖 Analyze
          </button>

          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-blue-400 text-blue-900 font-semibold hover:bg-blue-300 transition transform hover:scale-105 disabled:opacity-50"
          >
            📍 Auto Detect
          </button>
        </div>

        {/* Result */}
        <div className="mt-8">
          {loading ? (
            <p className="text-center animate-pulse text-lg">
              ⏳ AI is analyzing...
            </p>
          ) : typeof result === "string" ? (
            <p className="text-center text-red-300 font-semibold">
              {result}
            </p>
          ) : (
            result && (
              <div className="mt-6 p-6 rounded-2xl bg-white/20 border border-white/30 space-y-4">

                <p className="text-center text-sm text-green-200">
                  📍 {location}
                </p>

                <h2 className="text-2xl font-bold text-center">
                  🌱 Recommended Crops
                </h2>

                <p className="text-center text-lg font-semibold text-green-200">
                  🌽 {result.crops?.join(" 🌾 ")}
                </p>

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

                <div className="mt-4 p-3 bg-white/10 rounded-xl">
                  📊 <strong>Advice:</strong> {result.advice}
                </div>

                {/* Confidence */}
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

              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}

export default App;