import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getPublicDocumentLinks } from "@/lib/documents.functions";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight, Menu, X, HeartHandshake, Users, Megaphone,
  MapPin, Phone, Mail, ShieldCheck, Home, Building2, Leaf, Images, FileText
} from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

const values = [
  { icon: HeartHandshake, title: "Compromisso social", text: "Atuação voltada à promoção da moradia digna e à melhoria da qualidade de vida das famílias." },
  { icon: Users, title: "Participação comunitária", text: "Diálogo, organização e trabalho conjunto com as famílias e parceiros." },
  { icon: ShieldCheck, title: "Responsabilidade", text: "Compromisso com as iniciativas e com a comunidade que a associação representa." },
];

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a href="#inicio" className="flex items-center gap-3">
      <img src="/images/logo.png" alt="Logo da ASDCC" className="h-12 w-12 shrink-0 object-contain" />
      <span className={`max-w-[230px] text-sm font-extrabold leading-tight tracking-tight ${light ? "text-white" : "text-[#45205f]"}`}>
        ASSOCIAÇÃO DAS DONAS DE CASA
        <span className={`mt-1 block text-[10px] font-semibold tracking-[.16em] ${light ? "text-[#e7ce8c]" : "text-[#9a7937]"}`}>CARANÃ • RESIDENCIAL AJURICABA</span>
      </span>
    </a>
  );
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-extrabold tracking-[.2em] text-[#a17b39]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#432255] md:text-4xl">{title}</h2>
      {text && <p className="mt-4 leading-7 text-[#74697a]">{text}</p>}
    </div>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [projectItems, setProjectItems] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [documentItems, setDocumentItems] = useState<any[]>([]);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [showAllNews, setShowAllNews] = useState(false);
  const [showAllGallery, setShowAllGallery] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadPublicContent() {
      const [newsResult, projectsResult, galleryResult, documentsResult] = await Promise.all([
        supabase.from("news").select("id,title,summary,content,cover_image,images,published_at,created_at").eq("status", "published").order("published_at", { ascending: false }),
        supabase.from("projects").select("id,title,description,category,cover_image,created_at").eq("status", "published").order("created_at", { ascending: false }),
        supabase.from("gallery").select("id,title,description,image_url,album,created_at").eq("is_published", true).order("created_at", { ascending: false }),
        supabase.from("documents").select("id,title,description,file_url,category,created_at").eq("is_public", true).order("created_at", { ascending: false }),
      ]);
      if (!active) return;
      const [news, projects, gallery, documents] = await Promise.all([
        Promise.all((newsResult.data ?? []).map(async (item: any) => ({ ...item, imageUrl: item.cover_image ? supabase.storage.from("asdcc-imagens").getPublicUrl(item.cover_image).data.publicUrl : null, imageUrls: (item.images ?? []).map((path: string) => supabase.storage.from("asdcc-imagens").getPublicUrl(path).data.publicUrl) }))),
        Promise.all((projectsResult.data ?? []).map(async (item: any) => ({ ...item, imageUrl: item.cover_image ? (await supabase.storage.from("asdcc-imagens").getPublicUrl(item.cover_image)).data.publicUrl : null }))),
        Promise.all((galleryResult.data ?? []).map(async (item: any) => ({ ...item, imageUrl: supabase.storage.from("asdcc-imagens").getPublicUrl(item.image_url ?? "").data.publicUrl }))),
        getPublicDocumentLinks().catch(() => ({} as Record<string, string>)).then((links) => (documentsResult.data ?? []).map((item: any) => ({ ...item, fileUrl: links[item.id] ?? null }))),
      ]);
      if (active) { setNewsItems(news); setProjectItems(projects); setGalleryItems(gallery); setDocumentItems(documents); }
    }
    loadPublicContent().catch((error) => console.error("Erro ao carregar conteúdo público:", error));
    return () => { active = false; };
  }, []);
  const close = () => setMenuOpen(false);
  const links = [
    ["Início", "#inicio"], ["A associação", "#sobre"], ["Conquistas", "#conquistas"],
    ["Projetos", "#projetos"], ["Notícias", "#noticias"], ["Galeria", "#galeria"], ["Contato", "#contato"],
  ];

  return (
    <main className="min-h-screen bg-[#fffefa] text-[#30243d]">
      <div className="bg-[#45205f] px-5 py-2 text-center text-[11px] font-semibold tracking-wide text-white/90">
        ASSOCIAÇÃO DAS DONAS DE CASA DO BAIRRO CARANÃ <span className="mx-2 text-[#e2c36f]">•</span> ASDCC / AJURICABA
      </div>

      <header className="sticky top-0 z-40 border-b border-[#eee7ef] bg-[#fffefa]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <Brand />
          <nav className="hidden items-center gap-5 lg:flex">
            {links.map(([label, href]) => <a key={href} href={href} className="text-xs font-bold text-[#665b6d] transition hover:text-[#80539a]">{label}</a>)}
          </nav>
          <a href="#contato" className="hidden items-center rounded-full bg-[#542477] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#68408a] md:inline-flex">Fale com a associação <ArrowRight size={15} className="ml-2" /></a>
          <button aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)} className="rounded-xl p-2 text-[#542477] lg:hidden">{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <nav className="border-t border-[#eee7ef] bg-white px-5 py-3 lg:hidden">{links.map(([label, href]) => <a key={href} href={href} onClick={close} className="block rounded-lg px-3 py-3 text-sm font-semibold text-[#542477] hover:bg-[#f7f1f8]">{label}</a>)}</nav>}
      </header>

      <section id="inicio" className="relative isolate overflow-hidden bg-[#f5eff7]">
        <div className="absolute -right-24 -top-24 -z-10 h-[520px] w-[520px] rounded-full border border-[#ddcce3]" />
        <div className="absolute -right-8 top-0 -z-10 h-[390px] w-[390px] rounded-full border border-[#ddcce3]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-[1.1fr_.9fr] md:px-8 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dfcce4] bg-white/80 px-4 py-2 text-[10px] font-extrabold tracking-[.16em] text-[#80539a]"><span className="h-2 w-2 rounded-full bg-[#c79c43]" /> MORADIA DIGNA • CIDADANIA • COMUNIDADE</span>
            <h1 className="mt-7 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-[#432255] md:text-6xl">Trabalhando por um futuro com <span className="text-[#a77b35]">mais dignidade e moradia.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#6f6274] md:text-lg">Conheça a trajetória da Associação das Donas de Casa do Bairro Caranã / Residencial Ajuricaba e o trabalho desenvolvido em defesa da moradia social em Boa Vista, Roraima.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#sobre" className="inline-flex items-center rounded-full bg-[#542477] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#542477]/15 transition hover:-translate-y-0.5 hover:bg-[#68408a]">Conheça nossa história <ArrowRight size={17} className="ml-2" /></a>
              <a href="#conquistas" className="inline-flex items-center rounded-full border border-[#d7c4dc] bg-white/80 px-6 py-4 text-sm font-bold text-[#563269] transition hover:bg-white">Nossas conquistas</a>
            </div>
            <div className="mt-12 flex items-center gap-3 border-t border-[#dfd0e3] pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7d8eb] text-[#542477]"><HeartHandshake size={20} /></div>
              <p className="text-xs font-medium leading-5 text-[#786b7c]">Uma história de organização comunitária,<br />persistência e compromisso com a moradia social.</p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[470px]">
            <div className="absolute inset-5 rounded-[2.5rem] bg-[#e6d7eb] rotate-3" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white p-3 shadow-2xl shadow-[#45205f]/15">
              <img
                src="/images/associacao.jpg"
                alt="Registro da Associação das Donas de Casa do Bairro Caranã"
                className="h-[420px] w-full rounded-[2rem] object-cover"
                loading="eager"
              />
              <div className="px-3 pb-2 pt-4">
                <p className="text-xs font-extrabold text-[#542477]">ASDCC / AJURICABA</p>
                <p className="mt-1 text-[10px] text-[#8b7d90]">Associação e comunidade</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-10 md:grid-cols-[.85fr_1.15fr] md:gap-20">
          <SectionTitle eyebrow="QUEM SOMOS" title="Uma associação que trabalha pela moradia digna." />
          <div>
            <p className="text-lg leading-8 text-[#6e6273]">A Associação das Donas de Casa do Bairro Caranã / Residencial Ajuricaba (ASDCC) desenvolve um trabalho social voltado à luta pela moradia e à promoção de melhores condições de vida para famílias de Boa Vista, Roraima.</p>
            <p className="mt-5 leading-7 text-[#817586]">Com uma trajetória construída por meio da organização comunitária e da parceria com diferentes instituições, a associação segue atuando para transformar o direito à moradia em oportunidades concretas para as famílias.</p>
            <p className="mt-5 text-sm font-bold text-[#542477]">Presidente: Carla Cristina Rocha</p>
          </div>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">{values.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-3xl border border-[#eee5ef] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4edf6] text-[#80539a]"><Icon size={23} /></div><h3 className="mt-6 text-xl font-extrabold text-[#4c2869]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#817586]">{text}</p></article>)}</div>
      </section>

      <section id="conquistas" className="bg-[#fbf7ef] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionTitle eyebrow="NOSSA HISTÓRIA" title="Conquistas que fazem parte da nossa caminhada." text="Cada empreendimento representa uma etapa importante na luta por moradia social e por mais dignidade para as famílias." />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-[#eadfca] bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between"><span className="rounded-full bg-[#f4edf6] px-3 py-1 text-[10px] font-black tracking-widest text-[#80539a]">CONQUISTA • 2015</span><Home className="text-[#a17b39]" size={24} /></div>
              <h3 className="mt-6 text-2xl font-black text-[#432255]">Residencial Ajuricaba</h3>
              <img src="/images/casa1.jpg" alt="Moradias do Residencial Ajuricaba" loading="lazy" className="mt-5 h-56 w-full rounded-2xl object-cover" />
              <p className="mt-3 text-sm leading-7 text-[#817586]">Em 2015, a associação participou da conquista e entrega de 200 unidades habitacionais por meio do programa Minha Casa, Minha Vida – Entidades, um marco importante em sua trajetória.</p>
              <div className="mt-8 flex items-end gap-3"><span className="text-5xl font-black text-[#542477]">200</span><span className="pb-1 text-sm font-semibold text-[#8b7d90]">unidades habitacionais entregues</span></div>
            </article>
            <article className="rounded-3xl border border-[#eadfca] bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between"><span className="rounded-full bg-[#fbf4df] px-3 py-1 text-[10px] font-black tracking-widest text-[#92702f]">NOVO EMPREENDIMENTO</span><Building2 className="text-[#a17b39]" size={24} /></div>
              <h3 className="mt-6 text-2xl font-black text-[#432255]">Residencial Esperança</h3>
              <img src="/images/casa.png" alt="Imagem do novo empreendimento Residencial Esperança" loading="lazy" className="mt-5 h-56 w-full rounded-2xl object-cover" />
              <p className="mt-3 text-sm leading-7 text-[#817586]">A associação celebrou a assinatura do contrato do Minha Casa, Minha Vida – Entidades para um novo empreendimento com 435 moradias. A etapa marca o avanço do projeto em direção à construção das casas esperadas pelas famílias.</p>
              <div className="mt-8 flex items-end gap-3"><span className="text-5xl font-black text-[#a17b35]">435</span><span className="pb-1 text-sm font-semibold text-[#8b7d90]">moradias previstas no empreendimento</span></div>
            </article>
          </div>
          <p className="mt-5 text-xs leading-5 text-[#93869a]">Os números e informações desta página foram organizados a partir dos relatos institucionais fornecidos. O andamento das obras será atualizado conforme novas informações oficiais.</p>
        </div>
      </section>

      <section id="projetos" className="bg-[#45205f] py-20 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-2xl"><p className="text-xs font-extrabold tracking-[.2em] text-[#e7c979]">ALÉM DA MORADIA</p><h2 className="mt-4 text-3xl font-black leading-tight md:text-4xl">Projetos sociais e participação comunitária.</h2><p className="mt-5 leading-8 text-white/70">O trabalho no Residencial Esperança também envolve planejamento de ações junto à comunidade, fortalecendo a cidadania, a educação ambiental e as oportunidades para a juventude.</p></div>
          {projectItems.length === 0 ? <p className="mt-10 rounded-2xl border border-white/15 bg-white/[.07] p-6 text-sm text-white/70">Os projetos cadastrados e publicados pela associação aparecerão aqui.</p> : <div id="projects-carousel" className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {projectItems.map((item, index) => <article id={`project-slide-${index}`} key={item.id} className="w-[82%] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/15 bg-white/[.07] sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">{item.imageUrl && <img src={item.imageUrl} alt={item.title} className="h-36 w-full object-cover" />}<div className="p-5"><p className="text-[10px] font-bold tracking-widest text-[#e7c979]">{item.category || "PROJETO"}</p><h3 className="mt-2 text-lg font-extrabold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{item.description}</p></div></article>)}
          </div>}
          {projectItems.length > 1 && <div className="mt-5 flex justify-center gap-2">{projectItems.map((item, index) => <button key={item.id} aria-label={`Ir para projeto ${index + 1}`} onClick={() => document.getElementById(`project-slide-${index}`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })} className="h-2 w-2 rounded-full bg-white/35 transition hover:bg-[#e7c979]" />)}</div>}
        </div>
      </section>

      <section id="noticias" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-5"><SectionTitle eyebrow="FIQUE POR DENTRO" title="Notícias e acontecimentos" text="Acompanhe visitas técnicas, atividades, comunicados e novidades da associação." /><button type="button" onClick={() => setShowAllNews(true)} className="inline-flex items-center rounded-full border border-[#d7c4dc] px-5 py-3 text-xs font-extrabold text-[#542477] transition hover:bg-[#f7f1f8]">Ver todas as notícias <ArrowRight size={15} className="ml-2" /></button></div>
        <div id="news-carousel" className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{newsItems.length === 0 ? <p className="w-full rounded-2xl bg-[#f8f4f9] p-8 text-sm text-[#817586]">As notícias publicadas pela associação aparecerão aqui.</p> : newsItems.slice(0, 4).map((item, index) => <article id={`news-slide-${index}`} key={item.id} className="w-[88%] shrink-0 snap-start overflow-hidden rounded-3xl border border-[#eee5ef] bg-white shadow-sm md:w-[calc(50%-10px)]"><button type="button" onClick={() => setSelectedNews(item)} className="block w-full p-6 text-left transition hover:bg-[#fdfafd]"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-[#f5edf6] px-3 py-1 text-[10px] font-black tracking-widest text-[#80539a]">NOTÍCIA</span><span className="text-[11px] text-[#9a8da0]">{item.published_at ? new Date(item.published_at).toLocaleDateString("pt-BR") : ""}</span></div>{item.imageUrl && <img src={item.imageUrl} alt={item.title} loading="lazy" className="mt-4 h-44 w-full rounded-2xl bg-[#f7f2f8] object-cover" />}<h3 className="mt-4 text-lg font-extrabold leading-snug text-[#4c2869]">{item.title}</h3><p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-6 text-[#817586]">{item.summary || item.content}</p><span className="mt-4 inline-block text-xs font-extrabold text-[#80539a]">Ler notícia completa →</span></button></article>)}</div>
        {newsItems.length > 2 && <div className="mt-5 flex justify-center gap-2">{newsItems.slice(0, 4).map((item, index) => <button key={item.id} aria-label={`Ir para notícia ${index + 1}`} onClick={() => document.getElementById(`news-slide-${index}`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })} className="h-2 w-2 rounded-full bg-[#542477]/25 transition hover:bg-[#542477]" />)}</div>}
      </section>

      <section id="galeria" className="bg-[#f7f2f8] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-5"><SectionTitle eyebrow="REGISTROS DA NOSSA CAMINHADA" title="Galeria de fotos" text="Um espaço para reunir registros de visitas, reuniões, eventos, projetos e momentos importantes da associação." /><button type="button" onClick={() => setShowAllGallery(true)} className="inline-flex items-center rounded-full border border-[#d7c4dc] px-5 py-3 text-xs font-extrabold text-[#542477] transition hover:bg-white">Ver todas as fotos <ArrowRight size={15} className="ml-2" /></button></div>
          {galleryItems.length === 0 ? <p className="mt-10 rounded-2xl bg-white p-8 text-center text-sm text-[#817586]">As fotos publicadas pela associação aparecerão aqui.</p> : <div id="gallery-carousel" className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {galleryItems.slice(0, 8).map((item, index) => <figure id={`gallery-slide-${index}`} key={item.id} className="w-[72%] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#eee5ef] bg-white shadow-sm sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
              <div className="flex h-44 items-center justify-center bg-[#fbf9fc] p-2"><img src={item.imageUrl} alt={item.title || "Registro da ASDCC"} loading="lazy" className="h-full w-full object-contain" /></div>
              <figcaption className="p-3"><p className="text-sm font-bold text-[#542477]">{item.title || item.album || "Registro da associação"}</p>{item.description && <p className="mt-1 line-clamp-2 text-xs text-[#817586]">{item.description}</p>}</figcaption>
            </figure>)}
          </div>}
          {galleryItems.length > 4 && <div className="mt-4 flex justify-center gap-2">{galleryItems.slice(0, 8).map((item, index) => <button key={item.id} aria-label={`Ir para foto ${index + 1}`} onClick={() => document.getElementById(`gallery-slide-${index}`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })} className="h-2 w-2 rounded-full bg-[#542477]/25 transition hover:bg-[#542477]" />)}</div>}
        </div>
      </section>

      <section id="transparencia" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="flex flex-col gap-5 rounded-3xl border border-[#eee5ef] bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f4edf6] text-[#80539a]"><FileText size={23} /></div><div><h2 className="text-xl font-black text-[#432255]">Transparência e documentos</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#817586]">Em breve, este espaço poderá reunir estatuto, atas, relatórios e outros documentos institucionais disponibilizados pela associação.</p></div></div>
          <div className="shrink-0 space-y-2">{documentItems.length === 0 ? <span className="rounded-full bg-[#fbf4df] px-4 py-2 text-xs font-bold text-[#92702f]">Documentos em preparação</span> : documentItems.map(item => <a key={item.id} href={item.fileUrl || "#"} target="_blank" rel="noreferrer" className="block rounded-xl border border-[#eadfca] px-4 py-3 text-sm font-bold text-[#542477] hover:bg-[#fbf7ef]">{item.title} ↗</a>)}</div>
        </div>
      </section>

      <section className="bg-[#fbf6ed] py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 text-center md:px-8"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eadfca] text-[#8e6a32]"><HeartHandshake size={26} /></div><p className="text-xs font-extrabold tracking-[.2em] text-[#a17b39]">NOSSO COMPROMISSO</p><h2 className="max-w-2xl text-3xl font-black leading-tight text-[#432255] md:text-4xl">Moradia digna transforma histórias e abre caminhos.</h2><p className="max-w-xl leading-7 text-[#817586]">Seguimos trabalhando em parceria para que mais famílias tenham acesso a oportunidades e a um novo começo.</p><a href="#contato" className="mt-2 inline-flex items-center rounded-full bg-[#542477] px-7 py-4 text-sm font-extrabold text-white hover:bg-[#68408a]">Entre em contato <ArrowRight size={16} className="ml-2" /></a></div>
      </section>

      {showAllNews && <div className="fixed inset-0 z-[65] flex items-center justify-center bg-[#1e1425]/80 p-4" onClick={() => setShowAllNews(false)}><div role="dialog" aria-modal="true" aria-label="Todas as notícias" onClick={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eee5ef] bg-white/95 px-5 py-4 backdrop-blur"><div><p className="text-xs font-black tracking-widest text-[#80539a]">ASDCC / AJURICABA</p><h2 className="mt-1 text-xl font-black text-[#432255]">Todas as notícias</h2></div><button type="button" onClick={() => setShowAllNews(false)} className="rounded-full bg-[#f5eff7] px-3 py-2 text-sm font-bold text-[#542477]">Fechar ×</button></div><div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 md:p-7">{newsItems.map((item) => <button key={item.id} type="button" onClick={() => { setShowAllNews(false); setSelectedNews(item); }} className="overflow-hidden rounded-2xl border border-[#eee5ef] text-left transition hover:shadow-md">{item.imageUrl && <img src={item.imageUrl} alt={item.title} className="h-40 w-full bg-[#f7f2f8] object-cover" />}<div className="p-4"><p className="text-[10px] font-bold text-[#9a8da0]">{item.published_at ? new Date(item.published_at).toLocaleDateString("pt-BR") : ""}</p><h3 className="mt-2 font-extrabold text-[#4c2869]">{item.title}</h3><p className="mt-2 line-clamp-3 text-xs leading-5 text-[#817586]">{item.summary || item.content}</p><span className="mt-3 inline-block text-xs font-extrabold text-[#80539a]">Ler notícia →</span></div></button>)}</div>{newsItems.length === 0 && <p className="p-8 text-center text-sm text-[#817586]">Nenhuma notícia publicada.</p>}</div></div>}
      {showAllGallery && <div className="fixed inset-0 z-[65] flex items-center justify-center bg-[#1e1425]/80 p-4" onClick={() => setShowAllGallery(false)}><div role="dialog" aria-modal="true" aria-label="Todas as fotos" onClick={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eee5ef] bg-white/95 px-5 py-4 backdrop-blur"><div><p className="text-xs font-black tracking-widest text-[#80539a]">ASDCC / AJURICABA</p><h2 className="mt-1 text-xl font-black text-[#432255]">Todas as fotos</h2></div><button type="button" onClick={() => setShowAllGallery(false)} className="rounded-full bg-[#f5eff7] px-3 py-2 text-sm font-bold text-[#542477]">Fechar ×</button></div><div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-4 md:p-7">{galleryItems.map((item) => <figure key={item.id} className="overflow-hidden rounded-2xl border border-[#eee5ef] bg-white"><div className="flex h-40 items-center justify-center bg-[#fbf9fc] p-2"><img src={item.imageUrl} alt={item.title || "Registro da ASDCC"} loading="lazy" className="h-full w-full object-contain" /></div><figcaption className="p-3"><p className="text-xs font-bold text-[#542477]">{item.title || item.album || "Registro da associação"}</p></figcaption></figure>)}</div>{galleryItems.length === 0 && <p className="p-8 text-center text-sm text-[#817586]">Nenhuma foto publicada.</p>}</div></div>}
      {selectedNews && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1e1425]/80 p-4" onClick={() => setSelectedNews(null)}><div role="dialog" aria-modal="true" aria-label={selectedNews.title} onClick={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eee5ef] bg-white/95 px-5 py-4 backdrop-blur"><span className="text-xs font-black tracking-widest text-[#80539a]">NOTÍCIA COMPLETA</span><button type="button" onClick={() => setSelectedNews(null)} aria-label="Fechar notícia" className="rounded-full bg-[#f5eff7] px-3 py-2 text-sm font-bold text-[#542477]">Fechar ×</button></div><div className="p-5 md:p-8"><p className="text-xs text-[#9a8da0]">{selectedNews.published_at ? new Date(selectedNews.published_at).toLocaleDateString("pt-BR") : ""}</p><h2 className="mt-2 text-2xl font-black leading-tight text-[#432255] md:text-3xl">{selectedNews.title}</h2>{selectedNews.content && <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#6f6274]">{selectedNews.content}</p>}<div className="mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{(selectedNews.imageUrls ?? []).map((url: string, index: number) => <img key={`news-modal-${selectedNews.id}-${index}`} src={url} alt={`Foto adicional ${index + 1} da notícia`} className="max-h-[55vh] w-full min-w-full snap-center rounded-2xl bg-[#f7f2f8] object-contain" />)}</div>{(selectedNews.imageUrls ?? []).length > 1 && <p className="mt-3 text-center text-xs text-[#9a8da0]">Deslize para o lado para ver as fotos</p>}</div></div></div>}
      <footer id="contato" className="bg-[#281936] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.2fr_.8fr_1fr] md:px-8">
          <div><Brand light /><p className="mt-6 max-w-sm text-sm leading-7 text-white/60">Uma trajetória de trabalho social, organização comunitária e compromisso com a moradia digna em Boa Vista, Roraima.</p></div>
          <div><h3 className="font-extrabold">Navegação</h3><div className="mt-5 space-y-3">{links.map(([label, href]) => <a key={href} href={href} className="block text-sm text-white/60 transition hover:text-white">{label}</a>)}</div></div>
          <div><h3 className="font-extrabold">Fale com a associação</h3><div className="mt-5 space-y-4 text-sm text-white/65"><p className="flex items-center gap-3"><MapPin size={17} className="text-[#d6b96d]" /> Boa Vista – Roraima</p><p className="flex items-center gap-3"><Phone size={17} className="text-[#d6b96d]" /> Telefone a informar</p><p className="flex items-center gap-3"><Mail size={17} className="text-[#d6b96d]" /> E-mail a informar</p></div><p className="mt-5 text-xs text-white/40">Os canais oficiais serão adicionados após confirmação.</p></div>
        </div>
        <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/40">© {new Date().getFullYear()} ASDCC / Ajuricaba. Todos os direitos reservados.</div>
      </footer>
    </main>
  );
}
