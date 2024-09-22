import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import Input from '@/components/Input';
import {apiAuth, apiNotif} from '@/config/axios';
import {useRouter} from 'next/router';
import CustomButton from '@/components/CustomButton';
import Image from 'next/image';

const Index = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();
  const [token, setToken] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {

    if (router.isReady) {
      const queryToken = router.query.token;
      setToken(queryToken); // Set token if available
      setLoading(false); // Set loading to false after token check
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if(token){
      console.log(token)
      checkToken()
    }
  }, [token])
  

  const handlePasswordResetRequest = () => {
    apiNotif
      .post(`/mail/reset-password`, { email })
      .then(response => {
        // Response handling
      })
      .catch(error => {
        console.error('Failed to request password reset:', error);
      })
      .finally(() => {
        router.push('/login');
      });
  };

  const checkToken = async () => {
    if(token){

      apiNotif
     .get(`/mail/reset-password/${token}`).then((res)=>{
      if(res.data.isExpired === true){
        router.push("/reset-password")
      }
    });
    }
  }

  const handleChangePassword = () => {
    apiNotif
      .post(`/mail/reset-password/${token}`, {
        newPassword 
      })
      .then(response => {
        router.push('/login');
      })
      .catch(error => {
        console.error('Failed to reset password:', error);
      });
  };

  return (
    <div className={'container_page_form'}>
      <div className={styles.container_form}>
        <div className="flex justify_center">
          <Image
            src="/logo-alloreview.png"
            alt="logo"
            width={250}
            height={160}
          />
        </div>
        <div className={styles.container_input}>
          {!token ? (
            <>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <CustomButton
                label="Send email"
                classes="full-size"
                onclick={handlePasswordResetRequest}
              />
            </>
          ) : (
            <>
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <CustomButton
                label="Change Password"
                classes="full-size"
                onclick={handleChangePassword}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
