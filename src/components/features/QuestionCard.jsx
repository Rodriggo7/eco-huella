// import React from 'react';

export default function QuestionCard({ 
  question, 
  moduleLabel, 
  currentStep, 
  totalSteps, 
  selectedValue, 
  onSelect, 
  onNext, 
  onPrev,
  onClose
}) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="relative min-h-screen flex flex-col bg-surface overflow-hidden">
      {/* Decorative Organic Elements */}
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-primary-container/20 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div class="fixed top-24 -left-24 w-64 h-64 bg-secondary-container/10 rounded-full blur-[80px] pointer-events-none z-0"></div>

      {/* Header & Progress */}
      <header className="relative w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6 z-10">
        <div className="flex justify-between items-center">
          <span className="text-primary font-headline text-2xl font-black tracking-tighter">EcoHuella</span>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Progreso del Diagnóstico</span>
            <span className="font-headline text-lg font-bold text-primary">Paso {currentStep} de {totalSteps}</span>
          </div>
          <div className="w-full h-6 bg-surface-container-high rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-grow w-full max-w-5xl mx-auto px-6 flex flex-col justify-center pb-32 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Question Section */}
          <section className="lg:col-span-5 space-y-6">
            <div className="inline-block px-4 py-1.5 bg-primary-container text-on-primary-container rounded-full text-xs font-bold font-label uppercase tracking-widest">
              {moduleLabel}
            </div>
            <h1 className="font-headline text-[3.5rem] leading-[1.1] font-extrabold text-on-surface tracking-tight">
              {question.text}
            </h1>
            {question.description && (
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
                {question.description}
              </p>
            )}
          </section>

          {/* Options Grid */}
          {/* Options Grid / Inputs */}
          <section className="lg:col-span-7">
            
            {/* RENDERIZADO PARA TIPO SELECT (Botones) */}
            {question.type === 'select' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {question.options?.map((option, index) => {
                  const isSelected = selectedValue === option.label;
                  
                  return (
                    <button 
                      key={index}
                      onClick={() => onSelect(option.label)}
                      className={`group relative aspect-square p-8 rounded-lg editorial-shadow flex flex-col justify-between items-start text-left transition-all duration-300 scale-100 active:scale-95
                        ${isSelected 
                          ? 'bg-primary-container ring-4 ring-primary ring-inset' 
                          : 'bg-surface-container-lowest hover:bg-primary-container/50'}`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
                        ${isSelected ? 'bg-surface-container-lowest' : 'bg-surface-container-low group-hover:bg-surface-container-lowest'}`}>
                        <span className="material-symbols-outlined text-primary text-3xl">
                          {option.icon || 'eco'}
                        </span>
                      </div>
                      <div>
                        <span className={`block font-headline text-2xl font-bold ${isSelected ? 'text-on-primary-container' : 'text-on-surface'}`}>
                          {option.label}
                        </span>
                        {option.unit && (
                          <span className="block font-label text-sm text-on-surface-variant mt-1">
                            {option.unit}
                          </span>
                        )}
                      </div>
                      
                      {isSelected && (
                        <div className="absolute top-4 right-4">
                          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* RENDERIZADO PARA TIPO NUMBER (Input de texto) */}
            {question.type === 'number' && (
              <div className="mt-4">
                <input 
                  type="number" 
                  min="1"
                  placeholder={question.placeholder}
                  value={selectedValue || ''}
                  onChange={(e) => onSelect(e.target.value)}
                  className="w-full bg-surface-container-lowest border-none rounded-3xl p-8 text-4xl font-headline text-primary focus:ring-4 focus:ring-primary focus:outline-none editorial-shadow transition-all"
                />
              </div>
            )}

            {/* RENDERIZADO PARA TIPO RANGE (Slider) */}
            {question.type === 'range' && (
              <div className="mt-4 bg-surface-container-lowest p-8 rounded-3xl editorial-shadow">
                <div className="flex justify-between font-headline text-2xl font-bold text-primary mb-8">
                  <span>{question.min}</span>
                  <span className="text-4xl">{selectedValue || question.min}</span>
                  <span>{question.max}+</span>
                </div>
                <input 
                  type="range" 
                  min={question.min} 
                  max={question.max} 
                  step={question.step || 1}
                  value={selectedValue || question.min}
                  onChange={(e) => onSelect(e.target.value)}
                  className="w-full h-4 bg-surface-container-high rounded-full appearance-none cursor-pointer"
                />
              </div>
            )}

          </section>
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 w-full bg-surface/80 backdrop-blur-xl py-6 px-6 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={onPrev}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-8 py-4 rounded-full font-headline font-bold transition-colors scale-100 active:scale-95
              ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Atrás
          </button>
          
          <button 
            onClick={onNext}
            disabled={!selectedValue}
            className={`flex items-center gap-3 px-10 py-4 rounded-full font-headline font-extrabold text-lg editorial-shadow transition-all duration-200 scale-100 active:scale-95
              ${selectedValue 
                ? 'bg-gradient-to-b from-tertiary-container to-tertiary text-on-tertiary-fixed inner-button-highlight' 
                : 'bg-surface-container-high text-on-surface-variant opacity-50 cursor-not-allowed'}`}
          >
            Siguiente
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
}