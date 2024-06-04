/* eslint-disable react/prop-types */
import { useQuery } from "@apollo/client"
import { useState } from "react"
import { ALL_BOOKS_WITH_GENRE } from "../queries"
const Books = ({show, selectedGenre}) => {
  const [genre, setGenre] = useState(selectedGenre || '')
  const result = useQuery(ALL_BOOKS_WITH_GENRE, {
    variables: { genre }
  })

  if (!show) {
    return null
  }
  if (result.loading || !result.data) {
    return <div>Loading...</div>
  }

  console.log('result:', result)
  console.log('genre:', genre)
  const books = genre ? result.data.allBooks.filter((a) => a.genres.includes(genre)) : result.data.allBooks;
  const genresSet = new Set(books.flatMap((a) => a.genres))
  const genres = [...genresSet]
  console.log('genres:', genres)
  console.log('books:', books)
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.filter((a) => genre === '' || a.genres.includes(genre)).map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((a) => (
        <button key={a} onClick={() => setGenre(a)}>
          {a}
        </button>
      ))}
      <button onClick={() => setGenre('')}>all genres</button>
    </div>
  )
}

export default Books
