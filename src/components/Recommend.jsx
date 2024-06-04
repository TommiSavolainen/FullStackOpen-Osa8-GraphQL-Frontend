/* eslint-disable react/prop-types */
import { ME } from "../queries";
import { useQuery } from "@apollo/client";
import Books from "./Books";


const Recommend = ({ show }) => {
  const result = useQuery(ME);

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{result.data.me.favoriteGenre}</strong>
      </p>
        <Books show={true} selectedGenre={result.data.me.favoriteGenre}/>
    </div>
  );
};

export default Recommend;