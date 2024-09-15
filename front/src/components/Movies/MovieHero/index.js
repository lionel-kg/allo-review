import React, {useState} from 'react';
import {useRef} from 'react';
import Image from 'next/image';
import styles from './index.module.scss';
import ColorThief from 'colorthief';
import Button from '@/components/Button';
import {MdOutlinePlaylistAdd, MdEdit, MdClose} from 'react-icons/md';
import {FaPlay} from 'react-icons/fa';
import YouTube from 'react-youtube';

const Index = ({movie, isLiked, toggleLike, openReview}) => {
  const imageRef = useRef(null);

  const [colorImage, setColorImage] = useState([0, 0, 0]);

  const [showTrailer, setShowTrailer] = useState(false);

  const images = JSON.parse(movie.images);

  const handleImageLoad = () => {
    const colorThief = new ColorThief();
    const img = imageRef.current;
    if (img) {
      setColorImage(colorThief.getColor(img, 25));
    }
  };

  return (
    <>
      <div
        className={styles.hero}
        style={{
          backgroundColor: `rgb(${colorImage[0]}, ${colorImage[1]}, ${colorImage[2]})`,
        }}>
        <div className={styles.hero_content}>
          <div className={`${styles.poster} ${styles.desktop}`}>
            <Image
              src={`https://image.tmdb.org/t/p/w300/${images[0].path}`}
              alt="hero"
              width={200}
              height={300}
            />
          </div>
          <div className={styles.overview}>
            <h1 className={styles.overview_title}>{movie.title}</h1>

            <div className={styles.overview_action}>
              <Button
                classes={styles.like_btn}
                text={isLiked ? 'Remove from My List' : 'Add to My List'}
                onClick={toggleLike}
                icon={
                  isLiked ? <MdOutlinePlaylistAdd /> : <MdOutlinePlaylistAdd />
                }
              />
              <Button
                classes={styles.review_btn}
                text="Review"
                icon={<MdEdit />}
                onClick={openReview}
              />
            </div>
            <div class={styles.hero_rating}>
              {movie.appreciation && <p>{movie.appreciation?.title}</p>}
            </div>

            <p className={styles.hero_description}>{movie.overview}</p>
          </div>
        </div>
        <div className={styles.hero_backdrop}>
          <Image
            src={`https://image.tmdb.org/t/p/original/${images[1].path}`}
            alt="hero"
            fill="cover"
            objectFit="cover"
            ref={imageRef}
            onLoad={handleImageLoad}
            className={`${showTrailer ? styles.trailer_active : ''}`}
          />
          <div
            className={`${styles.overlay} ${styles.desktop}`}
            style={{
              background: `radial-gradient(100% 160% at 100% 0%, transparent 60%, rgb(${colorImage[0]}, ${colorImage[1]}, ${colorImage[2]}))`,
            }}></div>
          <div
            className={`${styles.overlay} ${styles.mobile}`}
            style={{
              background: `linear-gradient(0deg, rgb(${colorImage[0]}, ${colorImage[1]}, ${colorImage[2]}), transparent 50%)`,
            }}></div>

          <button
            className={styles.player_icon}
            onClick={() => setShowTrailer(true)}>
            <FaPlay size={50} />
          </button>

          {showTrailer && (
            <>
              <div
                className={`${styles.trailer_overlay} ${styles.mobile}`}
                onClick={() => setShowTrailer(false)}></div>
              <div className={styles.trailer}>
                <button
                  className={styles.close}
                  onClick={() => setShowTrailer(false)}>
                  Close <MdClose />
                </button>
                <YouTube
                  videoId={movie.trailer}
                  className={styles.youtube}
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                      autoplay: 1,
                      controls: 1,
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
