// API endpoint and key for Cohere.ai
const cohereUrl = 'https://api.cohere.ai/v1/generate';
const COHERE_KEY = 'kJwxouHb0UCaLkZxcXXc8ZrUUmho1P8OCM6WmW4t';
// API endpoint and key for ElevenLabs
const elevenLabsApiKey = '6fe7519fa8d659ce1d66aa0a29be808d';
const elevenLabsTtsEndpoint = 'https://api.eleven-labs.com/v1/tts';

//var VoiceId = "21m00Tcm4TlvDq8ikWAM"; //Rachel

let generatedText = document.getElementById("generatedText")

// Funzione per ottenere la posizione attuale
async function getCurrentLocation() {
    if ("geolocation" in navigator) {

        navigator.geolocation.getCurrentPosition(async function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Utilizza Nominatim per ottenere l'indirizzo approssimativo
            var nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

            try {
                // Converti le coordinate GPS in un indirizzo
                const response = await fetch(nominatimApiUrl);
                const data = await response.json();

                // Estrai l'indirizzo approssimativo dalla risposta
                const street = data.address.road || data.address.suburb;
                const city = data.address.city || data.address.town || data.address.village;
                const province = data.address.county;
                const address = street + ", " + city + ", " + province;

                // Aggiorna l'indirizzo nel documento HTML
                document.getElementById("address").textContent = address;
                console.log(address);

                // Crea il prompt per Cohere-ai
                const prompt = `You are not a bot, you are a narrator of detective stories, narrate me the beginning of a story at ${address} around the 1800'. Start directly your narration, without introducing yourself and the address given.`;

                // Esegui la generazione del testo con Cohere-ai
                console.log(prompt);
                console.log("\n\n------------------------------------------------------------\n\n");
                const generatedText = await cohereGeneratePrompt(prompt + ".max 50 words.");
                console.log(generatedText);

                // Aggiorna il testo generato nel documento HTML
                document.getElementById("generatedText").textContent = generatedText;
                // Leggi il testo generato ad alta voce con ElevenLabs TTS
                speak(generatedText);

            } catch (error) {
                console.error("Errore nella richiesta di geocodifica:", error);
            }
        });
    } else {
        alert("Il GPS non è supportato su questo dispositivo.");
    }
}

// Funzione per generare il testo con Cohere-ai
async function cohereGeneratePrompt(sentence) {
  // Construct the data object to send to Cohere API.
  const data = JSON.stringify({
    "model": "command-nightly",
    "prompt": sentence,
    "max_tokens": 600,
    "temperature": 0.8,
    "k": 0,
    "stop_sequences": [],
    "return_likelihoods": "NONE"
  });

  // Configuration details for the Axios request.
  const config = {
    method: 'post', 
    maxBodyLength: Infinity,
    url: cohereUrl, // Use the constant defined above.
    headers: { 
      'Authorization': 'BEARER ' + COHERE_KEY,
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  // // Make the API request.
  // setTimeout(async () => {
  //   let res = await axios.request(config);
  
  //   // Extract the response text.
  //   answer = res.data.generations[0].text;
  //   console.log(answer);
  //   generatedText.innerHTML = answer;
  //   // Reset the variables here
  //   hasGeneratedPrompt = false;
  //   isClassDetected = false;   
  // }, 3000);

  // try {
  //     const response = await fetch(cohereUrl, config);
  //     const data = await response.json();
  //     return data.text;
  // } catch (error) {
  //     console.error("Errore nella richiesta API di Cohere-ai:", error);
  //     return "Errore nella generazione del testo";
  // }

  try {
    const response = await axios.request(config);

    if (response.status !== 200) {
      throw new Error(`Cohere.ai API request failed with status ${response.status}`);
    }

    const answer = response.data.generations[0].text;
    console.log(answer);

    generatedText.innerHTML = answer;
    return answer;
  } catch (error) {
    console.error("Error in Cohere.ai API request:", error.message);
    return "Errore nella generazione del testo";
  }
}

async function speak(generatedText) {
  const text = generatedText;
  const voiceId = "cOHS2U4VZj7zUAJZOoxW";

  const headers = new Headers();
  headers.append("Accept", "audio/mpeg");
  headers.append("xi-api-key", "6fe7519fa8d659ce1d66aa0a29be808d");
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify({
    text: text,
    model_id: "eleven_monolingual_v1",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5,
    },
  });

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      const responseText = await response.text();
      console.error("Response Text:", responseText);
      throw new Error("Text to Speech API request failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
    audio.onended = () => {
      // Handle completion if needed
    };
  } catch (error) {
    console.error("Error in ElevenLabs TTS API request:", error.message);
  }
}