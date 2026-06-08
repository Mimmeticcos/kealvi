import { supabase } from "@/lib/supabase";

/**
 * GET: Fetch all polls with their options
 */
export async function GET() {
  const { data, error } = await supabase
    .from("polls")
    .select(`
      id,
      question,
      created_by,
      created_at,
      poll_options (
        id,
        option_text
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json(data);
}

/**
 * POST: Create a poll with options
 * Body: { question: string, options: string[], created_by?: string }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, options, created_by } = body;

    if (!question || !options || !Array.isArray(options)) {
      return Response.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // 1. Insert poll
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert({
        question,
        created_by: created_by || null,
      })
      .select()
      .single();

    if (pollError) {
      return Response.json(
        { error: pollError.message },
        { status: 500 }
      );
    }

    // 2. Insert options
    const optionRows = options.map((opt: string) => ({
      poll_id: poll.id,
      option_text: opt,
    }));

    const { error: optionError } = await supabase
      .from("poll_options")
      .insert(optionRows);

    if (optionError) {
      return Response.json(
        { error: optionError.message },
        { status: 500 }
      );
    }

    return Response.json({
      message: "Poll created successfully",
      poll,
    });
  } catch (err) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
