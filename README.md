# Moody Journal - AI Powered Journal App

## Project Overview

The goal is to build a journal application where users can log in, create and manage journal entries, and have those entries analyzed by AI. The app features:

- **CRUD operations** for journal entries.
- **AI analysis** (sentiment analysis, summaries, mood color coding) of each journal entry.
- **Database integration** using Supabase.
- **Authentication** through Supabase.
- **Full-stack development** with Next.js, handling both client and server-side logic.
- **AI integration** with GOOGLE GEMINI API for analyzing the journal entries.

## Project Features

1. **App Setup and Authentication:**
   - The app is created using `create-next-app` and styled with Tailwind CSS.
   - User authentication is managed by Supabase, allowing for multiple auth providers.
   - Middleware ensures that only authenticated users can access the journal section.

2. **Database Setup:**
   - The app uses Supabase for authentication and database management, with direct interaction with the Supabase database.
   - The app includes three main tables: `User`, `JournalEntry`, and `Analysis`.
   - User data and journal entries are stored and managed in the Supabase database.

3. **Journal Page:**
   - Users can view, create, and edit journal entries.
   - A sidebar displays AI-generated sentiment analysis, summaries, and mood-related colors for each entry.
   - Journal entries are updated and autosaved in real-time using the `react-autosave` library.

4. **AI and Sentiment Analysis:**
   - The GOOGLE GEMINI API is used to generate sentiment analysis, summaries, and mood-based color coding based on the content of each journal entry.
   - Prompts are carefully structured to ensure consistent AI responses using Langchain and Zod for schema validation.
   - Sentiment scores are stored in the database, allowing for mood tracking over time.

5. **Search Functionality:**
   - Users can search their journal entries using a custom similarity search algorithm, allowing them to ask questions about their past entries.

6. **History Page:**
   - A history page charts sentiment scores over time, providing visual insights into a user's mood and emotional journey.
   - A custom charting library is used to display sentiment data in a visually appealing way.

7. **Testing and Deployment:**
   - Unit tests are written using Vitest, with mocks for third-party services like Supabase and GOOGLE GEMINI API.
   - The app is deployed on Vercel, and the database schema is managed and migrated through Supabase.

### Key Technologies Used

- **Frontend:** Next.js, React, Tailwind CSS.
- **Backend:** Supabase, GOOGLE GEMINI API, Langchain.
- **Authentication:** Supabase.
- **AI Analysis:** GOOGLE GEMINI API.
- **Testing:** Vitest, Jest-dom.
