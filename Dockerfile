FROM public.ecr.aws/awsguru/aws-lambda-adapter:1.0.1 AS aws-lambda-adapter

FROM oven/bun:1.4.4-debian

COPY --from=aws-lambda-adapter /lambda-adapter /opt/extensions/lambda-adapter

ENV PORT=8080
WORKDIR "/var/task"

COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

COPY . ./

ENTRYPOINT ["bun", "run", "src/index.ts"]
