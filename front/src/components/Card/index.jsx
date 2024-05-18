import {React, useEffect, useState} from 'react';
import styles from './index.module.scss';
import {useRouter} from 'next/router';

const Index = props => {
  const {movie} = props;
  const router = useRouter();
  const [isHover, setIsHover] = useState(false);
  const [showModal, SetShowModal] = useState(false);
  const [backdrop, setBackdrop] = useState(null);

  useEffect(() => {
    const images = JSON.parse(movie.images);
    setBackdrop(images[1].path);
  }, [movie]);

  const mouseOnCard = () => {
    if (isHover === false) {
      setTimeout(() => {
        setIsHover(true);
      }, 300);
    }
  };

  const mouseOutsideCard = () => {
    if (isHover === true) {
      setTimeout(() => {
        setIsHover(false);
      }, 300);
    }
  };
  const showDetail = id => {
    router.push('/movies/' + id);
  };

  return (
    <>
      <div
        className={styles.card_movies}
        id={movie.title}
        onClick={() => showDetail(movie.id)}
        onMouseOver={mouseOnCard}
        onMouseOut={mouseOutsideCard}>
        <img src={`https://image.tmdb.org/t/p/w185/${backdrop}`} />
        <div className={styles.itemInfo}>
          <div className={styles.title_movies}>{movie?.title}</div>
        </div>
      </div>
    </>
  );
};

export default Index;
