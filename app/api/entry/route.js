// pages/api/journal-entry.js
import supabase from "@/utils/supabase";
import { update } from "@/utils/action";

export async function POST(request) {
  try {
    const data = await request.json();

    // Get the current user from Supabase Auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Insert a new journal entry into Supabase
    const { data: entry, error: insertError } = await supabase
      .from("journal_entries")
      .insert({
        content: data.content,
        user_id: user.id,
        analysis: {
          mood: "Neutral",
          subject: "None",
          negative: false,
          summary: "None",
          sentimentScore: 0,
          color: "#0101fe",
        },
      })
      .single();

    if (insertError) {
      console.error("Error inserting entry:", insertError.message);
      return new Response(JSON.stringify({ error: "Failed to create entry" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    update(["/journal"]);

    return new Response(JSON.stringify({ data: entry }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
