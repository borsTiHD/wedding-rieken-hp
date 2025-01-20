import { del } from '@@/server/lib/firestore'

export default defineEventHandler(async (event) => {
  try {
    const { col, id } = getQuery(event)

    await del(col as string, id as string)

    return { result: id }
  }
  catch (error) {
    return { error: (error as Error)?.message }
  }
})
