import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import axios from '@/config/axios';
import Cookies from 'js-cookie';
import CustomButton from '@/components/CustomButton';
import {useUser} from '@/context/UserContext';
import Withauth from '@/HDC/withAuth';

const Index = () => {
  const router = useRouter();
  const {token, user} = useUser();

  return (
    <div className="container_page custom_margin_top">
      <div></div>
      {token
        ? `Bienvenue, vous êtes connecté avec le token : ${token}`
        : 'Bienvenue'}
    </div>
  );
};

export default Index;
