import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import {Tooltip} from 'react-tooltip';
import StarRating from '../StarRating';

const index = props => {
  const {review} = props;

  return (
    <div className={styles.container_section_review}>
      <div className="flex flex-row ">
        <div className="p-2">
          <p className="highlight">review by {review.author_name}</p>
        </div>
        <div className="p-2">-</div>
        <div className=" p-2 flex flex-row">
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
      <div className="p-4 text-justify">
        <pre className="p-2 text-justify format_pre">{review.content}</pre>
      </div>
      <Tooltip id="my-tooltip" />
    </div>
  );
};

export default index;
