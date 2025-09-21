import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Dummy admin data
const ADMIN_CREDENTIALS = {
  email: "admin@gamingstore.com",
  password: "admin123",
  name: "Admin Gaming Store",
  id: 1,
  role: "admin"
};

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check dummy credentials
        if (
          credentials.email === ADMIN_CREDENTIALS.email &&
          credentials.password === ADMIN_CREDENTIALS.password
        ) {
          return {
            id: ADMIN_CREDENTIALS.id.toString(),
            email: ADMIN_CREDENTIALS.email,
            name: ADMIN_CREDENTIALS.name,
            role: ADMIN_CREDENTIALS.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
