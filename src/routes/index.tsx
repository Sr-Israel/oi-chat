import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight, Menu, X, HeartHandshake, Users, CalendarDays, Megaphone,
  MapPin, Phone, Mail, Facebook, Instagram, ChevronRight, HandHeart,
  ShieldCheck, BookOpen, Clock3, ExternalLink
} from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

const news = [
  { tag: "COMUNICADO", date: "12 de outubro de 2026", title: "A associação está preparando novas ações para a comunidade", text: "Acompanhe por aqui os próximos comunicados, reuniões e atividades da nossa associação." },
  { tag: "EVENTO", date: "05 de outubro de 2026", title: "Encontro de integração das associadas", text: "Um momento de união, troca de experiências e fortalecimento dos nossos laços." },
  { tag: "INFORMAÇÃO", date: "28 de setembro de 2026", title: "Conheça os canais oficiais de atendimento", text: "Estamos disponíveis para ouvir você e orientar sobre as atividades da associação." },
];

const values = [
  { icon: HeartHandshake, title: "União", text: "Fortalecemos os laços entre as associadas e construímos uma comunidade mais unida." },
  { icon: ShieldCheck, title: "Respeito", text: "Acolhimento, dignidade e respeito são a base de todas as nossas ações." },
  { icon: HandHeart, title: "Solidariedade", text: "Trabalhamos juntas para apoiar, incentivar e transformar realidades." },
];

