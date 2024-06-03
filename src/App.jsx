import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { gql, useQuery, useApolloClient } from "@apollo/client";


const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;

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
`;

const App = () => {
  const [page, setPage] = useState("authors");
  const authorsResult = useQuery(ALL_AUTHORS);
  const booksResult = useQuery(ALL_BOOKS);
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  if (booksResult.loading) {
    return <div>loading...</div>;
  }

  if (authorsResult.loading) {
    return <div>loading...</div>;
  }

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  }
  console.log('token:', token)
  if (!token) {
    return (
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("login")}>login</button>
        <Authors show={page === "authors"} allAuthors={authorsResult.data?.allAuthors} />
        <Books show={page === "books"} allBooks={booksResult.data?.allBooks} />
        <LoginForm setToken={setToken} show={page === "login"} />
      </div>
    );
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === "authors"} allAuthors={authorsResult.data?.allAuthors} />

      <Books show={page === "books"} allBooks={booksResult.data?.allBooks}/>

      <NewBook show={page === "add"} />

    </div>
  );
};

export default App;
