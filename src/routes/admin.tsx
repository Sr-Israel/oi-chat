import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Plus, Pencil, Trash2, LayoutDashboard, Newspaper, Images, FolderKanban, FileText, X, Upload, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({ component: AdminPage });

type Section = "news" | "projects" | "gallery" | "documents";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RowData = any;

const sections: { id: Section; label: string; icon: typeof Newspaper }[] = [
  { id: "news", label: "Notícias", icon: Newspaper },
  { id: "projects", label: "Projetos", icon: FolderKanban },
  { id: "gallery", label: "Galeria", icon: Images },
  { id: "documents", label: "Documentos", icon: FileText },
];

const emptyForm = { title: "", slug: "", summary: "", content: "", description: "", category: "", album: "", status: "draft", is_public: true, is_published: true };
const bucketFor = (section: Section) => section === "gallery" || section === "news" ? "asdcc-imagens" : "asdcc-documentos";

function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [section, setSection] = useState<Section>("news");
  const [rows, setRows] = useState<RowData[]>([]);
  const [counts, setCounts] = useState<Record<Section, number>>({ news: 0, projects: 0, gallery: 0, documents: 0 });
  const [form, setForm] = useState<RowData>(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [newsFiles, setNewsFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;
    async function verify() {
      if (!session?.user?.id) { if (active) { setAuthorized(false); setChecking(false); } return; }
      const { data, error } = await supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle();
      if (active) { setAuthorized(!error && !!data && ["admin", "editor"].includes(data.role)); setChecking(false); }
    }
    setChecking(true); verify();
    return () => { active = false; };
  }, [session]);

  useEffect(() => { if (authorized) { loadRows(); loadCounts(); } }, [authorized, section]);

  async function loadRows() {
    const { data, error } = await supabase.from(section).select("*").order("created_at", { ascending: false });
    if (error) setMessage(error.message); else setRows((data ?? []) as RowData[]);
  }

  async function loadCounts() {
    const next = { news: 0, projects: 0, gallery: 0, documents: 0 };
    await Promise.all(sections.map(async ({ id }) => {
      const { count } = await supabase.from(id).select("*", { count: "exact", head: true });
      next[id] = count ?? 0;
    }));
    setCounts(next);
  }

  function startEdit(row: RowData) {
    setEditing(row.id);
    setForm({ ...emptyForm, ...row, slug: row.slug ?? "" });
    setFile(null);
    setNewsFiles([]);
    setMessage("");
  }

  function startNew() { setEditing(null); setForm({ ...emptyForm }); setFile(null); setNewsFiles([]); setNewsFiles([]); setMessage(""); }

  async function save(event: FormEvent) {
    event.preventDefault();
    setLoading(true); setMessage("");
    try {
      let uploadedPath: string | undefined;
      const uploadedNewsPaths: string[] = [];
      if (section === "news" && newsFiles.length) {
        for (const newsFile of newsFiles) {
          const safeName = newsFile.name.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-");
          const path = `news/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;
          const { error: uploadError } = await supabase.storage.from("asdcc-imagens").upload(path, newsFile, { upsert: false });
          if (uploadError) throw uploadError;
          uploadedNewsPaths.push(path);
        }
      }
      if (file) {
        const safeName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-");
        const path = `${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage.from(bucketFor(section)).upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        uploadedPath = path;
      }

      let payload: RowData;
      if (section === "news") {
        payload = { title: form.title.trim(), slug: (form.slug || form.title).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), summary: form.summary, content: form.content, status: form.status, ...(uploadedPath ? { cover_image: uploadedPath } : {}), images: [...(Array.isArray(form.images) ? form.images : []), ...uploadedNewsPaths], ...(form.status === "published" && !form.published_at ? { published_at: new Date().toISOString() } : {}) };
      } else if (section === "projects") {
        payload = { title: form.title.trim(), description: form.description, category: form.category, status: form.status, ...(uploadedPath ? { cover_image: uploadedPath } : {}) };
      } else if (section === "gallery") {
        payload = { title: form.title, description: form.description, album: form.album, is_published: form.is_published, ...(uploadedPath ? { image_url: uploadedPath } : {}) };
        if (!editing && !uploadedPath) throw new Error("Selecione uma imagem para a galeria.");
      } else {
        payload = { title: form.title.trim(), description: form.description, category: form.category, is_public: form.is_public, ...(uploadedPath ? { file_url: uploadedPath } : {}) };
        if (!editing && !uploadedPath) throw new Error("Selecione um arquivo PDF.");
      }
      if (!payload.title) throw new Error("Informe um título.");
      const result = editing
        ? await (supabase.from(section) as any).update(payload).eq("id", editing)
        : await (supabase.from(section) as any).insert(payload);
      if (result.error) throw result.error;
      setMessage("Conteúdo salvo com sucesso.");
      setEditing(null); setForm({ ...emptyForm }); setFile(null);
      await loadRows(); await loadCounts();
    } catch (error: any) { setMessage(error.message || "Não foi possível salvar."); }
    finally { setLoading(false); }
  }

  async function remove(row: RowData) {
    if (!window.confirm(`Excluir "${row.title || "este registro"}"? Esta ação não pode ser desfeita.`)) return;
    const { error } = await supabase.from(section).delete().eq("id", row.id);
    if (error) setMessage(error.message);
    else { setMessage("Registro excluído."); await loadRows(); await loadCounts(); }
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage("");
    const data = new FormData(event.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({ email: String(data.get("email")), password: String(data.get("password")) });
    if (error) setMessage(error.message);
    setLoading(false);
  }

  if (checking) return <div className="flex min-h-screen items-center justify-center text-[#542477]"><Loader2 className="animate-spin" /></div>;
  if (!session) return <main className="flex min-h-screen items-center justify-center bg-[#f7f2f8] px-4"><form onSubmit={signIn} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"><Link to="/" className="text-sm font-bold text-[#80539a]">← Voltar ao site</Link><div className="mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1e8f4] text-xl font-black text-[#542477]">A</div><h1 className="mt-5 text-2xl font-black text-[#432255]">Painel administrativo</h1><p className="mt-2 text-sm text-[#817586]">Entre com seu e-mail e senha autorizados.</p><label className="mt-7 block text-sm font-bold text-[#542477]">E-mail</label><input name="email" type="email" required className="mt-2 w-full rounded-xl border border-[#e5dbe9] px-4 py-3 outline-none focus:border-[#80539a]" /><label className="mt-4 block text-sm font-bold text-[#542477]">Senha</label><input name="password" type="password" required className="mt-2 w-full rounded-xl border border-[#e5dbe9] px-4 py-3 outline-none focus:border-[#80539a]" /><button disabled={loading} className="mt-6 w-full rounded-xl bg-[#542477] px-4 py-3 font-bold text-white disabled:opacity-60">{loading ? "Entrando..." : "Entrar"}</button>{message && <p className="mt-4 text-sm text-red-600">{message}</p>}</form></main>;
  if (!authorized) return <main className="flex min-h-screen items-center justify-center bg-[#f7f2f8] px-4"><div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl"><h1 className="text-xl font-black text-[#432255]">Acesso não autorizado</h1><p className="mt-3 text-sm leading-6 text-[#817586]">Sua conta está autenticada, mas não possui perfil de administrador ou editor da ASDCC. Peça ao administrador para liberar seu acesso.</p><button onClick={() => supabase.auth.signOut()} className="mt-6 rounded-xl bg-[#542477] px-5 py-3 font-bold text-white">Sair</button></div></main>;

  const current = sections.find((item) => item.id === section)!;
  const isFileSection = section === "gallery" || section === "documents";
  return <main className="min-h-screen bg-[#f8f6f9] text-[#30243d] md:flex">
    <aside className="w-full bg-[#352044] p-5 text-white md:min-h-screen md:w-64 md:shrink-0"><Link to="/" className="text-xs font-semibold text-white/60 hover:text-white">← Ver site</Link><div className="mt-6"><p className="text-xs font-black tracking-widest text-[#e7c979]">ASDCC / AJURICABA</p><h1 className="mt-2 text-xl font-black">Administração</h1></div><nav className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-1">{sections.map(item => <button key={item.id} onClick={() => { setSection(item.id); startNew(); }} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold ${section === item.id ? "bg-white text-[#542477]" : "text-white/75 hover:bg-white/10"}`}><item.icon size={17}/>{item.label}<span className="ml-auto text-xs opacity-70">{counts[item.id]}</span></button>)}</nav><button onClick={() => supabase.auth.signOut()} className="mt-8 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white/70 hover:bg-white/10"><LogOut size={17}/> Sair</button></aside>
    <section className="min-w-0 flex-1 p-5 md:p-10"><div className="mx-auto max-w-5xl"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black tracking-widest text-[#a17b39]">GERENCIAR CONTEÚDO</p><h2 className="mt-2 text-3xl font-black text-[#432255]">{current.label}</h2></div><button onClick={startNew} className="inline-flex items-center gap-2 rounded-xl bg-[#542477] px-5 py-3 text-sm font-bold text-white"><Plus size={17}/> Novo cadastro</button></div>
      <div className="mt-7 grid gap-3 sm:grid-cols-4">{sections.map(item => <button key={item.id} onClick={() => { setSection(item.id); startNew(); }} className="rounded-2xl border border-[#eee5ef] bg-white p-4 text-left"><item.icon className="text-[#80539a]" size={20}/><p className="mt-3 text-2xl font-black text-[#432255]">{counts[item.id]}</p><p className="text-xs font-semibold text-[#817586]">{item.label}</p></button>)}</div>
      <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(300px,.85fr)]">
        <div className="rounded-2xl border border-[#eee5ef] bg-white p-5"><h3 className="font-black text-[#432255]">Conteúdos cadastrados</h3><div className="mt-4 space-y-3">{rows.length === 0 ? <p className="rounded-xl bg-[#faf8fb] p-5 text-sm text-[#817586]">Nenhum registro nesta seção ainda.</p> : rows.map(row => <article key={row.id} className="flex items-start gap-3 rounded-xl border border-[#f0eaf2] p-4"><div className="min-w-0 flex-1"><p className="font-bold text-[#4c2869]">{row.title || "Sem título"}</p><p className="mt-1 text-xs text-[#94869a]">{row.status || (row.is_published ? "Publicado" : "Não publicado") || (row.is_public ? "Público" : "Privado")}</p></div><button aria-label="Editar" onClick={() => startEdit(row)} className="rounded-lg p-2 text-[#80539a] hover:bg-[#f5eff7]"><Pencil size={16}/></button><button aria-label="Excluir" onClick={() => remove(row)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={16}/></button></article>)}</div></div>
        <form onSubmit={save} className="rounded-2xl border border-[#eee5ef] bg-white p-5"><h3 className="font-black text-[#432255]">{editing ? "Editar conteúdo" : "Novo conteúdo"}</h3><label className="mt-5 block text-xs font-bold text-[#665b6d]">Título *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="mt-2 w-full rounded-xl border border-[#e5dbe9] px-3 py-3 text-sm outline-none focus:border-[#80539a]"/>
          {section === "news" && <><label className="mt-4 block text-xs font-bold text-[#665b6d]">Foto de capa (opcional)</label><label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#cbb8d2] p-4 text-sm text-[#80539a]"><Upload size={18}/><span className="min-w-0 truncate">{file?.name || "Selecionar foto de capa"}</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setFile(e.target.files?.[0] ?? null)} className="hidden" /></label><label className="mt-4 block text-xs font-bold text-[#665b6d]">Fotos da notícia (pode selecionar várias)</label><label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#cbb8d2] p-4 text-sm text-[#80539a]"><Images size={18}/><span className="min-w-0 truncate">{newsFiles.length ? `${newsFiles.length} foto(s) selecionada(s)` : "Selecionar fotos"}</span><input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={e => setNewsFiles(Array.from(e.target.files ?? []))} className="hidden" /></label>{Array.isArray(form.images) && form.images.length > 0 && <p className="mt-2 text-xs text-[#817586]">{form.images.length} foto(s) já cadastrada(s). Novas fotos serão adicionadas.</p>}<label className="mt-4 block text-xs font-bold text-[#665b6d]">Slug (opcional)</label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="mt-2 w-full rounded-xl border border-[#e5dbe9] px-3 py-3 text-sm"/><label className="mt-4 block text-xs font-bold text-[#665b6d]">Resumo</label><textarea value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} rows={2} className="mt-2 w-full rounded-xl border border-[#e5dbe9] px-3 py-3 text-sm"/><label className="mt-4 block text-xs font-bold text-[#665b6d]">Conteúdo</label><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} className="mt-2 w-full rounded-xl border border-[#e5dbe9] px-3 py-3 text-sm"/><label className="mt-4 block text-xs font-bold text-[#665b6d]">Publicação</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="mt-2 w-full rounded-xl border border-[#e5dbe9] px-3 py-3 text-sm"><option value="draft">Rascunho</option><option value="published">Publicado</option></select></>}
          {section === "projects" && <><label className="mt-4 block text-xs font-bold text-[#665b6d]">Categoria</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Habitacional, social..." className="mt-2 w-full rounded-xl border border-[#e5dbe9] px-3 py-3 text-sm"/><label className="mt-4 block text-xs font-bold text-[#665b6d]">Descrição</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={5} className="mt-2 w-full rounded-xl border border-[#e5dbe9] px-3 py-3 text-sm"/><label className="mt-4 block text-xs font-bold text-[#665b6d]">Visibilidade</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="mt-2 w-full rounded-xl border border-[#e5dbe9] px-3 py-3 text-sm"><option value="draft">Rascunho</option><option value="published">Publicado</option></select></>}
          {section === "gallery" && <><label className="mt-4 block text-xs font-bold text-[#665b6d]">Álbum</label><input value={form.album} onChange={e => setForm({ ...form, album: e.target.value })} className="mt-2 w-full rounded-xl border border-[#e5dbe9] px-3 py-3 text-sm"/><label className="mt-4 block text-xs font-bold text-[#665b6d]">Descrição</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="mt-2 w-full rounded-xl border border-[#e5dbe9] px-3 py-3 text-sm"/><label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })}/> Exibir no site</label></>}
          {section === "documents" && <><label className="mt-4 block text-xs font-bold text-[#665b6d]">Categoria</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-2 w-full rounded-xl border border-[#e5dbe9] px-3 py-3 text-sm"/><label className="mt-4 block text-xs font-bold text-[#665b6d]">Descrição</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="mt-2 w-full rounded-xl border border-[#e5dbe9] px-3 py-3 text-sm"/><label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_public} onChange={e => setForm({ ...form, is_public: e.target.checked })}/> Disponibilizar publicamente</label></>}
          {isFileSection && <><label className="mt-4 block text-xs font-bold text-[#665b6d]">{section === "gallery" ? "Imagem" : "Arquivo PDF"} {editing ? "(opcional para manter o atual)" : "*"}</label><label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#cbb8d2] p-4 text-sm text-[#80539a]"><Upload size={18}/><span className="min-w-0 truncate">{file?.name || "Selecionar arquivo"}</span><input type="file" accept={section === "gallery" ? "image/jpeg,image/png,image/webp" : "application/pdf"} onChange={e => setFile(e.target.files?.[0] ?? null)} className="hidden" /></label></>}
          {message && <p className="mt-4 rounded-lg bg-[#f7f2f8] p-3 text-xs text-[#542477]">{message}</p>}<button disabled={loading} className="mt-6 w-full rounded-xl bg-[#542477] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{loading ? "Salvando..." : editing ? "Salvar alterações" : "Cadastrar"}</button>{editing && <button type="button" onClick={startNew} className="mt-2 w-full rounded-xl border border-[#e5dbe9] px-4 py-3 text-sm font-bold text-[#665b6d]">Cancelar edição</button>}
        </form>
      </div>
      <p className="mt-8 text-xs text-[#9a8da0]">Os acessos e as permissões são controlados pelo Supabase. Apenas perfis admin e editor podem gerenciar conteúdos.</p>
    </div></section>
  </main>;
}
