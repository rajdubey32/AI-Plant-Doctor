import React from 'react';
import { Sparkles } from 'lucide-react';
export default function UploadPage({theme,language,uploadedImage,isAnalyzing,onAnalyze,onBack}){
  const isDark = theme==='dark';
  const t = language==='en'?{back:'← Back',review:'Review Your Image',analyze:'Analyze Plant',analyzing:'Analyzing...'}:{back:'← वापस',review:'अपनी तस्वीर की समीक्षा करें',analyze:'पौधे का विश्लेषण करें',analyzing:'विश्लेषण हो रहा है...'};
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-fade-in"><button onClick={onBack} className={`${isDark?'text-slate-300':'text-slate-600'} flex items-center gap-2 text-lg`}>{t.back}</button><div className={`${isDark?'bg-slate-800/50 border-slate-700':'bg-white/80 border-slate-200'} backdrop-blur-xl border rounded-2xl p-8`}><h2 className="text-3xl font-bold mb-6">{t.review}</h2><div className="bg-slate-900/30 rounded-2xl overflow-hidden mb-6 border border-slate-700/50"><img src={uploadedImage} alt="Uploaded" className="w-full h-auto max-h-[500px] object-contain"/></div><button onClick={onAnalyze} disabled={isAnalyzing} className={`w-full ${isDark?'bg-teal-500 hover:bg-teal-600':'bg-emerald-700 hover:bg-emerald-800'} text-white px-8 py-4 rounded-xl font-semibold`}>{isAnalyzing? t.analyzing: t.analyze}</button></div></div>
  );
}