export default function LandingPage({ onStart }) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex items-center overflow-hidden pt-12 pb-24 px-6">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 z-10">
            <h1 className="font-headline text-[3.5rem] leading-[1.1] font-extrabold tracking-[-0.04em] text-primary mb-8">
              Reduce tu huella, <br/>
              <span className="italic">sana el planeta</span>.
            </h1>
            <p className="font-body text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              Mide tu impacto ambiental con precisión científica y descubre acciones personalizadas para regenerar el ecosistema que compartimos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Botón principal que conecta con el Quiz */}
              <button 
                onClick={onStart}
                className="bg-tertiary-container text-on-tertiary-fixed font-bold py-5 px-10 rounded-full shadow-lg hover:brightness-105 transition-all active:scale-95 text-lg inline-flex items-center justify-center gap-2"
              >
                Comenzar Cuestionario
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative h-full min-h-[400px]">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-container/30 rounded-full blur-3xl"></div>
            {/* Placeholder para tu imagen */}
            <div className="relative z-10 w-full h-[400px] bg-primary-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-8xl text-primary">public</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Section (Resumido para legibilidad) */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="font-headline text-[1.75rem] font-bold text-primary mb-4">Tu viaje hacia la sostenibilidad</h2>
            <p className="text-on-surface-variant max-w-2xl">Diseñamos una experiencia editorial para transformar datos complejos en cambios reales.</p>
          </div>
          {/* Aquí irían las Cards del HTML original */}
        </div>
      </section>
    </>
  );
}