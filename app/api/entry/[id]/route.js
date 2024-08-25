// pages/api/journal-entry/[id].js
import supabase from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
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

    // Delete the journal entry
    const { error: deleteError } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting entry:", deleteError.message);
      return new Response(JSON.stringify({ error: "Failed to delete entry" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Perform any additional update actions if needed
    // e.g., updating cache, notifications, etc.

    update(["/journal"]);

    return new Response(JSON.stringify({ data: { id: params.id } }), {
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

export async function PATCH(request, { params }) {
  try {
    const { updates } = await request.json();

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

    // Update the journal entry
    const { data: entry, error: updateError } = await supabase
      .from("journal_entries")
      .update(updates)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (updateError) {
      console.error("Error updating entry:", updateError.message);
      return new Response(JSON.stringify({ error: "Failed to update entry" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Analyze the updated entry
    const analysis = await analyzeEntry(entry);

    // Upsert the analysis
    const { data: savedAnalysis, error: upsertError } = await supabase
      .from("entry_analysis")
      .upsert({
        entry_id: entry.id,
        user_id: user.id,
        ...analysis,
      });

    if (upsertError) {
      console.error("Error upserting analysis:", upsertError.message);
      return new Response(
        JSON.stringify({ error: "Failed to upsert analysis" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Perform any additional update actions if needed
    // e.g., updating cache, notifications, etc.

    update(["/journal"]);

    return new Response(
      JSON.stringify({ data: { ...entry, analysis: savedAnalysis } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
