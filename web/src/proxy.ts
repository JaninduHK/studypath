import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { homeForAccountType } from "@/lib/auth/routes";

const studentRoutePrefix = "/dashboard";
const adviserRoutePrefix = "/adviser";
const staffRoutePrefix = "/admin";
const authRoutes = ["/login", "/signup"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isStudentRoute = pathname.startsWith(studentRoutePrefix);
  const isAdviserRoute = pathname.startsWith(adviserRoutePrefix);
  const isStaffRoute = pathname.startsWith(staffRoutePrefix);
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (!session?.user) {
    if (isStudentRoute || isAdviserRoute || isStaffRoute) {
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const { accountType } = session.user;

  if (isAuthRoute) {
    return NextResponse.redirect(new URL(homeForAccountType(accountType), req.nextUrl));
  }
  if (isStudentRoute && accountType !== "student") {
    return NextResponse.redirect(new URL(homeForAccountType(accountType), req.nextUrl));
  }
  if (isAdviserRoute && accountType !== "adviser") {
    return NextResponse.redirect(new URL(homeForAccountType(accountType), req.nextUrl));
  }
  if (isStaffRoute && accountType !== "staff") {
    return NextResponse.redirect(new URL(homeForAccountType(accountType), req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|ico)$).*)"],
};
