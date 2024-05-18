import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Cookies from 'js-cookie';
import CustomButton from '@/components/CustomButton';
import Subscription from '@/components/Subscription';
import {useUser} from '@/context/UserContext';

const Index = () => {
  const router = useRouter();
  const {user} = useUser();

  return (
    <div className="container_page custom_margin_top">
      <div></div>
      {user ? `Bienvenue ${user?.username}, vous êtes connecté` : 'Bienvenue'}
      <Subscription />
    </div>
  );
};

export default Index;
