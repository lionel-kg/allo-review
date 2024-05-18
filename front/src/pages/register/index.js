import React, {use, useState} from 'react';
import {apiAuth} from '@/config/axios';
import {useRouter} from 'next/router';
import RegisterForm from '@/components/Form/register';
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

  const submit = () => {
    apiAuth
      .post('/auth/login', {email: email, password: password})
      .then(user => {});
  };
  return (
    <div className={'container_page'}>
      <RegisterForm />
    </div>
  );
};

export default index;
