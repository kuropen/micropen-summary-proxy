import { Hono } from 'hono'
import { summaly, version } from '@misskey-dev/summaly'
import * as z from 'zod'
import youtube from './youtube'

const app = new Hono()

const stringToInt = z.codec(z.string().regex(z.regexes.integer), z.int(), {
  decode: (str) => parseInt(str),
  encode: (num) => num.toString(),
})

const Options = z.object({
  lang: z.string().optional(),
  followRedirects: z.stringbool().default(true),
  userAgent: z.string().optional(),
  contentLengthLimit: stringToInt.default(10485760),
  contentLengthRequired: z.stringbool().default(false),
  responseTimeout: stringToInt.default(20000),
  operationTimeout: stringToInt.default(60000),
})

app.get('/url', async (c) => {
  /*
    プレビュー取得時のタイムアウト(ms) / key:timeout
    Content-Lengthの最大値(byte) / key:contentLengthLimit
    Content-Lengthが取得できた場合のみプレビューを生成 / key:contentLengthRequired
    User-Agent / key:userAgent
  */
  const { url, lang, followRedirects, userAgent, timeout, contentLengthLimit, contentLengthRequired } = c.req.query()
  const parsedUrl = z.url().parse(url)
  const summalyOptions = Object.assign(Options.parse({
    lang,
    followRedirects,
    userAgent,
    contentLengthLimit,
    contentLengthRequired,
    responseTimeout: timeout,
    operationTimeout: timeout,
  }), {
    plugins: [
      youtube,
    ]
  })
  const summalyResponse = await summaly(parsedUrl, summalyOptions)
  return c.json(summalyResponse)
})

app.get('/version', (c) => {
  return c.text(version)
})

export default app

