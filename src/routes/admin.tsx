import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Blocks, ClipboardList, Construction, ShieldCheck } from "lucide-react";

export const Route=createFileRoute("/admin")({component:AdminPage});

function AdminPage(){
 return <main className="flex min-h-screen items-center justify-center bg-[#f1f3eb] px-5 py-12 text-[#294832]">
  <section className="w-full max-w-2xl rounded-[2rem] border border-[#e0e6d9] bg-white p-8 shadow-xl shadow-[#294832]/5 md:p-12">
   <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf2e7] text-[#52734c]"><Construction size={27}/></div>
   <p className="mt-7 text-[10px] font-black tracking-[.22em] text-[#a17b42]">AGROVILA OURO VERDE</p>
   <h1 className="mt-3 text-3xl font-black leading-tight md:text-4xl">Painel comercial em implantação.</h1>
   <p className="mt-4 text-sm leading-7 text-[#778271]">Esta área será destinada ao controle interno do empreendimento. Estamos preparando o cadastro das quadras e dos 302 lotes, clientes, reservas, vendas e pagamentos.</p>
   <div className="mt-8 grid gap-3 sm:grid-cols-3">
    <div className="rounded-2xl bg-[#f5f7f1] p-4"><Blocks className="text-[#52734c]" size={21}/><strong className="mt-3 block text-2xl font-black">13</strong><span className="text-xs text-[#778271]">quadras</span></div>
    <div className="rounded-2xl bg-[#f5f7f1] p-4"><ClipboardList className="text-[#52734c]" size={21}/><strong className="mt-3 block text-2xl font-black">302</strong><span className="text-xs text-[#778271]">lotes confirmados</span></div>
    <div className="rounded-2xl bg-[#f5f7f1] p-4"><ShieldCheck className="text-[#52734c]" size={21}/><strong className="mt-3 block text-2xl font-black">2</strong><span className="text-xs text-[#778271]">áreas institucionais</span></div>
   </div>
   <p className="mt-7 rounded-xl border border-[#e8e9dd] bg-[#fbfcf8] p-4 text-xs leading-6 text-[#78836f]">O painel ainda não registra vendas nem altera a disponibilidade dos lotes. A próxima etapa é configurar o banco de dados e as permissões de acesso para proteger as informações comerciais.</p>
   <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#254a32] px-6 py-3 text-sm font-bold text-white hover:bg-[#35613f]"><ArrowLeft size={16}/> Voltar ao site</Link>
  </section>
 </main>;
}
