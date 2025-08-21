import { useState, useEffect } from "react";

function App() {
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8888/api/test");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setServerMessage(data.message);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setServerMessage("Failed to connect to the server. Is it running?");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Migrator</h1>
      <h2>Connecting Frontend to Backend...</h2>
      <p>
        <strong>Message from Server:</strong> {serverMessage}
      </p>
    </div>
  );
}

export default App;
