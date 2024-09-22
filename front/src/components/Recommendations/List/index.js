import React from 'react';
import Image from 'next/image';
import styles from './index.module.scss';
import Link from 'next/link';
const List = ({recommendations}) => {
  return (
    <div className={styles.list}>
      {recommendations.map((recommendation, index) => {
        const movies = recommendation.movies.slice(0, 4);
        return (
          <div key={recommendation.id} className={styles.card}>
            <Link href={`/recommendations/${recommendation.id}`}>
              <div className={styles.image_container}>
                {movies.map((movie, index) => {
                  const images =
                    typeof movie.images === 'string'
                      ? JSON.parse(movie.images)
                      : movie.images;

                  if (!images || images.length === 0) return null;

                  return (
                    <div key={index} className={styles.image_wrapper}>
                      <Image
                        src={`https://image.tmdb.org/t/p/w500/${images[0].path}`}
                        alt={movie.title}
                        width={100}
                        height={100}
                        layout="responsive"
                      />
                    </div>
                  );
                })}
              </div>
            </Link>
            <div className={styles.card_content}>
              <p className={styles.title}>Recommendation list n°{index + 1}</p>
              <p className={styles.date}>
                Created at:{' '}
                {new Date(recommendation.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default List;
