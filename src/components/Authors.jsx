/* eslint-disable react/prop-types */
import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
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
const Authors = ({show, allAuthors}) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  }
  )

  const submit = async (event) => {
    event.preventDefault()
    console.log('update author...')
    try {
      console.log( { name, born })
      await editAuthor({ variables: { name, born: parseInt(born) } })
      setName('')
      setBorn('')
    } catch (error) {
      console.error('Error updating author:', error)
    }
  }

  if (!show) {
    return null
  }
  const authors = allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
          <select onChange={({ target }) => setName(target.value)}>
            {authors.map((a) => (
              <option key={a.name} value={a.name} >{a.name}</option>
            ))}
          </select>
          <input type="number" value={born} onChange={({ target }) => setBorn(target.value)} />
          <button type="submit">update author</button>
        </form>
      </div>
    </div>
  )
}

export default Authors
