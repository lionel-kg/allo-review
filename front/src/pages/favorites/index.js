import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import Title from '@/components/Account/Title';
import WithAuth from '@/HDC/WithAuth';

const Index = () => {
  return (
    <div>
      <Title title={'Account'} />
    </div>
  );
};
export default WithAuth(Index);
