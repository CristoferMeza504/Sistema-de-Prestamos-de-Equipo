import type { ReactNode } from 'react'
import { Icono } from '../components/Icono'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
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
          {children}
          <footer className="mt-9 flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-[11px] text-slate-500 sm:flex-row"><span>Préstamos de Equipo <span className="px-1 text-slate-300">/</span> Recursos que nos acercan.</span><span>Diseñado para compartir.</span></footer>
        </main>
      </div>
    </div>
  )
}


