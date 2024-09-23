import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import {Tooltip} from 'react-tooltip';
import StarRating from '../StarRating';

const index = props => {
  const {review} = props;

  const [isExpanded, setIsExpanded] = useState(false);

  // Limite de troncature
  const truncateLimit = 800;

  // Fonction pour basculer entre tronqué et complet
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.container_section_review}>
      <div className="flex flex-row flex-wrap ">
        <div className="p-2">
          <p className="highlight fit-content">{review.author_name}</p>
        </div>
        <div className="p-2">-</div>
        <div className="p-2 flex flex-row">
          <p
            className="highlight_appreciation "
            data-tooltip-id="my-tooltip"
            data-tooltip-content={review.appreciation?.description}>
            {review.appreciation?.title}
          </p>
          {review.appreciation && (
            <StarRating rating={review.appreciation?.stars} />
          )}
        </div>
      </div>
      <div className={`p-4 ${styles.review_content}`}>
        <pre className={`text-justify format_pre`}>
          {isExpanded
            ? review.content
            : review.content.substring(0, truncateLimit) +
              (review.content.length > truncateLimit ? '...' : '')}
        </pre>
        {review.content.length > truncateLimit && (
          <div
            className={`flex justify-end ${styles.expand_toggle}`}
            onClick={toggleExpand}>
            <span
              className={`${styles.arrow} ${
                isExpanded ? styles.arrow_up : styles.arrow_down
              }`}></span>
          </div>
        )}
      </div>
      <Tooltip id="my-tooltip" />
    </div>
  );
};

export default index;
