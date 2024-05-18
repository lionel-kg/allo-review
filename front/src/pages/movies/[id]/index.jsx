import axios from '@/config/axios';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import Button from '@/components/Button';
import {useUser} from '@/context/UserContext';
import YouTube from 'react-youtube';
import ReviewSection from '@/components/ReviewSection';
import Modal from '@/components/Modal';
import {MdOutlinePlaylistAdd, MdEdit} from 'react-icons/md';
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

  const fetchMovie = async () => {
    const {id} = router.query;
    if (id && user && loading !== false) {
      try {
        const response = await apiBdd.get(`/movie/${id}`);
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
          const isLiked = await apiBdd.get(`/user/${user.id}/likes/${id}`);
          console.log(isLiked);
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

  useEffect(() => {
    fetchMovie();
  }, [router.query, user]);

  const sendReview = async () => {
    apiBdd
      .post(`${process.env.BDD_API_BASE_URL}/review/`, {
        content: content,
        movieId: movie.id,
        userId: user.id,
        author_name: user.username,
      })
      .then(() => {
        fetchMovie();
        setShowModal(false);
      });
  };
  const toggleLike = async () => {
    if (!token) {
      return router.push('/login');
    } else {
      try {
        isLiked
          ? await apiBdd.delete(`/movie/${movie.id}/remove-like`, {
              userId: user.id,
            })
          : await apiBdd.post(`/movie/${movie.id}/add-like`, {userId: user.id});
        setIsLiked(!isLiked);
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    }
  };

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
      <div className={styles.container_hero + ' col-12 p-0'}>
        <div className={styles.container_hero_bg}></div>
        <div className={styles.cover} style={bannerStyle}></div>
        <div className={styles.bg_right + ' col-6 p-0'}>
          <div className={styles.container_content + ' ml-4'}>
            <div className="flex flex-row m-auto">
              <div className={styles.img}>
                {backDrop && (
                  <img
                    src={`https://image.tmdb.org/t/p/w185/${backDrop}`}
                    alt="Movie Backdrop"
                  />
                )}
              </div>
              <div>
                <div className="m-3">
                  <h1 className={styles.title}>{movie.title}</h1>
                  <div className="flex flex-row ">
                    <Button
                      classes="banner_btn"
                      text={isLiked ? 'Remove from My List' : 'Add to My List'}
                      onClick={toggleLike}
                      icon={
                        isLiked ? (
                          <MdOutlinePlaylistAdd />
                        ) : (
                          <MdOutlinePlaylistAdd />
                        )
                      }
                    />
                    <Button
                      classes="banner_btn"
                      text="Review"
                      icon={<MdEdit />}
                      onClick={() => {
                        setShowModal(!showModal);
                        console.log(showModal);
                      }}
                    />
                  </div>
                  <div>
                    <ul className="flex flex-row  p-3 list-disc">
                      {movie.original_language && (
                        <li className="mr-3">{movie.original_language}</li>
                      )}
                      {movie.appreciation && (
                        <li className="ml-3">{movie.appreciation?.title}</li>
                      )}
                    </ul>
                  </div>
                  <div>{movie.overview}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.container_trailer}>
          <div className="col-11">
            <div className={styles.box_trailer}>
              <YouTube
                videoId={movie?.trailer}
                className={'youtube amru h-full p-5'}
                containerClassName={'youtube-container amru'}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                    cc_load_policy: 0,
                    fs: 0,
                    iv_load_policy: 0,
                    modestbranding: 0,
                    rel: 0,
                    showinfo: 0,
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
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
