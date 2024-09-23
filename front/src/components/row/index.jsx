import {React, useEffect, useRef, useState} from 'react';
import Card from '@/components/Card';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import {apiBdd} from '@/config/axios';
import styles from './index.module.scss';

const Index = props => {
  const {title, url, isWish, movies} = props;
  // const [movies, setMovies] = useState([]);
  const [myList, setMyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const responsive = {
    superLargeDesktop: {
      breakpoint: {max: 4000, min: 1920},
      items: 12,
      slidesToSlide: 12,
    },
    largeDesktop: {
      breakpoint: {max: 1920, min: 1440},
      items: 8,
      slidesToSlide: 8,
    },
    desktop: {
      breakpoint: {max: 1440, min: 1024},
      items: 6,
      slidesToSlide: 6,
    },
    tablet: {
      breakpoint: {max: 1024, min: 768},
      items: 5,
      slidesToSlide: 5,
    },
    mobile: {
      breakpoint: {max: 768, min: 480},
      items: 3,
      slidesToSlide: 3,
    },
    smallMobile: {
      breakpoint: {max: 480, min: 0},
      items: 2,
      slidesToSlide: 2,
    },
  };
  useEffect(() => {
    setMyList(JSON.parse(localStorage.getItem('wishList')));
  }, []);

  return (
    <div className={styles.row}>
      <h2 className={styles.row_title}>{title}</h2>
      <Carousel
        swipeable={true}
        draggable={false}
        showDots={false}
        responsive={responsive}
        ssr={true}
        infinite={true}
        autoPlay={false}
        shouldResetAutoplay={false}
        keyBoardControl={true}
        removeArrowOnDeviceType={['tablet', 'mobile']}>
        {movies &&
          movies.map(movie => {
            return (
              <div key={movie.id} className={styles.container_card}>
                <Card movie={movie} />
              </div>
            );
          })}
      </Carousel>
    </div>
  );
};

export default Index;
