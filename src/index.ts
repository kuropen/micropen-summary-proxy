import { Hono } from 'hono'
import { summaly, version } from '@misskey-dev/summaly'
import * as z from 'zod'

const app = new Hono()

const Options = z.object({
  userAgent: z.string().optional(),
  contentLengthLimit: z.int().default(10485760),
  contentLengthRequired: z.boolean().default(false),
  responseTimeout: z.int().default(20000),
  operationTimeout: z.int().default(60000),
})

app.get('/url', async (c) => {
  const { url, userAgent, timeout, contentLengthLimit, contentLengthRequired } = c.req.query()
  const summalyOptions = Options.parse({
    userAgent,
    contentLengthLimit,
    contentLengthRequired,
    responseTimeout: timeout,
    operationTimeout: timeout,
  })
  const summalyResponse = await summaly(url, summalyOptions)
  return c.json(summalyResponse)
})

app.get('/version', (c) => {
  return c.text(version)
})

export default app

