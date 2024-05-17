import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';

const index = props => {
  const {review} = props;

  return (
    <div className={styles.container_section_review}>
      <div className="flex flex-row ">
        <div className="p-2">
          <h2>review by {review.author_name}</h2>
        </div>
        <div className="p-2">-</div>
        <div className="p-2">{review.appreciation?.title}</div>
      </div>
      <div className="p-4 text-justify">
        <pre className="p-2 text-justify format_pre">{review.content}</pre>
      </div>
    </div>
  );
};

export default index;
