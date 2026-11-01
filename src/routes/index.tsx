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
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-[#d9b85f] bg-[#542477] text-white shadow-sm">
        <span className="text-[13px] font-black tracking-tight">ASDCC</span>
      </div>
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

  useEffect(() => {
    let active = true;
    async function loadPublicContent() {
      const [newsResult, projectsResult, galleryResult, documentsResult] = await Promise.all([
        supabase.from("news").select("id,title,summary,content,cover_image,published_at,created_at").eq("status", "published").order("published_at", { ascending: false }).limit(6),
        supabase.from("projects").select("id,title,description,category,cover_image,created_at").eq("status", "published").order("created_at", { ascending: false }),
        supabase.from("gallery").select("id,title,description,image_url,album,created_at").eq("is_published", true).order("created_at", { ascending: false }).limit(12),
        supabase.from("documents").select("id,title,description,file_url,category,created_at").eq("is_public", true).order("created_at", { ascending: false }),
      ]);
      if (!active) return;
      const [news, projects, gallery, documents] = await Promise.all([
        Promise.all((newsResult.data ?? []).map(async (item: any) => ({ ...item, imageUrl: item.cover_image ? (await supabase.storage.from("asdcc-imagens").getPublicUrl(item.cover_image)).data.publicUrl : null }))),
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
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white p-5 shadow-2xl shadow-[#45205f]/15">
              <div className="rounded-[2rem] bg-gradient-to-br from-[#542477] via-[#68408a] to-[#9875a8] p-8 text-white">
                <div className="flex items-center justify-between"><span className="text-[10px] font-bold tracking-[.2em] text-[#ead79e]">NOSSA TRAJETÓRIA</span><Home size={24} className="text-[#ead79e]" /></div>
                <div className="mt-14">
                  <p className="text-6xl font-black tracking-tight">200</p>
                  <p className="mt-2 text-sm font-semibold text-white/85">unidades habitacionais entregues</p>
                  <div className="my-7 h-px bg-white/20" />
                  <p className="text-5xl font-black tracking-tight text-[#f0d88f]">435</p>
                  <p className="mt-2 text-sm font-semibold text-white/85">moradias previstas no Residencial Esperança</p>
                </div>
                <p className="mt-12 text-[10px] font-semibold tracking-[.14em] text-white/65">MORADIA SOCIAL • BOA VISTA / RR</p>
              </div>
              <div className="flex items-center justify-between gap-3 px-3 pb-1 pt-5">
                <div><p className="text-xs font-extrabold text-[#542477]">ASDCC / AJURICABA</p><p className="mt-1 text-[10px] text-[#8b7d90]">Associação e comunidade</p></div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5eff7] text-[#80539a]"><Building2 size={20} /></div>
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
              <p className="mt-3 text-sm leading-7 text-[#817586]">Em 2015, a associação participou da conquista e entrega de 200 unidades habitacionais por meio do programa Minha Casa, Minha Vida – Entidades, um marco importante em sua trajetória.</p>
              <div className="mt-8 flex items-end gap-3"><span className="text-5xl font-black text-[#542477]">200</span><span className="pb-1 text-sm font-semibold text-[#8b7d90]">unidades habitacionais entregues</span></div>
            </article>
            <article className="rounded-3xl border border-[#eadfca] bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between"><span className="rounded-full bg-[#fbf4df] px-3 py-1 text-[10px] font-black tracking-widest text-[#92702f]">NOVO EMPREENDIMENTO</span><Building2 className="text-[#a17b39]" size={24} /></div>
              <h3 className="mt-6 text-2xl font-black text-[#432255]">Residencial Esperança</h3>
              <p className="mt-3 text-sm leading-7 text-[#817586]">A associação celebrou a assinatura do contrato do Minha Casa, Minha Vida – Entidades para um novo empreendimento com 435 moradias. A etapa marca o avanço do projeto em direção à construção das casas esperadas pelas famílias.</p>
              <div className="mt-8 flex items-end gap-3"><span className="text-5xl font-black text-[#a17b35]">435</span><span className="pb-1 text-sm font-semibold text-[#8b7d90]">moradias previstas no empreendimento</span></div>
            </article>
          </div>
          <p className="mt-5 text-xs leading-5 text-[#93869a]">Os números e informações desta página foram organizados a partir dos relatos institucionais fornecidos. O andamento das obras será atualizado conforme novas informações oficiais.</p>
        </div>
      </section>

      <section id="projetos" className="bg-[#45205f] py-20 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-[.9fr_1.1fr] md:items-center md:px-8">
          <div><p className="text-xs font-extrabold tracking-[.2em] text-[#e7c979]">ALÉM DA MORADIA</p><h2 className="mt-4 text-3xl font-black leading-tight md:text-4xl">Projetos sociais e participação comunitária.</h2><p className="mt-5 max-w-lg leading-8 text-white/70">O trabalho no Residencial Esperança também envolve planejamento de ações junto à comunidade, fortalecendo a cidadania, a educação ambiental e as oportunidades para a juventude.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {projectItems.map(item => <article key={item.id} className="rounded-2xl border border-white/15 bg-white/[.07] p-6 sm:col-span-2">{item.imageUrl && <img src={item.imageUrl} alt={item.title} className="mb-4 max-h-64 w-full rounded-xl object-cover" />}<p className="text-[10px] font-bold tracking-widest text-[#e7c979]">{item.category || "PROJETO"}</p><h3 className="mt-2 text-lg font-extrabold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{item.description}</p></article>)}
            <div className="rounded-2xl border border-white/15 bg-white/[.07] p-6"><Leaf size={25} className="text-[#e7c979]" /><h3 className="mt-5 font-extrabold">Guarda Mirim</h3><p className="mt-2 text-sm leading-6 text-white/65">Projeto Ambiental Estadual Guarda Mirim – Cidadão e Ambiental, citado nas ações planejadas para o residencial.</p></div>
            <div className="rounded-2xl border border-white/15 bg-white/[.07] p-6"><Users size={25} className="text-[#e7c979]" /><h3 className="mt-5 font-extrabold">Ações comunitárias</h3><p className="mt-2 text-sm leading-6 text-white/65">Planejamento de atividades com atenção à juventude, à cidadania e à participação das famílias.</p></div>
          </div>
        </div>
      </section>

      <section id="noticias" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-5"><SectionTitle eyebrow="FIQUE POR DENTRO" title="Notícias e acontecimentos" text="Acompanhe visitas técnicas, atividades, comunicados e novidades da associação." /><span className="text-xs font-semibold text-[#9a8da0]">Publicações institucionais</span></div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">{newsItems.length === 0 ? <p className="col-span-2 rounded-2xl bg-[#f8f4f9] p-8 text-sm text-[#817586]">As notícias publicadas pela associação aparecerão aqui.</p> : newsItems.map(item => <article key={item.id} className="overflow-hidden rounded-3xl border border-[#eee5ef] bg-white shadow-sm">{item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-48 w-full object-cover" /> : <div className="flex h-44 items-center justify-center bg-gradient-to-br from-[#eee3f1] to-[#f9f3e6]"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#80539a] shadow-sm"><Megaphone size={28} /></div></div>}<div className="p-7"><span className="rounded-full bg-[#f5edf6] px-3 py-1 text-[10px] font-black tracking-widest text-[#80539a]">NOTÍCIA</span><span className="ml-3 text-[11px] text-[#9a8da0]">{item.published_at ? new Date(item.published_at).toLocaleDateString("pt-BR") : ""}</span><h3 className="mt-5 text-xl font-extrabold leading-snug text-[#4c2869]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#817586]">{item.summary || item.content}</p></div></article>)}</div>
      </section>

      <section id="galeria" className="bg-[#f7f2f8] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-5"><SectionTitle eyebrow="REGISTROS DA NOSSA CAMINHADA" title="Galeria de fotos" text="Um espaço para reunir registros de visitas, reuniões, eventos, projetos e momentos importantes da associação." /><Images className="text-[#9b7eaa]" size={34} /></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {galleryItems.length === 0 ? <p className="col-span-3 rounded-2xl bg-white p-8 text-center text-sm text-[#817586]">As fotos publicadas pela associação aparecerão aqui.</p> : galleryItems.map(item => <figure key={item.id} className="overflow-hidden rounded-3xl bg-white shadow-sm"><img src={item.imageUrl} alt={item.title || "Registro da ASDCC"} className="aspect-[5/4] w-full object-cover" /><figcaption className="p-4"><p className="font-bold text-[#542477]">{item.title || item.album || "Registro da associação"}</p>{item.description && <p className="mt-1 text-xs text-[#817586]">{item.description}</p>}</figcaption></figure>)}
          </div>
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
