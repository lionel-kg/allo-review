import React, {useState} from 'react';
import styles from './index.module.scss';
import Input from '@/components/Input';
import {apiAuth} from '@/config/axios';
import {useRouter} from 'next/router';
import CustomButton from '@/components/CustomButton';
import Logo from '@/../public/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import options from '@/services/Cookies';

const index = () => {
  const [user, setUser] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const ssoLogin = service => {
    if (service === 'google') {
      router.replace(`${process.env.AUTH_API_BASE_URL}/auth/google`);
    } else if (service === 'github') {
      router.replace(`${process.env.AUTH_API_BASE_URL}/auth/github`);
    } else if (service === 'discord') {
      router.replace(`${process.env.AUTH_API_BASE_URL}/auth/discord`);
    }
  };

  const resetPassword = () => {
    // Rediriger l'utilisateur vers la page de réinitialisation de mot de passe
    router.push('/reset-password');
  };

  const submit = () => {
    apiAuth
      .post('/auth/login', {
        email: email,
        password: password,
      })
      .then(res => {
        Cookies.set('jwt', res.data.token, options);
        router.push('/movies');
      });
  };

  return (
    <div className={'container_page_form'}>
      <div className={styles.container_form}>
        <div className="flex justify_center ">
          <Image src="/logo.png" alt="logo" width={250} height={160} />
        </div>
        <div className={styles.container_input}>
          <Input
            label="Email"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div className="p-2">
          <CustomButton
            label="Continue"
            classes="full-size"
            onclick={() => {
              submit();
            }}
          />
        </div>
        <div className={styles.forgot_password + ' p-2'}>
          <a href="#" onClick={resetPassword}>
            Forgot your password ?
          </a>
        </div>
        <div className={styles.container_ssolog + ' justify_between p-2'}>
          <div>
            <i
              className="pi pi-google pointer"
              onClick={() => ssoLogin('google')}></i>
            <i
              className="pi pi-github pointer"
              onClick={() => ssoLogin('github')}></i>
            <i
              className="pi pi-discord pointer"
              onClick={() => ssoLogin('discord')}></i>
          </div>
          <div className="center_vertical text-xl">
            <Link href="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
