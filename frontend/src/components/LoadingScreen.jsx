import React from 'react';
import { Leaf } from 'lucide-react';
export default function LoadingScreen(){ return (
  <div className="fixed inset-0 bg-black z-50 flex items-center justify-center"><div className="text-center"><div className="relative w-24 h-24 mx-auto mb-6"><Leaf className="w-24 h-24 text-teal-400 animate-pulse"/><div className="absolute inset-0 bg-teal-400 blur-xl opacity-50 animate-pulse"></div></div><div className="text-white text-3xl font-light tracking-wider animate-pulse">AI Plant Doctor</div></div></div>
)}