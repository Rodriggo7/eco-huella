import { useMemo } from 'react';
import quizData from '../../data/questions.json';

export default function ResultsDashboard({ answers, onRestart }) {
  
  // MOTOR DE CÁLCULO MÁGICO
  const results = useMemo(() => {
    const getOption = (moduleId, questionId) => {
      const q = quizData.modules.find(m => m.id === moduleId)?.questions.find(q => q.id === questionId);
      if (!q || !answers[questionId]) return null;
      return q.options?.find(opt => opt.label === answers[questionId]) || null;
    };

    const getNumber = (questionId, defaultVal = 1) => Number(answers[questionId]) || defaultVal;

    const personas = getNumber('h_personas', 1);
    const elecOpt = getOption('hogar', 'h_electricidad');
    const calOpt = getOption('hogar', 'h_calefaccion');
    const renOpt = getOption('hogar', 'h_renovable');
    
    let hogarKg = (((elecOpt?.value || 300) * 12 * (elecOpt?.factor || 0.35)) + 
                  (50 * 12 * (calOpt?.factor || 2.02))) / personas; 
    hogarKg = hogarKg * (renOpt?.impact_modifier || 1.0);

    const transOpt = getOption('transporte', 't_medio_principal');
    const kmSemana = getNumber('t_distancia_semanal', 50);
    const vuelosOpt = getOption('transporte', 't_vuelos');
    const ocupacionOpt = getOption('transporte', 't_ocupacion');

    let transporteKg = ((kmSemana * 52) * (transOpt?.factor || 0)) / (ocupacionOpt?.divisor || 1);
    transporteKg += (vuelosOpt?.value || 0) * (vuelosOpt?.factor || 0);

    const dietaOpt = getOption('alimentacion', 'a_dieta');
    const procOpt = getOption('alimentacion', 'a_procedencia');
    const despOpt = getOption('alimentacion', 'a_desperdicio');

    let comidaKg = (dietaOpt?.base_yearly_kg || 1500) + ((despOpt?.extra_kg_co2 || 0) * 52);
    comidaKg = comidaKg * (procOpt?.impact_modifier || 1.0);

    const recicOpt = getOption('residuos', 'r_reciclaje');
    const compOpt = getOption('residuos', 'r_compras');
    const repOpt = getOption('residuos', 'r_reparacion');

    let residuosKg = (300 + (compOpt?.extra_kg_co2 || 100));
    residuosKg = residuosKg * (recicOpt?.impact_modifier || 1.0) * (repOpt?.impact_modifier || 1.0);

    const totalKg = hogarKg + transporteKg + comidaKg + residuosKg;
    const totalTon = (totalKg / 1000).toFixed(1);
    
    const diffAvg = (((totalTon - 4.7) / 4.7) * 100).toFixed(0);
    const planetas = (totalTon / 1.5).toFixed(1);

    return {
      hogar: (hogarKg / 1000).toFixed(1),
      transporte: (transporteKg / 1000).toFixed(1),
      comida: (comidaKg / 1000).toFixed(1),
      residuos: (residuosKg / 1000).toFixed(1),
      total: totalTon,
      diffAvg: Number(diffAvg),
      planetas: Number(planetas)
    };
  }, [answers]);

  const getPercent = (value) => `${((Number(value) / Number(results.total)) * 100).toFixed(1)}%`;

  // LÓGICA DE RECOMENDACIONES DINÁMICAS
  const highestCategory = useMemo(() => {
    const categories = [
      { id: 'hogar', value: Number(results.hogar), color: 'tertiary', title: 'Hogar' },
      { id: 'transporte', value: Number(results.transporte), color: 'primary', title: 'Transporte' },
      { id: 'comida', value: Number(results.comida), color: 'secondary', title: 'Alimentación' },
      { id: 'residuos', value: Number(results.residuos), color: 'outline-variant', title: 'Residuos' }
    ];
    return categories.reduce((max, cat) => cat.value > max.value ? cat : max, categories[0]);
  }, [results]);

  const recomendaciones = {
    hogar: [
      { titulo: 'Cambia a energía renovable', desc: 'Instalar paneles solares o cambiar de proveedor puede reducir tu huella hogareña hasta un 40%.', icon: 'bolt', ahorro: '-0.6 tCO2 / año' },
      { titulo: 'Ajusta la climatización', desc: 'Bajar 1°C la calefacción o subirlo en el aire acondicionado ahorra hasta un 10% de energía.', icon: 'thermostat', ahorro: '-0.2 tCO2 / año' }
    ],
    transporte: [
      { titulo: 'Día sin coche semanal', desc: 'Dejar el coche solo un día a la semana marca una diferencia masiva en tu impacto anual de movilidad.', icon: 'directions_bike', ahorro: '-0.3 tCO2 / año' },
      { titulo: 'Carpooling o Transporte Público', desc: 'Compartir tus viajes de ida y vuelta al trabajo reduce drásticamente las emisiones por pasajero.', icon: 'directions_bus', ahorro: '-0.8 tCO2 / año' }
    ],
    comida: [
      { titulo: 'Lunes Sin Carne', desc: 'Reemplazar la carne vacuna un día a la semana reduce significativamente las emisiones de metano.', icon: 'eco', ahorro: '-0.4 tCO2 / año' },
      { titulo: 'Compra de Productores Locales', desc: 'Consumir en ferias locales evita la huella de carbono del transporte internacional de alimentos.', icon: 'local_shipping', ahorro: '-0.1 tCO2 / año' }
    ],
    residuos: [
      { titulo: 'Compostaje casero', desc: 'El 50% de la basura es orgánica. Compostar evita que genere metano en los vertederos.', icon: 'recycling', ahorro: '-0.2 tCO2 / año' },
      { titulo: 'Moda Circular', desc: 'Comprar ropa de segunda mano o extender la vida útil de tus prendas reduce la huella hídrica y de carbono.', icon: 'checkroom', ahorro: '-0.15 tCO2 / año' }
    ]
  };

  const currentTips = recomendaciones[highestCategory.id];

  return (
    // Reducimos paddings perimetrales en móvil (px-4) y el espacio entre secciones (space-y-8)
    <main className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12 space-y-8 md:space-y-12 pb-24 md:pb-32">
      
      {/* HEADER SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-end">
        <div className="lg:col-span-7 space-y-3 md:space-y-4">
          <span className="inline-block bg-primary-container text-on-primary-container px-3 md:px-4 py-1 rounded-full font-label font-bold text-[10px] md:text-xs tracking-widest uppercase">
            Tu Impacto Actual
          </span>
          {/* Tipografía fluida para el título principal */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-headline font-extrabold tracking-tighter leading-[1.1] md:leading-[0.9] text-primary">
            Tus pasos dejan <br className="hidden sm:block"/><span className="text-tertiary">una huella.</span>
          </h1>
          <p className="text-on-surface-variant font-body text-base md:text-lg max-w-md leading-relaxed pt-2 md:pt-4">
            Has completado tu evaluación de sostenibilidad. Aquí tienes los datos reales de tu consumo anual.
          </p>
        </div>
        
        <div className="lg:col-span-5">
          {/* Tarjeta principal más compacta en móvil */}
          <div className="bg-surface-container-lowest rounded-[24px] md:rounded-[32px] p-6 md:p-8 editorial-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10 scale-150 rotate-12 transition-transform group-hover:scale-175 pointer-events-none">
              <span className="material-symbols-outlined text-8xl md:text-9xl">eco</span>
            </div>
            <div className="relative z-10">
              <p className="text-xs md:text-sm font-label font-bold text-on-surface-variant uppercase tracking-widest mb-1 md:mb-2">Huella de Carbono Total</p>
              <div className="flex items-baseline gap-2 md:gap-3">
                {/* El número de toneladas ahora escala correctamente */}
                <span className="text-5xl md:text-7xl font-headline font-black text-primary tracking-tighter">{results.total}</span>
                <span className="text-xl md:text-2xl font-headline font-bold text-on-surface-variant">t CO2e</span>
              </div>
              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-surface-container flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                <div className={`h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-full flex items-center justify-center ${results.diffAvg <= 0 ? 'bg-secondary-container text-on-secondary-container' : 'bg-red-100 text-red-800'}`}>
                  <span className="material-symbols-outlined text-xl md:text-24px">
                    {results.diffAvg <= 0 ? 'trending_down' : 'trending_up'}
                  </span>
                </div>
                <p className="text-sm font-medium font-body text-on-surface-variant leading-tight">
                  Estás un <span className={`font-bold ${results.diffAvg <= 0 ? 'text-secondary' : 'text-red-700'}`}>
                    {Math.abs(results.diffAvg)}% {results.diffAvg <= 0 ? 'por debajo' : 'por encima'}
                  </span> de la media nacional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHARTS SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="bg-surface-container-low rounded-[24px] md:rounded-[32px] p-6 md:p-10 lg:col-span-2">
          <div className="flex justify-between items-start mb-8 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight text-on-surface">Desglose por Categoría</h2>
              <p className="font-body text-sm md:text-base text-on-surface-variant mt-1">¿Dónde se genera tu huella?</p>
            </div>
            <div className="h-10 w-10 bg-surface-container-highest rounded-full hidden sm:flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface">bar_chart</span>
            </div>
          </div>
          
          <div className="space-y-6 md:space-y-10">
            {/* Categorías (Barras más finas en móvil para no saturar) */}
            {[
              { id: 'hogar', icon: 'home', label: 'Hogar', color: 'bg-tertiary-container', val: results.hogar },
              { id: 'transporte', icon: 'commute', label: 'Transporte', color: 'bg-primary', val: results.transporte },
              { id: 'comida', icon: 'restaurant', label: 'Alimentación', color: 'bg-secondary-fixed-dim', val: results.comida },
              { id: 'residuos', icon: 'delete_sweep', label: 'Residuos', color: 'bg-surface-container-highest', val: results.residuos }
            ].map((cat) => (
              <div key={cat.id} className="space-y-2 md:space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl md:text-24px">{cat.icon}</span>
                    <span className="font-bold font-body text-sm md:text-base text-on-surface">{cat.label}</span>
                  </div>
                  <span className="font-label font-bold text-xs md:text-sm text-on-surface-variant">{cat.val} tCO2</span>
                </div>
                <div className="h-4 md:h-6 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: getPercent(cat.val) }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PLANETAS TIERRA */}
        <div className="bg-primary text-on-primary rounded-[24px] md:rounded-[32px] p-6 md:p-10 flex flex-col justify-between relative overflow-hidden editorial-shadow">
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight mb-2 md:mb-4 leading-tight">¿Cuántos planetas Tierra necesitas?</h2>
            <p className="font-body opacity-80 text-xs md:text-sm mb-6 md:mb-8">Si todos vivieran como tú, este sería el espacio que requeriríamos.</p>
            
            <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-center py-4 md:py-8">
              {Array.from({ length: Math.floor(results.planetas) }).map((_, i) => (
                <span key={i} className="material-symbols-outlined text-5xl md:text-6xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
              ))}
              
              {(results.planetas % 1) > 0.1 && (
                <div className="relative overflow-hidden w-6 md:w-8">
                  <span className="material-symbols-outlined text-5xl md:text-6xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
                  <div className="absolute top-0 right-0 h-full bg-primary" style={{ width: `${100 - ((results.planetas % 1) * 100)}%` }}></div>
                </div>
              )}
            </div>
            
            <div className="text-center mt-2 md:mt-4">
              <span className="text-5xl md:text-6xl font-headline font-black tracking-tighter">{results.planetas}</span>
              <p className="font-label font-bold uppercase tracking-widest text-[10px] md:text-xs opacity-70 mt-1">Planetas Tierra</p>
            </div>
          </div>
          <div className="relative z-10 mt-6 md:mt-8">
            <button 
              onClick={onRestart}
              className="w-full bg-tertiary-container text-on-tertiary-fixed py-3 md:py-4 rounded-full font-headline font-bold text-sm md:text-base flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform shadow-lg"
            >
              <span>Volver a evaluar</span>
              <span className="material-symbols-outlined">refresh</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE RECOMENDACIONES (DINÁMICA) */}
      <section className="space-y-6 md:space-y-8 pt-6 md:pt-8 border-t border-surface-container-highest">
        <div className="flex justify-between items-end">
          <h2 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tighter text-primary">Acciones Sugeridas</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {currentTips.map((tip, index) => (
            // Alineación vertical en móvil, horizontal en desktop
            <div key={index} className="bg-surface-container-lowest rounded-[24px] p-6 md:p-8 flex flex-col sm:flex-row items-start gap-4 md:gap-6 editorial-shadow hover:bg-white transition-colors duration-300">
              <div className="h-14 w-14 md:h-16 md:w-16 shrink-0 rounded-[16px] md:rounded-[20px] overflow-hidden bg-surface-container-low flex items-center justify-center">
                <span className={`material-symbols-outlined text-3xl md:text-4xl text-${highestCategory.color}`}>{tip.icon}</span>
              </div>
              <div>
                <span className={`text-[10px] md:text-xs font-label font-bold text-${highestCategory.color} uppercase tracking-widest mb-1 block`}>
                  Impacto Crítico: {highestCategory.title}
                </span>
                <h3 className="text-lg md:text-xl font-headline font-bold text-on-surface mb-2 leading-tight">{tip.titulo}</h3>
                <p className="font-body text-on-surface-variant text-sm mb-4 leading-relaxed">
                  {tip.desc}
                </p>
                <div className="flex items-center gap-2 text-primary font-bold text-xs md:text-sm bg-primary-container/30 inline-flex px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-sm">energy_savings_leaf</span>
                  <span>Ahorro: {tip.ahorro}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </main>
  );
}