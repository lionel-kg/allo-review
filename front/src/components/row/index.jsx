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
      // the naming can be any, depends on you.
      breakpoint: {max: 4000, min: 3000},
      items: 4,
      slidesToSlide: 4,
    },
    desktop: {
      breakpoint: {max: 3000, min: 1024},
      items: 6,
      slidesToSlide: 4,
    },
    tablet: {
      breakpoint: {max: 1024, min: 464},
      items: 6,
      slidesToSlide: 6,
    },
    mobile: {
      breakpoint: {max: 464, min: 0},
      items: 2,
      slidesToSlide: 2,
    },
  };
  useEffect(() => {
    setMyList(JSON.parse(localStorage.getItem('wishList')));
  }, []);
  // useEffect(() => {
  //   const getMovies = async () => {
  //     if (isWish === false) {
  //       const result = await apiBdd.get('/movie/', );
  //       setMovies(result.data.results);
  //       setLoading(false);
  //     }
  //   };

  //   if (loading === true) {
  //     getMovies();
  //   }
  // }, [loading]);

  return (
    <div className={styles.row}>
      <>
        <h2 className={styles.row_title}>{title}</h2>
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={false}
          responsive={responsive}
          ssr={true}
          infinite={true}
          autoPlay={false}
          shouldResetAutoplay={false}
          keyBoardControl={true}
          removeArrowOnDeviceType={['tablet', 'mobile']}
          itemClass="list_movies carousel-item-padding-5-px">
          {movies &&
            movies.map(movie => {
              return (
                <div key={movie.id}>
                  <Card movie={movie} />
                </div>
              );
            })}
        </Carousel>
      </>
    </div>
  );
};

export default Index;
