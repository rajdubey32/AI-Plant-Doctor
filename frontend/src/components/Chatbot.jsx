import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Mic, MicOff } from 'lucide-react';
import axios from 'axios';

export default function Chatbot({ theme, language }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);

  const hasOpened = useRef(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const API_URL = 'http://127.0.0.1:5000'; // Backend API URL
  const isDark = theme === 'dark';

  /*---------------AUTO OPEN ONCE-------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasOpened.current) {
        setOpen(true);
        hasOpened.current = true;
        setMessages([
          {
            type: 'bot',
            text:
              language === 'en'
                ? '👋 Hi! I am your AI Plant Expert. You can type or speak your question.'
                : '👋 नमस्ते! मैं आपका एआई पौधा विशेषज्ञ हूँ। आप बोलकर भी सवाल पूछ सकते हैं।'
          }
        ]);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [language]);

  /*-----------AUTO SCROLL--------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  /*---------------INIT SPEECH RECOGNITION----------------*/
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
  }, [language]);

  /* -----------------TOGGLE MIC---------------*/
  const toggleMic = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  /*---------------SEND MESSAGE---------------*/
  const send = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { type: 'user', text: userText }]);
    setInput('');
    setThinking(true);

    try {
      const res = await axios.post(`${API_URL}/chat`, {
        message: userText,
        language
      });

      setMessages(prev => [
        ...prev,
        { type: 'bot', text: res.data.reply }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          text:
            language === 'en'
              ? '⚠️ AI server is not responding right now.'
              : '⚠️ एआई सर्वर अभी उपलब्ध नहीं है।'
        }
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div>
      {/* 🤖 ULTRA PREMIUM CHATBOT ICON */}
       <button
          onClick={() => setOpen(v => !v)}
          title="AI Plant Expert"
          className="
            fixed bottom-8 right-8 z-50
            w-20 h-20 rounded-full
            flex items-center justify-center
            bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600
            shadow-[0_0_35px_rgba(16,185,129,1)]
            hover:scale-110 transition-all duration-300
            animate-[pulse_3s_infinite]
          "
          >
          {/* 🌟 Outer glow ring */}
          <div className="
            absolute inset-0 rounded-full
            bg-gradient-to-br from-cyan-400 to-emerald-500
            blur-lg opacity-80
          " />

          {/* 🧠 Inner AI Core */}
          <div className="
            relative w-14 h-14 rounded-full
            bg-slate-900
            flex items-center justify-center
            border border-emerald-400/60
          ">
            {/* 🤖 Custom AI Bot SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#grad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
            >
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
              <path d="M8 16h.01" />
              <path d="M16 16h.01" />
            </svg>
          </div>
          </button>


      {/* 🪟 CHAT WINDOW */}
      {open && (
        <div
          className={`
            fixed bottom-28 right-6 z-50
            w-[90vw] max-w-[24rem]
            h-[70vh] max-h-[32rem]
            rounded-2xl shadow-2xl
            flex flex-col
            ${isDark
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'bg-white text-slate-900 border'}
          `}
        >
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <strong>🌱 AI Plant Expert</strong>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-xl max-w-[80%] text-sm
                    ${
                      m.type === 'user'
                        ? 'bg-teal-500 text-white'
                        : isDark
                        ? 'bg-slate-700 text-slate-100'
                        : 'bg-slate-100 text-slate-900'
                    }
                  `}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* 🤖 AI THINKING RING */}
            {thinking && (
              <div className="flex justify-center py-3">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-4 border-teal-400 border-t-transparent animate-spin" />
                  <div className="absolute inset-2 rounded-full bg-slate-900 shadow-[0_0_20px_#14b8a6]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2 items-center">
            <textarea
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={
                language === 'en'
                  ? 'Type or speak your question...'
                  : 'लिखें या बोलकर पूछें...'
              }
              className={`flex-1 resize-none p-2 rounded-lg outline-none text-sm
                ${isDark
                  ? 'bg-slate-700 text-white border border-slate-600'
                  : 'bg-white text-black border'}
              `}
            />

            {/* 🎤 MIC */}
            <button
              onClick={toggleMic}
              className={`p-2 rounded-lg ${
                listening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-slate-500 text-white'
              }`}
            >
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* ➤ SEND */}
            <button
              onClick={send}
              className="bg-teal-500 text-white px-3 py-2 rounded-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
