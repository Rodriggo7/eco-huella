export default function Layout({ children }) {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="bg-surface">
        <nav className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-black text-primary tracking-tighter font-headline">
            EcoHuella
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="font-headline text-lg font-bold tracking-tight text-primary border-b-2 border-primary" href="#">Explorar</a>
            <a className="font-headline text-lg font-bold tracking-tight text-on-surface-variant hover:bg-surface-container-high px-2 py-1 rounded-lg transition-colors" href="#">Evaluar</a>
            <a className="font-headline text-lg font-bold tracking-tight text-on-surface-variant hover:bg-surface-container-high px-2 py-1 rounded-lg transition-colors" href="#">Dashboard</a>
          </div>
        </nav>
      </header>

      {/* Contenido Dinámico de la Página */}
      <main className="flex-grow">
        {children}
      </main>

      {/* BottomNavBar (Mobile) */}
      <footer className="md:hidden">
        <div className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-surface-container-lowest/80 backdrop-blur-xl rounded-t-[32px] shadow-2xl">
          <a className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2" href="#">
            <span className="material-symbols-outlined">quiz</span>
            <span className="font-body text-[11px] font-semibold uppercase tracking-wider mt-1">Evaluar</span>
          </a>
        </div>
      </footer>

      {/* Footer (Desktop) */}
      <footer className="hidden md:block py-16 px-6 bg-surface-container-highest border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-primary font-headline">EcoHuella</div>
          <div className="text-on-surface-variant text-sm">© 2026 EcoHuella. Diseñando un futuro regenerativo.</div>
        </div>
      </footer>
    </div>
  );
}