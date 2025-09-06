import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import {prisma} from "@repo/db";
import {GOOGLE_ADMIN_ID, GOOGLE_ADMIN_SECRET, NEXTAUTH_SECRET} from "@repo/common/src";

type SessionProps = {
    session: any;
    user: any;
}

export const authOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        GoogleProvider ({
            clientId: GOOGLE_ADMIN_ID ?? "",
            clientSecret: GOOGLE_ADMIN_SECRET ?? ""
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

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };