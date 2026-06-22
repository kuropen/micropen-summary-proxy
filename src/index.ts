import { Hono } from 'hono'
import { summaly, version } from '@misskey-dev/summaly'
import * as z from 'zod'

const app = new Hono()

const stringToInt = z.codec(z.string().regex(z.regexes.integer), z.int(), {
  decode: (str) => parseInt(str),
  encode: (num) => num.toString(),
})

const Options = z.object({
  userAgent: z.string().optional(),
  contentLengthLimit: stringToInt.default(10485760),
  contentLengthRequired: z.stringbool().default(false),
  responseTimeout: stringToInt.default(20000),
  operationTimeout: stringToInt.default(60000),
})

app.get('/url', async (c) => {
  const { url, userAgent, timeout, contentLengthLimit, contentLengthRequired } = c.req.query()
  const parsedUrl = z.url().parse(url)
  const summalyOptions = Options.parse({
    userAgent,
    contentLengthLimit,
    contentLengthRequired,
    responseTimeout: timeout,
    operationTimeout: timeout,
  })
  const summalyResponse = await summaly(parsedUrl, summalyOptions)
  return c.json(summalyResponse)
})

app.get('/version', (c) => {
  return c.text(version)
})

export default app

