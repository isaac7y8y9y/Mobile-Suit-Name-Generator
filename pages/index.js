import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [vehicleInput, setVehicleInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicle: vehicleInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setVehicleInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/Gundam.jpg" />
      </Head>

      <main className={styles.main}>
        <img src="/Gundam.jpg" className={styles.icon} />
        <h3>Name my mobile weapon</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="vehicle"
            placeholder="Enter a type of mobile weapon"
            value={vehicleInput}
            onChange={(e) => setVehicleInput(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
