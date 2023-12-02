import { initTRPC } from "@trpc/server";
import { auth } from "@clerk/nextjs";

import { TRPCError } from "@trpc/server";
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const { userId, user } = auth();

  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      userId,
      user,
    },
  });
});
export const router = t.router;
export const publicProcedure = t.procedure;

export const privateProcedure = t.procedure.use(isAuth);
