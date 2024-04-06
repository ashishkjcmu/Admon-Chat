import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/welcome"],
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};