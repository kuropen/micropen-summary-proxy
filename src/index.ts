import { Hono } from 'hono'
import { summaly, version } from '@misskey-dev/summaly'

const app = new Hono()

app.get('/url', async (c) => {
  const { url, userAgent, timeout, contentLengthLimit, contentLengthRequired } = c.req.query()
  const summalyOptions = {
    userAgent,
    contentLengthLimit: parseInt(contentLengthLimit || '10485760'),
    contentLengthRequired: contentLengthRequired === 'true' ? true : false,
    responseTimeout: parseInt(timeout || '20000'),
    operationTimeout: parseInt(timeout || '60000'),
  }
  const summalyResponse = await summaly(url, summalyOptions)
  return c.json(summalyResponse)
})

app.get('/version', (c) => {
  return c.text(version)
})

export default app

