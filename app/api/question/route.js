// pages/api/qa.js
import supabase from "@/utils/supabase";
import { qa } from "@/utils/ai";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { question } = await request.json();

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

    // Retrieve journal entries from Supabase
    const { data: entries, error: fetchError } = await supabase
      .from("journal_entries")
      .select("content, created_at")
      .eq("user_id", user.id);

    if (fetchError) {
      console.error("Error fetching entries:", fetchError.message);
      return new Response(
        JSON.stringify({ error: "Failed to fetch entries" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Process the question with the entries using AI
    const answer = await qa(question, entries);

    return new Response(JSON.stringify({ data: answer }), {
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
