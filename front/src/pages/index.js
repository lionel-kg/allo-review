import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Cookies from 'js-cookie';
import CustomButton from '@/components/CustomButton';
import Subscription from '@/components/Subscription';
import {useUser} from '@/context/UserContext';
import Movies from '@/pages/movies/index';

const Index = () => {
  const router = useRouter();
  const {user} = useUser();

  return (
    <div>
      <Movies />
    </div>
  );
};

export default Index;
