import React, {useState} from 'react';
import Link from 'next/link';
import Loader from '@/components/Loader';
import {addNewMovie} from '@/services/movies';

import styles from './index.module.scss';

const index = ({movie, onClose}) => {
  const [isLoading, setIsLoading] = useState(false);

  const pathImage =
    movie.poster_path ||
    movie.images?.find(
      img =>
        (img.name === 'poster' && img.path) ||
        (img.name === 'backdrop' && img.path),
    )?.path;

  const date = new Date(movie.release_date).toLocaleDateString('en');

  const handleClick = async e => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const movieExists = (await addNewMovie(movie))?.data;

      if (movieExists) {
        setIsLoading(false);
        onClose();

        window.location.href = `/movies/${movieExists.id}`;
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <a href={`/movies/${movie.id}`} onClick={handleClick}>
        <div className={styles.container}>
          <img
            src={`https://image.tmdb.org/t/p/w185/${pathImage}`}
            alt={movie.title}
            className={styles.image}
          />

          <div className={styles.details}>
            <div className={styles.title}>{movie.title}</div>

            <div className={styles.releaseDate}>Release date: {date}</div>
          </div>
        </div>
      </a>
    </>
  );
};

export default index;
