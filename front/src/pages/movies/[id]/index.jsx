import axios from '@/config/axios';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import {useUser} from '@/context/UserContext';
import ReviewSection from '@/components/ReviewSection';
import MovieHero from '@/components/Movies/MovieHero';
import Modal from '@/components/Modal';
import {apiBdd} from '@/config/axios';

const Index = () => {
  const {token, user} = useUser();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [backDrop, setBackDrop] = useState('');
  const [bannerStyle, setBannerStyle] = useState({});
  const [content, setContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [idMovie, setIdMovie] = useState(null);

  const fetchMovie = async () => {
    if (idMovie && user && loading !== false) {
      try {
        const response = await apiBdd.get(`/movie/${idMovie}`);
        setMovie(response.data);
        console.log(showModal);
        const images = JSON.parse(response.data.images);
        if (images.length > 1 && images[1].path) {
          setBannerStyle({
            backgroundImage: `url("https://image.tmdb.org/t/p/original/${images[1].path}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          });
          setBackDrop(images[0].path);
        }

        try {
          const isLiked = await apiBdd.get(`/user/${user.id}/likes/${idMovie}`);
          setIsLiked(isLiked.data.isLiked);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching like status:', error);
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
        // Handle errors here, such as setting an error message state to display in the UI
      }
    }
  };

  const sendReview = async () => {
    apiBdd
      .post(`${process.env.BDD_API_BASE_URL}/review/`, {
        content: content,
        movieId: movie.id,
        userId: user.id,
        author_name: user.username,
      })
      .then(async () => {
        const response = await apiBdd.get(`/movie/${idMovie}`);
        setMovie(response.data);
        setShowModal(false);
      })
      .finally(() => {
        setContent('');
      });
  };

  const toggleLike = async () => {
    if (!token) {
      return router.push('/login');
    } else {
      try {
        isLiked
          ? await apiBdd.delete(`/movie/${movie.id}/remove-like`, {
              data: {
                userId: user.id,
              },
            })
          : await apiBdd.post(`/movie/${movie.id}/add-like`, {userId: user.id});
        setIsLiked(!isLiked);
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    }
  };

  useEffect(() => {
    const {id} = router.query;
    console.log(id);
    setIdMovie(id);
    if (idMovie) {
      fetchMovie();
    }
  }, [router.query, user, idMovie]);

  if (!movie) {
    return null; // Render nothing or a loading spinner until movie is fetched
  }

  return (
    <div className="container_page">
      <Modal
        movie={movie}
        modalStatut={showModal}
        content={content}
        setContent={setContent}
        handleFunction={sendReview}
        setShowModal={setShowModal}
      />
      <MovieHero
        movie={movie}
        isLiked={isLiked}
        toggleLike={toggleLike}
        openReview={() => setShowModal(true)}
      />
      <div className={styles.container_review}>
        <div className={styles.box_review}>
          <div>
            <h1 className={styles.section_title}> List of reviews</h1>
            {movie && movie.reviews.length > 0 ? (
              movie.reviews.map(review => {
                return <ReviewSection review={review} />;
              })
            ) : (
              <p className="font-italic	">No reviews</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
