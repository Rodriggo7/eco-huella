import { useMemo } from 'react';
import quizData from '../../data/questions.json';

export default function ResultsDashboard({ answers, onRestart }) {
  
  // MOTOR DE CÁLCULO MÁGICO 🧠
  const results = useMemo(() => {
    // 1. Funciones auxiliares para buscar datos en el JSON
    const getOption = (moduleId, questionId) => {
      const q = quizData.modules.find(m => m.id === moduleId)?.questions.find(q => q.id === questionId);
      if (!q || !answers[questionId]) return null;
      return q.options?.find(opt => opt.label === answers[questionId]) || null;
    };

    const getNumber = (questionId, defaultVal = 1) => Number(answers[questionId]) || defaultVal;

    // --- CÁLCULO HOGAR ---
    const personas = getNumber('h_personas', 1);
    const elecOpt = getOption('hogar', 'h_electricidad');
    const calOpt = getOption('hogar', 'h_calefaccion');
    const renOpt = getOption('hogar', 'h_renovable');
    
    // (Consumo mensual * 12 meses * factor) / personas
    let hogarKg = (((elecOpt?.value || 300) * 12 * (elecOpt?.factor || 0.35)) + 
                  (50 * 12 * (calOpt?.factor || 2.02))) / personas; // 50m3 de gas/mes estimado
    hogarKg = hogarKg * (renOpt?.impact_modifier || 1.0);

    // --- CÁLCULO TRANSPORTE ---
    const transOpt = getOption('transporte', 't_medio_principal');
    const kmSemana = getNumber('t_distancia_semanal', 50);
    const vuelosOpt = getOption('transporte', 't_vuelos');
    const ocupacionOpt = getOption('transporte', 't_ocupacion');

    // ((km semanales * 52) * factor de vehiculo / divisor de pasajeros) + vuelos
    let transporteKg = ((kmSemana * 52) * (transOpt?.factor || 0)) / (ocupacionOpt?.divisor || 1);
    transporteKg += (vuelosOpt?.value || 0) * (vuelosOpt?.factor || 0);

    // --- CÁLCULO ALIMENTACIÓN ---
    const dietaOpt = getOption('alimentacion', 'a_dieta');
    const procOpt = getOption('alimentacion', 'a_procedencia');
    const despOpt = getOption('alimentacion', 'a_desperdicio');

    // (Base dieta + (desperdicio semanal * 52)) * factor procedencia
    let comidaKg = (dietaOpt?.base_yearly_kg || 1500) + ((despOpt?.extra_kg_co2 || 0) * 52);
    comidaKg = comidaKg * (procOpt?.impact_modifier || 1.0);

    // --- CÁLCULO RESIDUOS ---
    const recicOpt = getOption('residuos', 'r_reciclaje');
    const compOpt = getOption('residuos', 'r_compras');
    const repOpt = getOption('residuos', 'r_reparacion');

    // (Base 300kg + compras) * factor reciclaje * factor reparacion
    let residuosKg = (300 + (compOpt?.extra_kg_co2 || 100));
    residuosKg = residuosKg * (recicOpt?.impact_modifier || 1.0) * (repOpt?.impact_modifier || 1.0);

    // --- TOTALES ---
    const totalKg = hogarKg + transporteKg + comidaKg + residuosKg;
    const totalTon = (totalKg / 1000).toFixed(1);
    
    // Promedio Argentina = ~4.7t. Calculamos diferencia.
    const diffAvg = (((totalTon - 4.7) / 4.7) * 100).toFixed(0);
    
    // 1 Planeta Tierra sostenible = 1.5t por persona
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

  // Funciones para calcular el porcentaje visual de las barras
  const getPercent = (value) => `${((Number(value) / Number(results.total)) * 100).toFixed(1)}%`;

  // LÓGICA DE RECOMENDACIONES DINÁMICAS
  const highestCategory = useMemo(() => {
    const categories = [
      { id: 'hogar', value: Number(results.hogar), color: 'tertiary', title: 'Hogar' },
      { id: 'transporte', value: Number(results.transporte), color: 'primary', title: 'Transporte' },
      { id: 'comida', value: Number(results.comida), color: 'secondary', title: 'Alimentación' },
      { id: 'residuos', value: Number(results.residuos), color: 'outline-variant', title: 'Residuos' }
    ];
    // Encuentra la categoría con el valor más alto
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
    <main className="max-w-7xl mx-auto px-6 pt-12 space-y-12 pb-32">
      {/* HEADER SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7 space-y-4">
          <span className="inline-block bg-primary-container text-on-primary-container px-4 py-1 rounded-full font-label font-bold text-xs tracking-widest uppercase">Tu Impacto Actual</span>
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter leading-[0.9] text-primary">
            Tus pasos dejan <br/><span className="text-tertiary">una huella.</span>
          </h1>
          <p className="text-on-surface-variant font-body text-lg max-w-md leading-relaxed pt-4">
            Has completado tu evaluación de sostenibilidad. Aquí tienes los datos reales de tu consumo anual.
          </p>
        </div>
        
        <div className="lg:col-span-5">
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(46,47,45,0.08)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 scale-150 rotate-12 transition-transform group-hover:scale-175">
              <span className="material-symbols-outlined text-9xl">eco</span>
            </div>
            <div className="relative z-10">
              <p className="text-sm font-label font-bold text-on-surface-variant uppercase tracking-widest mb-2">Huella de Carbono Total</p>
              <div className="flex items-baseline gap-3">
                <span className="text-7xl font-headline font-black text-primary tracking-tighter">{results.total}</span>
                <span className="text-2xl font-headline font-bold text-on-surface-variant">t CO2e</span>
              </div>
              <div className="mt-8 pt-8 border-t border-surface-container flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${results.diffAvg <= 0 ? 'bg-secondary-container text-on-secondary-container' : 'bg-red-100 text-red-800'}`}>
                  <span className="material-symbols-outlined">
                    {results.diffAvg <= 0 ? 'trending_down' : 'trending_up'}
                  </span>
                </div>
                <p className="text-sm font-medium font-body text-on-surface-variant">
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
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-surface-container-low rounded-lg p-10 lg:col-span-2">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-3xl font-headline font-bold tracking-tight text-on-surface">Desglose por Categoría</h2>
              <p className="font-body text-on-surface-variant">¿Dónde se genera tu huella?</p>
            </div>
            <div className="h-10 w-10 bg-surface-container-highest rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface">bar_chart</span>
            </div>
          </div>
          
          <div className="space-y-10">
            {/* HOGAR */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary">home</span>
                  <span className="font-bold font-body text-on-surface">Hogar</span>
                </div>
                <span className="font-label font-bold text-on-surface-variant">{results.hogar} tCO2</span>
              </div>
              <div className="h-6 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-tertiary-container rounded-full" style={{ width: getPercent(results.hogar) }}></div>
              </div>
            </div>
            
            {/* TRANSPORTE */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">commute</span>
                  <span className="font-bold font-body text-on-surface">Transporte</span>
                </div>
                <span className="font-label font-bold text-on-surface-variant">{results.transporte} tCO2</span>
              </div>
              <div className="h-6 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: getPercent(results.transporte) }}></div>
              </div>
            </div>
            
            {/* ALIMENTACION */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">restaurant</span>
                  <span className="font-bold font-body text-on-surface">Alimentación</span>
                </div>
                <span className="font-label font-bold text-on-surface-variant">{results.comida} tCO2</span>
              </div>
              <div className="h-6 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary-fixed-dim rounded-full" style={{ width: getPercent(results.comida) }}></div>
              </div>
            </div>
            
            {/* RESIDUOS */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-outline-variant">delete_sweep</span>
                  <span className="font-bold font-body text-on-surface">Residuos</span>
                </div>
                <span className="font-label font-bold text-on-surface-variant">{results.residuos} tCO2</span>
              </div>
              <div className="h-6 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-surface-container-highest rounded-full" style={{ width: getPercent(results.residuos) }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* PLANETAS TIERRA */}
        <div className="bg-primary text-on-primary rounded-lg p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-headline font-bold tracking-tight mb-4 leading-tight">¿Cuántos planetas Tierra necesitas?</h2>
            <p className="font-body opacity-80 text-sm mb-8">Si todos vivieran como tú, este sería el espacio que requeriríamos.</p>
            
            <div className="flex flex-wrap gap-4 items-center justify-center py-8">
              {/* Lógica para mostrar los planetas completos */}
              {Array.from({ length: Math.floor(results.planetas) }).map((_, i) => (
                <span key={i} className="material-symbols-outlined text-6xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
              ))}
              
              {/* Lógica para mostrar la fracción de planeta */}
              {(results.planetas % 1) > 0.1 && (
                <div className="relative overflow-hidden w-8">
                  <span className="material-symbols-outlined text-6xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
                  <div className="absolute top-0 right-0 h-full bg-primary" style={{ width: `${100 - ((results.planetas % 1) * 100)}%` }}></div>
                </div>
              )}
            </div>
            
            <div className="text-center mt-4">
              <span className="text-6xl font-headline font-black tracking-tighter">{results.planetas}</span>
              <p className="font-label font-bold uppercase tracking-widest text-xs opacity-70 mt-1">Planetas Tierra</p>
            </div>
          </div>
          <div className="relative z-10 mt-8">
            <button 
              onClick={onRestart}
              className="w-full bg-tertiary-container text-on-tertiary-fixed py-4 rounded-full font-headline font-bold flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform"
            >
              <span>Volver a evaluar</span>
              <span className="material-symbols-outlined">refresh</span>
            </button>
          </div>
        </div>
      </section>
      {/* SECCIÓN DE RECOMENDACIONES (DINÁMICA) */}
      <section className="space-y-8 pt-8 border-t border-surface-container-highest">
        <div className="flex justify-between items-end">
          <h2 className="text-4xl font-headline font-extrabold tracking-tighter text-primary">Acciones Sugeridas</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentTips.map((tip, index) => (
            <div key={index} className="bg-surface-container-lowest rounded-lg p-8 flex items-start gap-6 editorial-shadow hover:bg-white transition-colors duration-300">
              <div className="h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center">
                <span className={`material-symbols-outlined text-4xl text-${highestCategory.color}`}>{tip.icon}</span>
              </div>
              <div>
                <span className={`text-xs font-label font-bold text-${highestCategory.color} uppercase tracking-widest mb-1 block`}>
                  Impacto Crítico: {highestCategory.title}
                </span>
                <h3 className="text-xl font-headline font-bold text-on-surface mb-2">{tip.titulo}</h3>
                <p className="font-body text-on-surface-variant text-sm mb-4 leading-relaxed">
                  {tip.desc}
                </p>
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <span className="material-symbols-outlined text-sm">energy_savings_leaf</span>
                  <span>Ahorro estimado: {tip.ahorro}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}