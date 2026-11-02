import { EquipoCard } from './components/EquipoCard'
import { Icono } from './components/Icono'

function App() {
  return (
    <div className="min-h-screen md:flex">
      <a href="#catalogo" className="sr-only fixed top-4 left-4 z-50 rounded-lg bg-white p-3 focus:not-sr-only">Ir al catálogo</a>

      <aside className="hidden w-64 shrink-0 flex-col bg-ink px-6 py-8 text-white md:flex">
        <a href="#catalogo" className="flex items-center gap-3" aria-label="Préstamos, inicio">
          <span className="flex size-10 items-center justify-center rounded-xl bg-teal-300 text-ink"><Icono nombre="cubo" /></span>
          <span className="text-xl font-bold tracking-tight">préstamos<span className="text-teal-300">.</span></span>
        </a>
        <p className="mt-2 pl-13 text-[10px] font-semibold tracking-[0.2em] text-slate-400">EQUIPOS QUE CONECTAN</p>

        <div className="mt-14 text-[10px] font-semibold tracking-[0.2em] text-slate-400">ESPACIO DE TRABAJO</div>
        <nav aria-label="Navegación principal" className="mt-4 space-y-2">
          <a href="#catalogo" aria-current="page" className="flex items-center gap-3 rounded-xl border border-teal-300/20 bg-teal-300/10 px-4 py-3.5 text-sm font-semibold text-teal-200"><Icono nombre="cuadricula" /> Equipos <span className="ml-auto size-1.5 rounded-full bg-teal-300" /></a>
          <button disabled className="flex w-full items-center gap-3 px-4 py-3.5 text-sm text-slate-400 disabled:cursor-not-allowed"><Icono nombre="usuarios" /> Usuarios</button>
          <button disabled className="flex w-full items-center gap-3 px-4 py-3.5 text-sm text-slate-400 disabled:cursor-not-allowed"><Icono nombre="prestamo" /> Préstamos</button>
        </nav>

        <div className="mt-auto pt-24">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="text-teal-300"><Icono nombre="cubo" /></span>
            <p className="mt-3 text-sm font-semibold">Más uso. Más posibilidades.</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">Un espacio para compartir recursos y hacer que las ideas sucedan.</p>
          </div>
          <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-6">
            <span className="flex size-9 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold">PE</span>
            <div><p className="text-xs font-semibold">Préstamos de Equipo</p><p className="mt-1 text-[11px] text-slate-400">Tu inventario, en un lugar</p></div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-5 md:px-9">
          <a href="/" aria-label="Préstamos, página principal" className="flex items-center gap-2 text-lg font-bold md:hidden"><span className="text-brand"><Icono nombre="cubo" /></span>préstamos.</a>
          <div className="hidden items-center gap-2 text-xs text-slate-500 md:flex">Espacio de trabajo <span className="px-2 text-slate-300">/</span> <span className="font-semibold text-ink">Equipos</span></div>
        </header>

        <main id="catalogo" className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div><p className="mb-1.5 text-[10px] font-bold tracking-[0.2em] text-brand">RECURSOS COMPARTIDOS</p><h1 className="text-3xl font-bold tracking-tight">Catálogo de equipos</h1><p className="mt-2 text-sm text-slate-500">Lo que necesitas para tu próxima gran idea.</p></div>
            <div className="self-start sm:self-auto"><button disabled className="flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white opacity-60 disabled:cursor-not-allowed"><span className="text-lg leading-none">+</span> Nuevo equipo</button></div>
          </div>

          <section aria-labelledby="bienvenida" className="relative mb-8 overflow-hidden rounded-2xl bg-ink px-6 py-8 text-white sm:px-9 sm:py-10">
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full border border-teal-200/10 sm:right-0" />
            <div aria-hidden="true" className="pointer-events-none absolute -top-12 -right-4 size-56 rounded-full border border-teal-200/15 sm:right-12" />
            <div aria-hidden="true" className="pointer-events-none absolute top-0 right-8 size-32 rounded-full border border-teal-200/20 sm:right-24" />
            <div className="relative max-w-lg"><p className="mb-4 text-[10px] font-semibold tracking-[0.24em] text-teal-300">CONECTA · CREA · COMPARTE</p><h2 id="bienvenida" className="text-2xl font-semibold tracking-tight sm:text-3xl">Grandes proyectos.<br /><span className="text-teal-200">Las herramientas correctas.</span></h2><p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">Explora el catálogo y conoce el estado de cada equipo. Compartir recursos es abrir nuevas posibilidades.</p></div>
          </section>

          <section aria-labelledby="listado">
            <div className="mb-5 flex items-center justify-between gap-4"><div className="flex items-center gap-3"><h2 id="listado" className="text-lg font-bold tracking-tight">Explora los equipos</h2><span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-500">03</span></div><span className="hidden text-xs text-slate-500 sm:inline">Un equipo, muchas posibilidades</span></div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <EquipoCard id={1} nombre="Laptop de trabajo" tipo="Computadora portátil" estado="Disponible" />
              <EquipoCard id={2} nombre="Cámara de proyectos" tipo="Cámara digital" estado="Prestado" />
              <EquipoCard id={3} nombre="Proyector de sala" tipo="Proyector" estado="Mantenimiento" />
            </div>
          </section>

          <footer className="mt-9 flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-[11px] text-slate-500 sm:flex-row"><span>Préstamos de Equipo <span className="px-1 text-slate-300">/</span> Recursos que nos acercan.</span><span>Diseñado para compartir.</span></footer>
        </main>
      </div>
    </div>
  )
}

export default App
