import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUp,
  Bot,
  ChevronDown,
  CircleHelp,
  Command,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Settings2,
  Sparkles,
  SquarePen,
  UserRound,
  X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const initialMessages = [
  {
    role: "assistant" as const,
    content:
      "Olá! 👋 Eu sou o Oi Chat, seu assistente virtual. Posso ajudar com ideias, textos, planejamento e muito mais. O que vamos fazer hoje?",
  },
];

const suggestions = [
  { title: "Criar uma ideia", detail: "Me ajude a tirar um projeto do papel", icon: Sparkles },
  { title: "Escrever melhor", detail: "Revise um texto ou crie um conteúdo", icon: SquarePen },
  { title: "Aprender algo", detail: "Explique um assunto de forma simples", icon: Search },
  { title: "Organizar tarefas", detail: "Monte um plano para minha semana", icon: Command },
];

function Index() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function sendMessage(value = input) {
    const message = value.trim();
    if (!message) return;
    setMessages((current) => [
      ...current,
      { role: "user" as const, content: message },
      {
        role: "assistant" as const,
        content:
          "Legal! Esta é uma demonstração da interface do Oi Chat. A experiência visual já está pronta; para responder de verdade, o próximo passo será conectar um modelo de IA ao servidor.",
      },
    ]);
    setInput("");
  }

  function startNewChat() {
    setMessages(initialMessages);
    setInput("");
    setMobileMenuOpen(false);
  }

  return (
    <main className="flex h-screen min-h-[600px] overflow-hidden bg-[#f8f9fc] text-slate-800">
      {mobileMenuOpen && (
        <button
          aria-label="Fechar menu"
          className="fixed inset-0 z-20 bg-slate-950/30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[270px] flex-col border-r border-slate-200 bg-[#f1f3f8] p-4 transition-transform md:static md:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-8 flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <MessageSquare size={19} strokeWidth={2.4} />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">oi chat<span className="text-indigo-600">.</span></span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-white md:hidden" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <button
          onClick={startNewChat}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={17} /> Nova conversa
        </button>

        <div className="mt-8">
          <p className="mb-3 px-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Recentes</p>
          <button className="flex w-full items-center gap-3 rounded-xl bg-white px-3 py-3 text-left text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200/70">
            <MessageSquare size={16} className="shrink-0 text-indigo-500" />
            <span className="truncate">Primeira conversa</span>
            <MoreHorizontal size={17} className="ml-auto shrink-0 text-slate-400" />
          </button>
          <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-500 transition hover:bg-white/70">
            <MessageSquare size={16} className="shrink-0" />
            <span className="truncate">Ideias para um projeto</span>
          </button>
        </div>

        <div className="mt-auto space-y-1">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 hover:bg-white/70">
            <CircleHelp size={17} /> Ajuda e suporte
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 hover:bg-white/70">
            <Settings2 size={17} /> Configurações
          </button>
          <div className="mt-3 flex items-center gap-3 border-t border-slate-200 px-2 pt-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              <UserRound size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">Visitante</p>
              <p className="text-xs text-slate-400">Plano gratuito</p>
            </div>
            <MoreHorizontal size={18} className="text-slate-400" />
          </div>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden" aria-label="Abrir menu">
              <Menu size={20} />
            </button>
            <div>
              <p className="text-sm font-semibold text-slate-800">Assistente pessoal</p>
              <p className="text-xs text-slate-400">Uma conversa de cada vez, grandes ideias no caminho.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50">
            <Sparkles size={14} className="text-indigo-500" /> Modelo padrão <ChevronDown size={14} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-5 pb-8 pt-10 md:px-10 md:pt-14">
            {messages.length === 1 ? (
              <div className="my-auto">
                <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                  <Sparkles size={27} />
                </div>
                <div className="mb-10 text-center">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Seu espaço de ideias</p>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Como posso ajudar <span className="text-indigo-600">hoje?</span></h1>
                  <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-500 md:text-base">Converse, explore possibilidades e transforme suas ideias em algo real.</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {suggestions.map(({ title, detail, icon: Icon }) => (
                    <button
                      key={title}
                      onClick={() => sendMessage(title + ": " + detail)}
                      className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                        <Icon size={18} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-800">{title}</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">{detail}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-7 pb-8">
                {messages.map((message, index) => (
                  <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    {message.role === "assistant" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                        <Bot size={17} />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${message.role === "user" ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white text-slate-700 shadow-sm"}`}>
                      {message.content}
                    </div>
                    {message.role === "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                        <UserRound size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 px-4 pb-5 md:px-8 md:pb-7">
          <div className="mx-auto max-w-4xl">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_8px_30px_rgba(15,23,42,0.07)] transition focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50"
            >
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Digite sua mensagem..."
                rows={2}
                className="max-h-36 min-h-[54px] w-full resize-none border-0 bg-transparent px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0"
              />
              <div className="flex items-center justify-between px-1 pb-1">
                <button type="button" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="Anexar arquivo">
                  <Paperclip size={17} />
                </button>
                <div className="flex items-center gap-3">
                  <span className="hidden text-[11px] text-slate-400 sm:inline">Enter para enviar · Shift + Enter para quebrar linha</span>
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    aria-label="Enviar mensagem"
                  >
                    <ArrowUp size={19} />
                  </button>
                </div>
              </div>
            </form>
            <p className="mt-3 text-center text-[11px] text-slate-400">O Oi Chat está em demonstração. As respostas exibidas são ilustrativas.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
