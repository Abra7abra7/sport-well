import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['en', 'sk'];
const defaultLocale = 'sk';

function getLocale(request: any) {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value: string, key: string) => (negotiatorHeaders[key] = value));

    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    return match(languages, locales, defaultLocale);
}

const isPublicRoute = createRouteMatcher(['/((?!admin|client-zone|trener).*)']);

const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder');

export default clerkMiddleware(async (auth, req) => {
    const { pathname } = req.nextUrl;

    // 1. Check if the URL has a locale segment
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // 2. Redirect if there is no locale (only for pages, skip API etc)
    if (!pathnameHasLocale && !pathname.includes('.')) {
        const locale = getLocale(req);
        const url = new URL(req.url);
        url.pathname = `/${locale}${pathname}`;
        return NextResponse.redirect(url);
    }

    // 3. Protect routes
    if (hasClerkKeys && !isPublicRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
