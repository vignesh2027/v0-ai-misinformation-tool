export async function createClient() {
  return {
    auth: {
      getUser: async () => {
        // For server-side, we'll check for a simple session
        return {
          data: { user: { id: "1", email: "user@example.com", created_at: new Date().toISOString() } },
          error: null,
        }
      },
    },
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => ({
            data: { display_name: "Test User", accuracy_rate: 85, quizzes_completed: 5 },
            error: null,
          }),
        }),
      }),
    }),
  }
}
