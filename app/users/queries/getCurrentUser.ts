import db from "db"
import { SessionContext } from "blitz"

export default async function getCurrentUser(_ = null, ctx: { session?: SessionContext } = {}) {
  if (!ctx.session?.userId) return null

  const user = await db.user.findOne({
    where: { id: ctx.session!.userId },
    select: { id: true, name: true, email: true, role: true, accountId: true },
  })
  const primaryAccountId = await db.relationship.findOne({
    where: { secondaryAccountId: user?.accountId },
    select: { primaryAccountId: true },
  })
  const status  = await db.account.findOne({
    where: { id: primaryAccountId?.primaryAccountId },
    select: { verified: true }
  })
  return {
    ...user,
    status
  }
}
