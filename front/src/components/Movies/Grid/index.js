import React from 'react';
import styles from './index.module.scss';
import Image from 'next/image';
import Link from 'next/link';

const Index = ({movies}) => {
  return (
    <div className={styles.row}>
      {movies.map(movie => (
        <div className={styles.row_card} key={movie.id}>
          <Link href={`/movies/${movie.id}`} key={movie.id}>
            <Image
              src={`https://image.tmdb.org/t/p/w500/${
                JSON.parse(movie.images)[1].path
              }`}
              width={500}
              height={750}
              layout="responsive"
              alt={movie.title}
            />
            <p className={styles.title}>{movie.title}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Index;
