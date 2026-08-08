let recognition = null;

export function startListening(onResult, onEnd) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser.");
    return;
  }

  recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    onResult(transcript);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  recognition.start();
}

export function stopListening() {
  if (recognition) {
    recognition.stop();
  }
}