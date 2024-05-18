import {React, useState, useEffect} from 'react';
import Button from '@/components/Button';
import {LuInfo} from 'react-icons/lu';
import axios from 'axios';
import YouTube from 'react-youtube';
import {useRouter} from 'next/router';
import styles from './index.module.scss';

const Index = props => {
  const {movie, handleClickModal, showModal, closeModal} = props;
  const router = useRouter();
  const [trailer, setTrailer] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [bannerStyle, setBannerStyle] = useState({});

  const truncateDescription = (desc, number) => {
    return desc?.length > number ? desc.substr(0, number - 1) + '...' : null;
  };

  useEffect(() => {
    console.log(movie);
    if (movie) {
      const images = JSON.parse(movie.images);
      setBannerStyle({
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${images[1].path}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      });
    }
  }, [playing]);

  return (
    <header className={styles.banner} style={bannerStyle} onClick={closeModal}>
      <div className={styles.banner_content}>
        <h1 className={styles.banner_title}>
          {movie?.title || movie?.original_title}
        </h1>
        <p className={styles.banner_description}>
          {movie?.overview && truncateDescription(movie.overview, 200)}
        </p>
        <div className={styles.banner__buttons}>
          {/* <YouTube
            videoId={movie?.trailer}
            className={"youtube amru"}
            containerClassName={"youtube-container amru"}
            opts={{
              width: "100%",
              height: "100%",
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
          /> */}

          <div className={styles.banner_buttons}>
            <Button
              classes="banner_btn"
              text="Plus d'infos"
              icon={<LuInfo />}
              onClick={() => {
                router.push('/movies/' + movie.id);
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Index;
