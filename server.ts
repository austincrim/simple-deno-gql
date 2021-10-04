/// <reference path="./deploy.d.ts" />

import {
  buildSchema,
  graphql
} from 'https://raw.githubusercontent.com/adelsz/graphql-deno/v15.0.0/mod.ts'

const schemaString = await Deno.readTextFile('./schema.gql')
const schema = buildSchema(schemaString)

const notes = [
  {
    id: '1',
    title: 'Hello deno!',
    content: 'This is an example note'
  },
  {
    id: '2',
    title: 'Hello graphql!',
    content: 'This is a different note'
  }
]
const resolvers = {
  note: ({ id }: { id: string }) => {
    return notes.find((note) => note.id === id)
  }
}

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request: Request) {
  const { pathname } = new URL(request.url)

  if (pathname === '/' && request.method === 'GET') {
    return new Response(
      `<html><body><p>try posting a query to <pre>/graphql</pre></p></body></html>`,
      {
        status: 200,
        headers: {
          'content-type': 'text/html'
        }
      }
    )
  }
  if (pathname === '/graphql' && request.method === 'POST') {
    const contentType = request.headers.get('content-type')
    let query
    if (contentType === 'application/graphql') {
      query = await request.json()
    } else {
      const body = await request.json()
      query = body.query
    }
    const res = await graphql(schema, query, resolvers)

    return new Response(JSON.stringify(res), {
      status: 200
    })
  }

  return new Response(null, {
    status: 404,
    statusText: 'not found'
  })
}
