/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useState } from 'react'
import { gql, useMutation, useQuery, ApolloError } from '@apollo/client'
import { CREATE_AUTHOR } from '../queries'
import { updateCache } from '../App'

const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: { name: $author },
      published: $published,
      genres: $genres
    ) {
      title
      published
      genres
    }
  }
`
const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
        id
      }
      published
      id
    }
  }
`

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [createBook] = useMutation(CREATE_BOOK, {
    update: (cache, response) => {
      console.log('response:', response)
      updateCache(cache, { query: ALL_BOOKS }, response.data.addBook)
    },
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }]
    // update: (cache, response) => {
    //   updateCache(cache, {query: ALL_BOOKS}, response.data.addBook)
    // }
  })
  const [createAuthor] = useMutation(CREATE_AUTHOR)
  const { data } = useQuery(ALL_AUTHORS)
  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')
    console.log(data.allAuthors)
    if (data && data.allAuthors && !data.allAuthors.find((a) => a.name === author)) {
      console.log('author: ',author)
      console.log('add author...')
      try {
        await createAuthor({ variables: { name: author } })
      } catch (error) {
        if (error instanceof ApolloError) {
          console.error('GraphQL operation failed:', error.message);
        } else {
          console.error('Error creating author:', error);
        }
      }
    }
    await createBook({ variables: { title, author, published: parseInt(published), genres } })
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook