import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const vehicle = req.body.vehicle || '';
  if (vehicle.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid vehicle",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(vehicle),
      temperature: 1.2,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(vehicle) {
  const capitalizedVehicle =
    vehicle[0].toUpperCase() + vehicle.slice(1).toLowerCase();
  return `Suggest three names for a giant robot that protects a powerful empire.

Vehicle: Ship
Names: Forward Unto Dawn, Stellar Haven, Prime Imperator
Vehicle: Tank
Names: Eisenschutz, Bastion, Sentinel, Chromium
Vehicle: Aircraft
Names: Falcon, Luftkrieg, Aerial
Vehicle: Giant Robot
Names:`;
}
