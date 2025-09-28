import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import {prisma} from "@repo/db";
import {GOOGLE_ID, GOOGLE_SECRET, NEXTAUTH_SECRET} from "@repo/common/src";

type SessionProps = {
    session: any;
    user: any;
}

const authOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        GoogleProvider ({
            clientId: GOOGLE_ID ?? "",
            clientSecret: GOOGLE_SECRET ?? "",
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
        async session({ session, user } : SessionProps) {
            session.user.id = user.id;
            return session;
        },
    },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };