export default function LandingPage({ onStart }) {
  return (
    <div className="bg-surface">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex items-center overflow-hidden pt-12 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 z-10">
            {/* Tipografía adaptativa: text-5xl en móvil, 3.5rem en desktop */}
            <h1 className="font-headline text-5xl lg:text-[3.5rem] leading-[1.1] font-extrabold tracking-[-0.04em] text-primary mb-8">
              Reduce tu huella, <br/>
              <span className="italic font-light">sana el planeta</span>.
            </h1>
            <p className="font-body text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              Mide tu impacto ambiental con precisión científica y descubre acciones personalizadas para regenerar el ecosistema que compartimos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onStart}
                className="bg-tertiary-container text-on-tertiary-fixed font-bold py-5 px-10 rounded-full shadow-lg hover:brightness-105 transition-all active:scale-95 text-lg inline-flex items-center justify-center gap-2"
              >
                Comenzar Cuestionario
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative h-full min-h-[300px] lg:min-h-[400px]">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-container/30 rounded-full blur-3xl"></div>
            <div className="relative z-10 w-full h-[300px] lg:h-[400px] bg-primary-container rounded-xl flex items-center justify-center editorial-shadow">
                <span className="material-symbols-outlined text-8xl text-primary">public</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BLOQUE A: EL POR QUÉ (Bento Grid) */}
      <section className="py-24 px-6 md:px-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="font-headline text-3xl lg:text-[1.75rem] font-bold text-primary mb-4">Tu viaje hacia la sostenibilidad</h2>
            <p className="text-on-surface-variant max-w-2xl text-lg">Diseñamos una experiencia editorial para transformar datos complejos en cambios reales.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Tarjeta 1 */}
            <div className="lg:col-span-7 bg-surface-container-lowest p-8 lg:p-10 rounded-[32px] shadow-sm flex flex-col justify-between min-h-[300px]">
              <span className="text-6xl lg:text-7xl font-headline font-black text-primary tracking-tighter mb-8 lg:mb-0">1.5 t</span>
              <div>
                <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">El Límite Sostenible</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Es el objetivo anual por persona para mantener el equilibrio ecológico. Hoy, el promedio global supera las 4 toneladas.
                </p>
              </div>
            </div>
            
            {/* Tarjeta 2 */}
            <div className="lg:col-span-5 bg-primary p-8 lg:p-10 rounded-[32px] flex flex-col justify-center text-on-primary editorial-shadow">
              <h3 className="text-2xl font-headline font-bold mb-4">¿Qué es el CO2e?</h3>
              <p className="opacity-90 leading-relaxed">
                Calculamos el Carbono Equivalente: una métrica universal que agrupa todos los gases de efecto invernadero en un solo diagnóstico.
              </p>
            </div>
            
            {/* Tarjeta 3 */}
            <div className="lg:col-span-12 bg-surface-container-highest p-8 lg:p-10 rounded-[32px] flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
              <div className="text-primary bg-surface p-4 rounded-full inline-flex">
                <span className="material-symbols-outlined text-4xl lg:text-6xl">tips_and_updates</span>
              </div>
              <div>
                <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">Menos culpa. Más acción.</h3>
                <p className="text-on-surface-variant max-w-3xl leading-relaxed">
                  No se trata de cambiar tu vida de golpe, sino de entender tu punto de partida para tomar decisiones estratégicas y realistas hoy mismo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BLOQUE B: EL CÓMO (Método) */}
      <section className="py-24 px-6 md:px-12 bg-surface">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-headline font-extrabold text-primary mb-4 tracking-tight">Un diagnóstico de 3 minutos.</h2>
          <p className="text-on-surface-variant text-lg">14 preguntas simples basadas en la matriz energética de Argentina.</p>
        </div>
        
        {/* Grilla: 1 col en móvil, 2 en tablet, 4 en desktop */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: 'home', title: 'Hogar', desc: 'Consumo eléctrico, térmico y eficiencia energética.' },
            { icon: 'commute', title: 'Movilidad', desc: 'Desplazamientos diarios y viajes anuales.' },
            { icon: 'restaurant', title: 'Alimentación', desc: 'Costo oculto de tu dieta y procedencia.' },
            { icon: 'recycling', title: 'Residuos', desc: 'Gestión de desechos y economía circular.' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-surface-container-lowest lg:bg-transparent rounded-3xl lg:rounded-none shadow-sm lg:shadow-none">
              <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center text-primary mb-4">
                <span className="material-symbols-outlined text-3xl">{item.icon}</span>
              </div>
              <h4 className="font-headline font-bold text-on-surface mb-2">{item.title}</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BLOQUE C: FAQ (Acordeón Minimalista) */}
      <section className="py-24 px-6 md:px-12 bg-surface-container-low">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-headline font-extrabold text-primary mb-12 text-center">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {[
              { q: '¿Qué hacen con mis datos?', a: 'Absolutamente nada. El cálculo ocurre en tu navegador y no te pedimos registros, nombres ni correos.' },
              { q: '¿De dónde salen los cálculos?', a: 'Usamos datos del SADI (Argentina) y estándares internacionales de la EPA e IPCC.' },
              { q: '¿Mi huella es muy alta, debo preocuparme?', a: 'Tener una huella alta es el estándar hoy por cómo están diseñadas nuestras ciudades. Buscamos mostrarte el camino para reducirla paso a paso.' }
            ].map((faq, i) => (
              <details key={i} className="group bg-surface-container-lowest rounded-[24px] p-6 shadow-sm cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex justify-between items-center font-headline font-bold text-on-surface outline-none">
                  {faq.q}
                  <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform duration-300">expand_more</span>
                </summary>
                <p className="mt-4 text-on-surface-variant font-body leading-relaxed border-t border-surface-container pt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}