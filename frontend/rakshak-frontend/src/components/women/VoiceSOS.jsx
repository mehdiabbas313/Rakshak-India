import { useRef, useState } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVolumeUp,
} from "react-icons/fa";
import toast from "react-hot-toast";

function VoiceSOS() {
  const recognitionRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [isSupported] = useState(() => {
    return Boolean(
      window.SpeechRecognition || window.webkitSpeechRecognition
    );
  });

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const startListening = () => {
    if (!isSupported) {
      toast.error("Voice recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.success("Voice SOS listening started.");
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript
        .trim()
        .toLowerCase();

      setLastCommand(command);

      const emergencyWords = [
        "help",
        "sos",
        "emergency",
        "save me",
        "help me",
      ];

      const emergencyDetected = emergencyWords.some((word) =>
        command.includes(word)
      );

      if (emergencyDetected) {
        toast.success("Demo voice SOS command detected.");
      } else {
        toast.error("No emergency keyword detected.");
      }
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
      setIsListening(false);
      toast.error("Voice recognition failed.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
          <FaMicrophone className="text-2xl" />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-red-400">
            Voice Safety
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            Voice SOS
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-400">
        Say words like “Help”, “SOS” or “Emergency” to simulate a voice-triggered
        alert.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <div className="flex items-center gap-3">
          <span
            className={`h-3 w-3 rounded-full ${
              isListening
                ? "animate-pulse bg-red-400"
                : "bg-slate-600"
            }`}
          />

          <p className="font-semibold text-white">
            {isListening ? "Listening..." : "Voice SOS inactive"}
          </p>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Browser microphone permission may be required.
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {!isListening ? (
          <button
            type="button"
            onClick={startListening}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            <FaMicrophone />
            Start Voice SOS
          </button>
        ) : (
          <button
            type="button"
            onClick={stopListening}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-700 px-5 py-3 font-semibold text-white transition hover:bg-slate-600"
          >
            <FaMicrophoneSlash />
            Stop Listening
          </button>
        )}

        <button
          type="button"
          onClick={() =>
            toast.success(
              'Try saying: "Help", "SOS" or "Emergency".'
            )
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          <FaVolumeUp />
          Show Voice Commands
        </button>
      </div>

      {lastCommand && (
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Last detected command
          </p>

          <p className="mt-2 text-sm text-slate-300">
            “{lastCommand}”
          </p>
        </div>
      )}

      <div className="mt-5 rounded-xl border border-yellow-500/30 bg-yellow-950/20 p-4">
        <p className="text-sm font-semibold text-yellow-200">
          Demo mode
        </p>

        <p className="mt-1 text-sm leading-6 text-yellow-100/70">
          Voice recognition only simulates the emergency workflow. No real alert
          is sent.
        </p>
      </div>
    </section>
  );
}

export default VoiceSOS;