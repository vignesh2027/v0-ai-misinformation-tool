interface SupabaseClient {
  auth: {
    getUser: () => Promise<{ data: { user: any }; error: any }>
    signInWithPassword: (credentials: { email: string; password: string; options?: any }) => Promise<{ error: any }>
    signUp: (credentials: { email: string; password: string; options?: any }) => Promise<{ error: any }>
    signOut: () => Promise<{ error: any }>
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      data: { subscription: { unsubscribe: () => void } }
    }
  }
  from: (table: string) => {
    select: (columns: string) => any
    insert: (data: any) => Promise<{ error: any }>
    eq: (column: string, value: any) => any
    single: () => Promise<{ data: any; error: any }>
    order: (column: string, options: any) => any
    limit: (count: number) => any
  }
}

export function createClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return {
    auth: {
      getUser: async () => {
        // Simple mock implementation for now
        const user = localStorage.getItem("supabase-user")
        return {
          data: { user: user ? JSON.parse(user) : null },
          error: null,
        }
      },
      signInWithPassword: async ({ email, password }) => {
        // Mock sign in - in real app this would call Supabase API
        const mockUser = { id: "1", email, created_at: new Date().toISOString() }
        localStorage.setItem("supabase-user", JSON.stringify(mockUser))
        return { error: null }
      },
      signUp: async ({ email, password }) => {
        // Mock sign up
        const mockUser = { id: "1", email, created_at: new Date().toISOString() }
        localStorage.setItem("supabase-user", JSON.stringify(mockUser))
        return { error: null }
      },
      signOut: async () => {
        localStorage.removeItem("supabase-user")
        return { error: null }
      },
      onAuthStateChange: (callback) => {
        // Mock auth state change listener
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
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
          order: (column: string, options: any) => ({
            limit: (count: number) => Promise.resolve({ data: [], error: null }),
          }),
        }),
        order: (column: string, options: any) => ({
          limit: (count: number) => Promise.resolve({ data: [], error: null }),
        }),
      }),
      insert: async (data: any) => ({ error: null }),
    }),
  }
}
