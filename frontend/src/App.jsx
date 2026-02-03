import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Leaf } from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import HomePage from './components/HomePage';
import UploadPage from './components/UploadPage';
import ResultsPage from './components/ResultsPage';
import Chatbot from './components/Chatbot';

// const API_URL = (import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000');

const API_URL = 'http://127.0.0.1:5000';


function App() {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [showLoader, setShowLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => { setTimeout(()=>setShowLoader(false), 900); }, []);

  const handleImageUpload = (file) => {
    if (file){
      const reader = new FileReader();
      reader.onloadend = ()=>{ setUploadedImage(reader.result); setUploadedFile(file); setCurrentPage('upload'); };
      reader.readAsDataURL(file);
    }
  };



  const analyzeImage = async () => {
  if (!uploadedFile) return;

  setIsAnalyzing(true);
  setCurrentPage('results');

  const fd = new FormData();
  fd.append('image', uploadedFile);
  fd.append('language', language);   

  try {
    const res = await axios.post(
      'http://127.0.0.1:5000/predict', 
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    setResult(res.data);
  } catch (e) {
    setResult({ error: true, message: 'Analysis failed: ' + (e.message || e) });
  } finally {
    setIsAnalyzing(false);
  }
};


  const resetApp = ()=>{ setCurrentPage('home'); setUploadedFile(null); setUploadedImage(null); setResult(null); };

  if(showLoader) return <LoadingScreen />;

  const isDark = theme==='dark';
  return (
    <div className={`min-h-screen ${isDark?'bg-slate-900 text-white':'bg-slate-50 text-slate-900'} transition-colors duration-500`}>
      <div className="fixed inset-0 pointer-events-none opacity-10">
        {[...Array(14)].map((_,i)=>(<Leaf key={i} className="absolute text-teal-400 animate-pulse" style={{left:`${Math.random()*100}%`, top:`${Math.random()*100}%`, transform:`rotate(${Math.random()*360}deg) scale(${Math.random()*1.5})`}} />))}
      </div>

      <Header theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} onLogoClick={resetApp} />

      <main className="relative z-10">
        {currentPage==='home' && <HomePage theme={theme} language={language} onImageUpload={handleImageUpload} />}
        {currentPage==='upload' && uploadedImage && <UploadPage theme={theme} language={language} uploadedImage={uploadedImage} isAnalyzing={isAnalyzing} onAnalyze={analyzeImage} onBack={resetApp} />}
        {currentPage==='results' && <ResultsPage theme={theme} language={language} uploadedImage={uploadedImage} result={result} isAnalyzing={isAnalyzing} onNewAnalysis={resetApp} />}
      </main>

      <Chatbot theme={theme} language={language} />
    </div>
  );
}

export default App;
