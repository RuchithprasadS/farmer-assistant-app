import { useState } from "react";

function App() {
  const [location, setLocation] = useState("");
  const [result, setResult] = useState("");

  const getCropSuggestion = async () => {
    setResult("Loading..."); 
    if (!location) {
        setResult("Please enter a location ❗");
        return;
      }

    const response = await fetch(
      `https://former-assistant-service.onrender.com/crop?location=${location}`
    );

    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300">
  
      {/* Header */}
      <header className="bg-green-700 text-white shadow-lg p-5">
        <h1 className="text-4xl font-bold text-center">
          🌾 Agri Helper AI
        </h1>
  
        <p className="text-center mt-2 text-green-100">
          Smart Crop Recommendation for Farmers
        </p>
      </header>
  
      {/* Main Content */}
      <div className="flex justify-center items-center px-4 py-16">
  
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-10">
  
          <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
            Get Crop Suggestions
          </h2>
  
          <input
            type="text"
            placeholder="Enter state or city"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-4 focus:ring-green-300"
          />
  
          <button
            onClick={getCropSuggestion}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white text-lg font-semibold py-4 rounded-xl mt-5"
          >
            Get Suggestion
          </button>
  
          {/* Result */}
          <div className="mt-8">
  
            {result === "loading" ? (
              <p className="text-center text-gray-600 text-lg">
                ⏳ Loading...
              </p>
            ) : typeof result === "string" ? (
              <p className="text-center text-red-500 font-semibold">
                {result}
              </p>
            ) : (
              result && (
                <div className="bg-green-50 rounded-2xl p-6 shadow-inner space-y-4">
  
                  <h3 className="text-2xl font-bold text-green-700 text-center">
                    🌱 Recommendation
                  </h3>
  
                  <p className="text-lg">
                    <strong>🌾 Crop:</strong> {result.crop}
                  </p>
  
                  <p className="text-lg">
                    <strong>📅 Season:</strong> {result.season}
                  </p>
  
                  <p className="text-lg">
                    <strong>💧 Water Needs:</strong> {result.water}
                  </p>
  
                  <p className="text-lg">
                    <strong>🌡 Temperature:</strong> {result.temperature}
                  </p>
  
                </div>
              )
            )}
  
          </div>
  
        </div>
  
      </div>
  
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0f4f8",
  },
  card: {
    padding: "30px",
    borderRadius: "10px",
    background: "white",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "300px",
  },
  input: {
    padding: "10px",
    width: "100%",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    width: "100%",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  result: {
    marginTop: "20px",
    fontWeight: "bold",
    color: "#2e7d32",
  },
};

export default App;