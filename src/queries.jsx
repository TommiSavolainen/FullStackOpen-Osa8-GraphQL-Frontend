/* eslint-disable react-refresh/only-export-components */
import { gql } from '@apollo/client';

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
        value
        }
    }
    `;
export const ALL_BOOKS_WITH_GENRE = gql`
    query allBooks($genre: String) {
        allBooks(genre: $genre) {
        title
        author {
            name
        }
        published
        genres
        }
    }
    `;