import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";
function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // function fetchMoviesHandler() {
  //   fetch("https://swapi.dev/api/films/")
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       const transformedMovies = data.results.map((moviesData) => {
  //         return {
  //           id: moviesData.episode_id,
  //           title: moviesData.title,
  //           openingText: moviesData.opening_crawl,
  //           releaseDate: moviesData.release_date,
  //           characters: moviesData.characters,
  //         };
  //       });
  //       setMovies(transformedMovies);
  //       // return data.results;
  //       // setMovies(data.results);
  //     });
  // }

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://react-http-efd56-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Somthing is wrong");
      }

      const data = await response.json();
      console.log("Fecth api data get from database", data);

      let loadMovie = [];

      for (const key in data) {
        loadMovie.push({
          id: key,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
          title: data[key].title,
        });
      }

      // const transformedMovies = data.results.map((moviesData) => {
      //   return {
      //     id: moviesData.episode_id,
      //     title: moviesData.title,
      //     openingText: moviesData.opening_crawl,
      //     releaseDate: moviesData.release_date,
      //     characters: moviesData.characters,
      //   };
      // });

      setMovies(loadMovie);
      // setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    // console.log(movie);
    const response = await fetch(
      "https://react-http-efd56-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log("data send local to database", data);
  }

  let content = <p>Data Not loading</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>

      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Data Noe loading</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>loading...</p>} */}

        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
