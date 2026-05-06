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
      `http://localhost:8080/crop?location=${location}`
    );

    const data = await response.json();
    setResult(data);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>🌾 Farmer Assistant</h1>

        <input
          type="text"
          placeholder="Enter location (e.g. Karnataka)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={styles.input}
        />

        <button onClick={getCropSuggestion} style={styles.button}>
          Get Suggestion
        </button>

        {typeof result === "string" ? (
  <div style={styles.result}>{result}</div>
) : (
  result && (
    <div style={styles.result}>
      <p><strong>🌾 Crop:</strong> {result.crop}</p>
      <p><strong>📅 Season:</strong> {result.season}</p>
      <p><strong>💧 Water Needs:</strong> {result.water}</p>
      <p><strong>🌡️ Temperature:</strong> {result.temperature}</p>
    </div>
  )
)}
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