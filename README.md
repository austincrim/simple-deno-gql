# simple-deno-gql
barebones graphql server hosted on Deno Deploy

Send this query to `https://simple-deno-gql.deno.dev/graphql`
```graphql
{
  note(id: "1") {
    title
    content
  }
}
```
