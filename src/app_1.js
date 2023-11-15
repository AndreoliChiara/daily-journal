
var dataCorrente = new Date();
// Ottenere i componenti della data (giorno, mese, anno)
var giorno = dataCorrente.getDate();
var mese = dataCorrente.getMonth() + 1; // Mesi iniziano da zero, quindi aggiungi 1
var anno = dataCorrente.getFullYear();
var ore = dataCorrente.getHours();
        var minuti = dataCorrente.getMinutes();
        var secondi = dataCorrente.getSeconds();

var dataFormattata = anno + '-' + (mese < 10 ? '0' + mese : mese) + '-' + (giorno < 10 ? '0' + giorno : giorno) + ' ' +
                             (ore < 10 ? '0' + ore : ore) + ':' + (minuti < 10 ? '0' + minuti : minuti) + ':' + (secondi < 10 ? '0' + secondi : secondi);

        // Inserire la data nella pagina HTML
        document.body.innerHTML += '<p>Data corrente: ' + dataFormattata + '</p>';








const elevenLabsApiKey = '12a57bdb2e2c1ba623fc969c9ca50631';
const button = document.querySelector('button');
const clickToRecordButton = document.getElementById('click_to_record');


//Cliccando bottone appare e la domanda
button.addEventListener("click", function () {
    const questions = [
        "What emotions did you feel today?",
        // Aggiungi altre domande se necessario
    ];

    let questionIndex = 0;



    //Velocità con cui appare la domanda 
    function typeQuestion(question, element, index = 0) {
        if (index < question.length) {
            element.innerHTML += question.charAt(index);
            index++;
            setTimeout(() => typeQuestion(question, element, index), 120);
        } 
    }

    const question = questions[questionIndex];
    const questionContainer = document.getElementById('question-container');

    questionContainer.innerHTML = '';
    typeQuestion(question, questionContainer);
    speak(question);

});




//Voce che legge la domanda

async function speak(question) {
    const text = question;
    const voiceId = "I5ANhMcPbMpJJNCGKeAx";

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
            // Gestisci la fine se necessario
            clickToRecordButton.click();
        };
    } catch (error) {
        console.error("Error in ElevenLabs TTS API request:", error.message);
    }
}




//Speech to texts

clickToRecordButton.addEventListener('click', function () {
    const speech = true;
    window.SpeechRecognition = window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
    
        document.getElementById("convert_text").value = transcript;
        
        // Aggiorna la variabile della risposta corrente
        rispostaCorrente = transcript;
    
        console.log(transcript);
      });
    




      // Salva risposta quando finisci di parlare.

      recognition.addEventListener('end', function () {
        // Chiamata alla funzione per salvare la risposta solo quando l'utente ha finito di parlare
        salvaRisposta();
      });
    
      if (speech == true) {
        recognition.start();
      }
    });
    
    // Funzione per salvare la risposta
    function salvaRisposta() {
      if (rispostaCorrente.trim() !== "") {
        // Aggiungi la risposta alla lista nella sezione "Archivio"
        const risposteArchivio = document.getElementById("risposte-archivio");
        const nuovaRisposta = document.createElement("li");
        nuovaRisposta.textContent = rispostaCorrente + " - " + dataFormattata; // Aggiungi la data alla risposta
        risposteArchivio.appendChild(nuovaRisposta);
    
        // Resettare la variabile della risposta corrente dopo averla salvata
        rispostaCorrente = "";
      }
    }


// const answers = [];

// function saveAnswer() {
//     const answer = document.getElementById("convert_text").value;
//     answers.push(answer);
//     document.getElementById("convert_text").value = ""; // Pulisce il campo di input
//     displayAnswers();
// }

// // Funzione per visualizzare le risposte salvate
// function displayAnswers() {
//     const answerContainer = document.getElementById("answer-container");
//     answerContainer.innerHTML = "<h3>Answers:</h3>";
//     answers.forEach((answer, index) => {
//         answerContainer.innerHTML += `<p>${index + 1}. ${answer}</p>`;
//     });
// }






// if (window.DeviceMotionEvent) {
//     window.addEventListener('devicemotion', function(event) {
//         // Accelerazione lungo l'asse X
//         var accelerationX = event.acceleration.x;

//         // Accelerazione lungo l'asse Y
//         var accelerationY = event.acceleration.y;

//         // Accelerazione lungo l'asse Z
//         var accelerationZ = event.acceleration.z;

//         // Aggiorna i valori sulla pagina HTML
//         document.getElementById('acceleration-x').textContent = 'Acceleration X: ' + accelerationX;
//         document.getElementById('acceleration-y').textContent = 'Acceleration Y: ' + accelerationY;
//         document.getElementById('acceleration-z').textContent = 'Acceleration Z: ' + accelerationZ;
//     });
// } else {
//     // Il dispositivo non supporta l'accelerometro o l'API DeviceMotion
//     alert("Il tuo dispositivo non supporta l'accelerometro o l'API DeviceMotion.");
// }




    