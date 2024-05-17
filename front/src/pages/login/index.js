import React, {use, useState} from 'react';
import {apiAuth} from '@/config/axios';
import {useRouter} from 'next/router';
import LoginForm from '@/components/Form/login';
import {redirect} from 'next/navigation';

const index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const ssoLogin = service => {
    if (service === 'google') {
      router.replace(`${process.env.API_BASE_URL}auth/login`);
    } else if (service === 'facebook') {
      apiAuth.get('auth/user').then(res => {
        localStorage.setItem('token', res.data.token);
        redirect('success');
      });
    }
  };

  return (
    <div className={'container_page'}>
      <LoginForm />
    </div>
  );
};

export default index;
