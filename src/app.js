

const elevenLabsApiKey = '12a57bdb2e2c1ba623fc969c9ca50631';
// Aggiungi un gestore di eventi al tuo bottone
const button = document.querySelector('button'); // Sostituisci con un selettore più specifico se necessario
button.addEventListener("click", async function () {

    const questions = [
        "What emotions did you feel today?",
        // "È successo qualcosa che ha influenzato la tua giornata?",
        // "Cosa hai fatto durante la giornata?",
        // "Qual è stata la parte più bella e quella più brutta della giornata?",
    ];

    let questionIndex = 0;

    function typeQuestion(question, element, index = 0) {
        if (index < question.length) {
            element.innerHTML += question.charAt(index);
            index++;
            setTimeout(() => typeQuestion(question, element, index), 45); // Regola la velocità di scrittura
        }
    }

    var question = questions[questionIndex];
    var questionContainer = document.getElementById('question-container');

    // Cancella il contenuto precedente del container
    questionContainer.innerHTML = '';
    typeQuestion(question, questionContainer);
    speak(question);

    async function speak(question) {
        const text = question;
        const voiceId = "UDHCWA0cvOYuqLeND282";
    
        const headers = new Headers();
        headers.append("Accept", "audio/mpeg");
        headers.append("xi-api-key", "12a57bdb2e2c1ba623fc969c9ca50631");
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
            const question = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
                method: "POST",
                headers: headers,
                body: body,
            });
    
            if (!question.ok) {
                console.error(`Error: ${question.status} - ${question.statusText}`);
                const questionText = await question.text();
                console.error("Question Text:", questionText);
                throw new Error("Text to Speech API request failed");
            }
    
            const blob = await question.blob();
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
});



click_to_record.addEventListener('click',function(){
    var speech = true;
    window.SpeechRecognition = window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')

        document.getElementById("convert_text").value = transcript;
        console.log(transcript);
        
    });
    
    if (speech == true) {
        recognition.start();
    }
})