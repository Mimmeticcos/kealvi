import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { body, author } = await req.json();

  const { data, error } = await supabase
    .from("questions")
    .insert({ body, author })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
