/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommend from "./components/Recommend";
import { gql, useQuery, useApolloClient, useSubscription } from "@apollo/client";
import { BOOK_ADDED, ALL_BOOKS_WITH_GENRE } from "./queries";


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

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.name;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  // cache.modify({
  //   fields: {
  //     allBooks(existingBooks = []) {
  //       const newBookRef = cache.writeFragment({
  //         data: addedBook,
  //         fragment: gql`
  //           fragment NewBook on Book {
  //             title
  //             published
  //             id
  //           }
  //         `,
  //       });

  //       return uniqByName([newBookRef, ...existingBooks]);
  //     }
  //   }
  // });

  cache.updateQuery({ query: ALL_BOOKS }, (previousResult) => {
    return {
      allBooks: uniqByName(previousResult.allBooks.concat(addedBook)),
    };
  });
  // cache.updateQuery(query, ({allBooks}) => {
  //   return {
  //     allBooks: uniqByName(allBooks.concat(addedBook)),
  //   };
  // });
};
const App = () => {
  const [page, setPage] = useState("authors");
  const authorsResult = useQuery(ALL_AUTHORS);
  const booksResult = useQuery(ALL_BOOKS);
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  
  const { refetch } = useQuery(ALL_BOOKS_WITH_GENRE, {
    variables: { genre: '' }
  })
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data.data.bookAdded);
      const addedBook = data.data.bookAdded;
      window.alert(`New book added: ${addedBook.title}`);

      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    },
  });

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


  if (!token) {
    return (
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => {
          setPage("books")
          refetch()
        }}>books</button>
        <button onClick={() => setPage("login")}>login</button>
        <Authors show={page === "authors"} allAuthors={authorsResult.data?.allAuthors} />
        <Books show={page === "books"} allBooks={booksResult.data?.allBooks} selectedGenre={''}/>
        <LoginForm setToken={setToken} show={page === "login"} />
      </div>
    );
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => {
          setPage("books")
          refetch()
        }}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommend")}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === "authors"} allAuthors={authorsResult.data?.allAuthors} />

      <Books show={page === "books"} selectedGenre={''} allBooks={booksResult.data?.allBooks}/>
      <Recommend show={page === "recommend"} />
      <NewBook show={page === "add"} />

    </div>
  );
};

export default App;
