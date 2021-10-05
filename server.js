import {
  buildSchema,
  graphql
} from "https://raw.githubusercontent.com/adelsz/graphql-deno/v15.0.0/mod.ts"

const schemaString = await Deno.readTextFile("./schema.gql")
const schema = buildSchema(schemaString)

const notes = [
  {
    id: "1",
    title: "Hello deno!",
    content: "This is an example note"
  },
  {
    id: "2",
    title: "Hello graphql!",
    content: "This is a different note"
  }
]
const resolvers = {
  note: ({ id }) => {
    return notes.find((note) => note.id === id)
  }
}

addEventListener("fetch", async (event) => {
  const { query } = await event.request.json()
  const result = await graphql(schema, query, resolvers)

  event.respondWith(new Response(JSON.stringify(result)))
})
