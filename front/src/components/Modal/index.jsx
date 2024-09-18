import {React, useEffect, useState} from 'react';
import Button from '@/components/Button';
import CustomButton from '@/components/CustomButton';
import styles from './index.module.scss';
import {LuX} from 'react-icons/lu';

const Index = props => {
  const {
    movie,
    setShowModal,
    modalStatut,
    setContent,
    content,
    handleFunction,
  } = props;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log(modalStatut);
  }, []);

  return (
    <>
      <div
        className={`${styles.modal_overlay} ${modalStatut && styles.open}`}
      />

      <div className={`${styles.modal} ${modalStatut && styles.open}`}>
        <div className={styles.modal_banner}>
          <div className={styles.modal_content}>
            <h3 className={styles.modal_title + ' p-2 m-auto'}>
              {movie.title || movie.original_title}
            </h3>
            <textarea
              id=""
              cols="30"
              rows="10"
              className={styles.form_group}
              value={content}
              onChange={e => setContent(e.target.value)}></textarea>
            <CustomButton
              label="valider"
              classes="full-size"
              onclick={() => {
                handleFunction();
              }}
            />
          </div>
        </div>
        <Button
          classes={styles.modal_close}
          onClick={() => setShowModal(false)}
          text={<LuX />}
        />
      </div>
    </>
  );
};

export default Index;
