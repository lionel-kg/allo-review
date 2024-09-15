import React from 'react';
import styles from './index.module.scss';
import YouTube from 'react-youtube';

const Index = ({trailer}) => {
  return (
    <div className={styles.box_trailer}>
      <YouTube
        videoId={trailer}
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
  );
};

export default Index;
