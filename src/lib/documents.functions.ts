import { createServerFn } from "@tanstack/react-start";

// Returns short-lived download links only for documents marked public.
export const getPublicDocumentLinks = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("documents")
    .select("id,file_url")
    .eq("is_public", true);
  if (error) return {} as Record<string, string>;
  const links: Record<string, string> = {};
  await Promise.all(
    (data ?? []).map(async (doc) => {
      const { data: signed } = await supabaseAdmin.storage
        .from("asdcc-documentos")
        .createSignedUrl(doc.file_url, 3600);
      if (signed?.signedUrl) links[doc.id] = signed.signedUrl;
    }),
  );
  return links;
});
