import React from 'react';
import styles from './index.module.scss';
import Button from '@/components/Button';
import {LuX} from 'react-icons/lu';

const Index = props => {
  const {title, children, setShowModal, modalStatut} = props;
  return (
    <div className={`${styles.modal} ${modalStatut && styles.open}`}>
      <h2>{title}</h2>
      {children}
      <Button
        classes={styles.modal_close}
        onClick={() => setShowModal(false)}
        text={<LuX />}
      />
    </div>
  );
};

export default Index;
