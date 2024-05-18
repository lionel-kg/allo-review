import React from 'react';
import styles from './index.module.scss';
import {MdChevronRight} from 'react-icons/md';

const Index = props => {
  const {title, subtitle, icon, topBorder, details, onClick} = props;

  return (
    <div
      className={`${styles.wrapper} ${topBorder ? styles.wrapper_border : ''}`}>
      <div className={styles.card_row} onClick={onClick}>
        <div className={styles.card_row_left}>
          {icon && icon}
          <div className={styles.card_row_text}>
            <p>{title}</p>
            {subtitle && <span>{subtitle}</span>}
            {details && <span>{details}</span>}
          </div>
        </div>
        <div className={styles.card_row_icon}>
          <MdChevronRight />
        </div>
      </div>
    </div>
  );
};

export default Index;