function BrandMark() {
  return <div className="brand-mark"><div className="brand-mark-inner"><HeartHandshake size={30} strokeWidth={1.7}/></div></div>;
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const links = [["Início", "#inicio"], ["A associação", "#sobre"], ["Atividades", "#atividades"], ["Notícias", "#noticias"], ["Contato", "#contato"]];
  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#30243d]">
      <div className="bg-[#4c2869] px-5 py-2 text-center text-xs font-medium tracking-wide text-white/90">
        Associação das Donas de Casa de AjuRicaba <span className="mx-2 text-[#e9c66b]">•</span> Juntas somos mais fortes
      </div>
      <header className="sticky top-0 z-40 border-b border-[#eee6ef] bg-[#fffdf9]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
          <a href="#inicio" className="flex items-center gap-3">
            <BrandMark/>
            <span className="max-w-[220px] text-sm font-extrabold leading-tight tracking-tight text-[#4c2869] md:text-base">ASDCC AJURICABA<span className="mt-1 block text-[10px] font-semibold tracking-[.16em] text-[#a17b39]">ASSOCIAÇÃO COMUNITÁRIA</span></span>
          </a>
          <nav className="hidden items-center gap-7 md:flex">
            {links.map(([label, href]) => <a key={href} href={href} className="text-sm font-semibold text-[#665b6d] transition hover:text-[#8b5aa4]">{label}</a>)}
          </nav>
          <a href="#contato" className="hidden rounded-full bg-[#4c2869] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#633b80] md:inline-flex">Fale com a associação <ArrowRight size={16} className="ml-2"/></a>
          <button aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)} className="rounded-xl p-2 text-[#4c2869] md:hidden">{menuOpen ? <X/> : <Menu/>}</button>
        </div>
        {menuOpen && <nav className="border-t border-[#eee6ef] bg-white px-5 py-3 md:hidden">{links.map(([label, href]) => <a key={href} href={href} onClick={close} className="block rounded-lg px-3 py-3 text-sm font-semibold text-[#4c2869] hover:bg-[#f7f1f8]">{label}</a>)}</nav>}
      </header>

      <section id="inicio" className="relative overflow-hidden bg-[#f5edf6]">
        <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full border-[1px] border-[#d9c4df] opacity-70"/>
        <div className="absolute -right-10 -top-14 h-72 w-72 rounded-full border border-[#d9c4df] opacity-70"/>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-[1.05fr_.95fr] md:px-8 md:py-24">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dfcce4] bg-white/70 px-4 py-2 text-[11px] font-extrabold tracking-[.17em] text-[#80539a]"><span className="h-2 w-2 rounded-full bg-[#c79c43]"/> ACOLHIMENTO • UNIÃO • COMUNIDADE</span>
            <h1 className="mt-7 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-[#432255] md:text-6xl">Uma comunidade mais forte começa com <span className="text-[#a77b35]">mulheres unidas.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#6f6274] md:text-lg">A Associação das Donas de Casa de Ajuricaba trabalha para fortalecer vínculos, valorizar mulheres e promover iniciativas que fazem a diferença na comunidade.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#sobre" className="inline-flex items-center rounded-full bg-[#4c2869] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#4c2869]/15 transition hover:-translate-y-0.5 hover:bg-[#633b80]">Conheça a associação <ArrowRight size={17} className="ml-2"/></a>
              <a href="#noticias" className="inline-flex items-center rounded-full border border-[#d7c4dc] bg-white/70 px-6 py-4 text-sm font-bold text-[#563269] transition hover:bg-white">Últimos comunicados</a>
            </div>
            <div className="mt-12 flex items-center gap-4 border-t border-[#dfd0e3] pt-6">
              <div className="flex -space-x-2"><span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#f5edf6] bg-[#d9bd8b] text-xs font-bold text-[#4c2869]">A</span><span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#f5edf6] bg-[#c6a5d1] text-xs font-bold text-[#4c2869]">S</span><span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#f5edf6] bg-[#ead6b3] text-xs font-bold text-[#4c2869]">D</span></div>
              <p className="text-xs font-medium leading-5 text-[#786b7c]">Representatividade, participação<br/>e compromisso com a comunidade.</p>
            </div>
          </div>
          <div className="relative mx-auto flex w-full max-w-[470px] items-center justify-center">
            <div className="absolute h-[360px] w-[360px] rounded-full bg-[#e8d8ec] md:h-[430px] md:w-[430px]"/>
            <div className="absolute h-[315px] w-[315px] rounded-full border border-dashed border-[#b995c5] md:h-[380px] md:w-[380px]"/>
            <div className="relative flex aspect-square w-[82%] flex-col items-center justify-center rounded-full border-[9px] border-[#e2c36e] bg-[#fffdf9] p-7 text-center shadow-2xl shadow-[#4c2869]/15 outline outline-[5px] outline-[#4c2869] outline-offset-[-18px]">
              <BrandMark/>
              <p className="mt-5 text-xs font-black tracking-[.2em] text-[#916c31]">ASSOCIAÇÃO DAS</p>
              <p className="mt-1 text-2xl font-black leading-tight text-[#4c2869] md:text-3xl">DONAS DE CASA</p>
              <p className="mt-2 text-sm font-bold tracking-[.18em] text-[#916c31]">AJURICABA</p>
              <div className="mt-5 h-1 w-16 rounded-full bg-[#d4b15e]"/>
              <p className="mt-4 max-w-[210px] text-xs leading-5 text-[#76677b]">Participação que fortalece. União que transforma.</p>
            </div>
            <div className="absolute -bottom-2 -left-1 rounded-2xl border border-[#eadfc9] bg-white px-4 py-3 shadow-lg"><p className="text-[10px] font-bold uppercase tracking-widest text-[#9a773a]">Nossa força</p><p className="text-sm font-extrabold text-[#4c2869]">Está na união</p></div>
          </div>
        </div>
      </section>

      <section id="sobre" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 md:grid-cols-[.8fr_1.2fr] md:gap-20">
          <div><p className="text-xs font-extrabold tracking-[.2em] text-[#a17b39]">QUEM SOMOS</p><h2 className="mt-4 text-3xl font-black leading-tight text-[#432255] md:text-4xl">Mais do que uma associação, uma rede de apoio.</h2></div>
          <div><p className="text-lg leading-8 text-[#6e6273]">Somos uma organização comunitária que acredita na força da participação, no diálogo e na colaboração. Nosso propósito é criar oportunidades, apoiar iniciativas e dar voz às mulheres da nossa comunidade.</p><p className="mt-5 leading-7 text-[#817586]">Este espaço reúne informações sobre nossa história, ações, comunicados e formas de participar. Queremos manter cada associada e visitante bem informado.</p><a href="#contato" className="mt-7 inline-flex items-center text-sm font-extrabold text-[#80539a] hover:text-[#4c2869]">Saiba como participar <ChevronRight size={17}/></a></div>
        </div>
        <div className="mt-16 grid gap-4 md:grid-cols-3">{values.map(({icon: Icon,title,text})=><article key={title} className="rounded-3xl border border-[#eee5ef] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4edf6] text-[#80539a]"><Icon size={23}/></div><h3 className="mt-6 text-xl font-extrabold text-[#4c2869]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#817586]">{text}</p></article>)}</div>
      </section>

      <section id="atividades" className="bg-[#4c2869] py-20 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-[.9fr_1.1fr] md:items-center md:px-8">
          <div><p className="text-xs font-extrabold tracking-[.2em] text-[#e7c979]">O QUE FAZEMOS</p><h2 className="mt-4 text-3xl font-black leading-tight md:text-4xl">Ações que aproximam e transformam.</h2><p className="mt-5 max-w-lg leading-8 text-white/70">A associação é feita de pessoas e iniciativas. Conheça algumas das frentes que podem fazer parte do nosso trabalho.</p><a href="#contato" className="mt-8 inline-flex items-center rounded-full bg-[#e4c36d] px-6 py-3.5 text-sm font-extrabold text-[#432255] transition hover:bg-[#f0d58c]">Quero saber mais <ArrowRight size={16} className="ml-2"/></a></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[{icon:Users,title:"Encontros e reuniões",text:"Espaços de diálogo, escuta e participação."},{icon:BookOpen,title:"Capacitação",text:"Compartilhamento de conhecimentos e experiências."},{icon:HandHeart,title:"Ações comunitárias",text:"Iniciativas de apoio e solidariedade."},{icon:Megaphone,title:"Informação",text:"Comunicados e orientações para as associadas."}].map(({icon:Icon,title,text})=><div key={title} className="rounded-2xl border border-white/15 bg-white/[.07] p-6"><Icon size={24} className="text-[#e7c979]"/><h3 className="mt-5 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section id="noticias" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-extrabold tracking-[.2em] text-[#a17b39]">FIQUE POR DENTRO</p><h2 className="mt-3 text-3xl font-black text-[#432255] md:text-4xl">Notícias e comunicados</h2><p className="mt-3 text-[#817586]">Acompanhe as novidades e informações da associação.</p></div><a href="#contato" className="inline-flex items-center text-sm font-extrabold text-[#80539a]">Ver todos os avisos <ArrowRight size={16} className="ml-2"/></a></div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">{news.map(item=><article key={item.title} className="overflow-hidden rounded-3xl border border-[#eee5ef] bg-white shadow-sm"><div className="flex h-36 items-center justify-center bg-[#f4edf6]"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#80539a] shadow-sm"><Megaphone size={28}/></div></div><div className="p-6"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-[#f5edf6] px-3 py-1 text-[10px] font-black tracking-widest text-[#80539a]">{item.tag}</span><span className="text-[11px] text-[#9a8da0]">{item.date}</span></div><h3 className="mt-5 text-lg font-extrabold leading-snug text-[#4c2869]">{item.title}</h3><p className="mt-3 text-sm leading-6 text-[#817586]">{item.text}</p><a href="#contato" className="mt-5 inline-flex items-center text-xs font-extrabold text-[#80539a]">Saiba mais <ChevronRight size={15}/></a></div></article>)}</div>
        <p className="mt-5 text-center text-xs text-[#a79baa]">Conteúdo ilustrativo para demonstração do modelo de site.</p>
      </section>

      <section className="border-y border-[#eee5ef] bg-[#fbf6ed] py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 text-center md:px-8"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eadfca] text-[#8e6a32]"><CalendarDays size={26}/></div><p className="text-xs font-extrabold tracking-[.2em] text-[#a17b39]">PARTICIPE</p><h2 className="max-w-2xl text-3xl font-black leading-tight text-[#432255] md:text-4xl">A associação também é sua. Faça parte!</h2><p className="max-w-xl leading-7 text-[#817586]">Entre em contato para conhecer as atividades, tirar dúvidas e descobrir como participar.</p><a href="#contato" className="mt-2 inline-flex items-center rounded-full bg-[#4c2869] px-7 py-4 text-sm font-extrabold text-white hover:bg-[#633b80]">Entre em contato <ArrowRight size={16} className="ml-2"/></a></div>
      </section>

      <footer id="contato" className="bg-[#281936] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.2fr_.8fr_1fr] md:px-8">
          <div><div className="flex items-center gap-3"><BrandMark/><div><p className="font-extrabold">ASDCC AJURICABA</p><p className="mt-1 text-[10px] font-semibold tracking-[.16em] text-[#d6b96d]">ASSOCIAÇÃO COMUNITÁRIA</p></div></div><p className="mt-6 max-w-sm text-sm leading-7 text-white/60">Unindo pessoas, fortalecendo mulheres e construindo uma comunidade melhor.</p></div>
          <div><h3 className="font-extrabold">Navegação</h3><div className="mt-5 space-y-3">{links.map(([label,href])=><a key={href} href={href} className="block text-sm text-white/60 transition hover:text-white">{label}</a>)}</div></div>
          <div><h3 className="font-extrabold">Fale conosco</h3><div className="mt-5 space-y-4 text-sm text-white/65"><p className="flex items-center gap-3"><MapPin size={17} className="text-[#d6b96d]"/> Ajuricaba – informações de endereço</p><p className="flex items-center gap-3"><Phone size={17} className="text-[#d6b96d]"/> (00) 00000-0000</p><p className="flex items-center gap-3"><Mail size={17} className="text-[#d6b96d]"/> contato@associacao.org.br</p></div><p className="mt-5 text-xs text-white/40">Dados de contato ilustrativos.</p></div>
        </div>
        <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/40">© {new Date().getFullYear()} Associação das Donas de Casa de Ajuricaba. Todos os direitos reservados.</div>
      </footer>
    </main>
  );
}
