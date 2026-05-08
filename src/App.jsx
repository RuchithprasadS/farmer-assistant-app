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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-800 to-green-600 flex items-center justify-center px-4">

      <div className="w-full max-w-xl backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 text-white">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-2">
          🌾 Agri AI Assistant
        </h1>

        <p className="text-center text-green-100 mb-8">
          AI-powered smart farming assistant for better yield 🌿
        </p>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter city (e.g., Bangalore)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-4 rounded-xl bg-white/20 border border-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-green-300 focus:scale-105 transition"
        />

        {/* Button */}
        <button
          onClick={getCropSuggestion}
          className="w-full mt-5 py-4 rounded-xl bg-white text-green-800 font-semibold hover:bg-green-100 transition transform hover:scale-105 active:scale-95"
        >
          🚀 Get AI Suggestion
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

                <h2 className="text-2xl font-bold text-center mb-4">
                  🌱 AI Recommendation
                </h2>

                <div className="grid grid-cols-2 gap-4 text-sm">

                  <div>
                    🌾 <strong>Crops:</strong><br />
                    {result.crops?.join(", ")}
                  </div>

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
                    ☁ <strong>Weather:</strong><br />
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

                <div className="text-center text-sm mt-2 opacity-80">
                  🎯 Confidence: {result.confidence}
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