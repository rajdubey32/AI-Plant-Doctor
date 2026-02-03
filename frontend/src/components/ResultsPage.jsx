import React from 'react';
import { Info, ChevronRight, Leaf } from 'lucide-react';

export default function ResultsPage({
  theme,
  language,
  uploadedImage,
  result,
  isAnalyzing,
  onNewAnalysis
}) {
  const isDark = theme === 'dark';

  const t =
    language === 'en'
      ? {
          newAnalysis: '← New Analysis',
          detected: 'Detected Disease',
          modernTreatment: 'Modern Treatment',
          traditionalTreatment: 'Traditional Remedies',
          originalImage: 'Original Image',
          analyzing: 'Analyzing image, please wait...',
          error: 'Error analyzing image',
          explainable: 'Healthy Leaf Preview (After Recovery)'
        }
      : {
          newAnalysis: '← नया विश्लेषण',
          detected: 'पहचानी गई बीमारी',
          modernTreatment: 'आधुनिक उपचार',
          traditionalTreatment: 'घरेलू नुस्खे',
          originalImage: 'मूल तस्वीर',
          analyzing: 'तस्वीर का विश्लेषण हो रहा है...',
          error: 'तस्वीर का विश्लेषण करने में त्रुटि',
          explainable: 'स्वस्थ पत्ती का पूर्वावलोकन'
        };

  /* ⏳ LOADING */
  if (isAnalyzing || !result) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className={`rounded-2xl p-12 ${isDark ? 'bg-slate-800/50' : 'bg-white/80'}`}>
          <p className="text-xl font-semibold">{t.analyzing}</p>
        </div>
      </div>
    );
  }

  /* ❌ ERROR */
  if (result.error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className={`rounded-2xl p-12 ${isDark ? 'bg-slate-800/50' : 'bg-white/80'}`}>
          <p className="text-xl text-red-500 mb-6">
            {result.message || t.error}
          </p>
          <button
            onClick={onNewAnalysis}
            className="bg-teal-500 text-white px-6 py-3 rounded-lg"
          >
            {t.newAnalysis}
          </button>
        </div>
      </div>
    );
  }

  const diseaseName =
    language === 'en'
      ? result.prediction?.disease_name_en
      : result.prediction?.disease_name_hi;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-5 animate-fade-in">

      {/* 🔙 Back */}
      <button
        onClick={onNewAnalysis}
        className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
      >
        {t.newAnalysis}
      </button>

      {/* 🦠 Disease Info */}
      <div className={`rounded-2xl p-6 ${isDark ? 'bg-slate-800/50' : 'bg-white/80'}`}>
        <h2 className="text-2xl font-bold mb-1">
          {diseaseName || 'Disease Detected'}
        </h2>
        <p className="italic text-slate-400">{t.detected}</p>

        <div className="grid md:grid-cols-2 gap-4 mt-4">

          {/* 📷 Original Image */}
          <div>
            <div className="rounded-xl overflow-hidden border">
              <img
                src={uploadedImage}
                alt="Uploaded leaf"
                className="w-full max-h-[260px] object-contain"
              />
            </div>
            <p className="text-center text-sm font-semibold mt-2">
              {t.originalImage}
            </p>
          </div>

          {/* 🌱 Healthy Preview */}
          <div className="rounded-xl border flex items-center justify-center bg-gradient-to-br from-green-900/20 to-emerald-900/20">
            {result.healthy_preview ? (
              <img
                src={`http://127.0.0.1:5000${result.healthy_preview}`}
                alt="Healthy Leaf Preview"
                className="w-full max-h-[260px] object-contain"
              />
            ) : (
              <div className="text-center p-6">
                <Info className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <p className="font-semibold">{t.explainable}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 💊 Treatments */}
      <div className={`rounded-2xl p-6 ${isDark ? 'bg-slate-800/50' : 'bg-white/80'}`}>
        <div className="grid md:grid-cols-2 gap-6">

          {/* Modern */}
          <div>
            <h3 className="text-xl font-bold mb-3">{t.modernTreatment}</h3>
            <ul className="space-y-2">
              {result.treatment?.modern_treatment
                ?.split('\n')
                .map((it, i) => (
                  <li key={i}>
                    <ChevronRight className="inline w-4 h-4 text-teal-400 mr-2" />
                    {it}
                  </li>
                ))}
            </ul>
          </div>

          {/* Traditional */}
          <div>
            <h3 className="text-xl font-bold mb-3">{t.traditionalTreatment}</h3>
            <ul className="space-y-2">
              {result.treatment?.traditional_treatment
                ?.split('\n')
                .map((it, i) => (
                  <li key={i}>
                    <Leaf className="inline w-4 h-4 text-emerald-500 mr-2" />
                    {it}
                  </li>
                ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
