import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Banner from '@/components/Banner';
import Row from '@/components/row';
import Withauth from '@/HDC/withAuth';
import {apiBdd} from '@/config/axios';

const Index = () => {
  const router = useRouter();
  // const [movies, setMovies] = useState([]);
  // const [genres, setGenres] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [dramaticMovies, setDramaticMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [AdventureMovies, setAdventureMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [moviesSearch, setMoviesSearch] = useState([]);
  const [movieBanner, setMovieBanner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trueLoading, setTrueLoading] = useState(true);

  const moviesFilter = (result, name) => {
    return result.filter(el => el.name === name)[0].movies;
  };

  useEffect(() => {
    if (loading === true) {
      setTrueLoading(true);
    }
    if (loading === false) {
      setTrueLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    const getGenres = async () => {
      const result = await apiBdd.get('/genre/');
      setDramaticMovies(moviesFilter(result.data, 'Drama'));
      setActionMovies(moviesFilter(result.data, 'Action'));
      setComedyMovies(moviesFilter(result.data, 'Comedy'));
      setAdventureMovies(moviesFilter(result.data, 'Adventure'));
    };

    const getCategory = async () => {
      const result = await apiBdd.get('/category/');

      setTopRatedMovies(moviesFilter(result.data, 'top_rated'));
      setTrendingMovies(moviesFilter(result.data, 'popular'));
      setUpcomingMovies(moviesFilter(result.data, 'upcoming'));

      setMovieBanner(
        moviesFilter(result.data, 'top_rated')[
          Math.floor(
            Math.random() * moviesFilter(result.data, 'top_rated')?.length - 1,
          )
        ],
      );
      setLoading(false);
    };
    if (loading === true) {
      getCategory();
      getGenres();
    }
  }, [loading]);

  return (
    <div className="mt-8">
      {trueLoading === true ? (
        'Loading'
      ) : (
        <>
          <Banner movie={movieBanner} />

          <div className="">
            <Row title={'Trending movies'} movies={trendingMovies} />
            <Row title={'Top rated'} movies={topRatedMovies} />
            <Row title={'Action movies'} movies={actionMovies} />
            <Row title={'Dramatic movies'} movies={dramaticMovies} />
            <Row title={'Comedy movies'} movies={comedyMovies} />
            <Row title={'Upcoming movies'} movies={upcomingMovies} />
          </div>
        </>
      )}
    </div>
  );
};
export default Withauth(Index);
