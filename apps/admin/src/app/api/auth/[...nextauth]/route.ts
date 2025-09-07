import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import {prisma} from "@repo/db";
import {GOOGLE_ID_ADMIN, GOOGLE_SECRET_ADMIN, NEXTAUTH_SECRET} from "@repo/common/src";

type SessionProps = {
    session: any;
    user: any;
}

export const authOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        GoogleProvider ({
            clientId: GOOGLE_ID_ADMIN ?? "",
            clientSecret: GOOGLE_SECRET_ADMIN ?? "",
            authorization: {
                params: {
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code',
                },
      },
        })
    ],

    secret: NEXTAUTH_SECRET,

    callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      // For Google login, check if the user exists in admin table
      if (account?.provider === 'google' && user.email) {
        try {
          const existingAdmin = await prisma.admin.findUnique({
            where: { email: user.email },
          });

          if (!existingAdmin) {
            return '/access-denied';
          }

          // Store the admin ID in the user object
          user.id = existingAdmin.id;

          // Store admin details in the user object
          user.name = existingAdmin.name;
          user.email = existingAdmin.email;
          user.role = existingAdmin.role;
          user.access = existingAdmin.access;

          return true;
        } catch (error) {
          console.error('Error checking admin:', error);
          return '/access-denied';
        }
      }

      return true;
    },
    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          type: user.type,
          access: user.access,
        };
      }

      // Return previous token if the user hasn't changed
      return token;
    },
        async session({ session, user } : SessionProps) {
            session.user.id = user.id;
            return session;
        },
    },
}

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };