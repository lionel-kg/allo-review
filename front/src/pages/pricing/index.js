import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Subscription from '@/components/Subscription';
import {useUser} from '@/context/UserContext';
import Withauth from '@/HDC/withAuth';
import CustomButton from '@/components/CustomButton';

const Index = () => {
  const router = useRouter();
  const {user} = useUser();

  // const handleManageSubscription = async () => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.STRIPE_API_BASE_URL}/create-portal-session`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: token,
  //         },
  //       },
  //     );
  //     if (response.ok) {
  //       const portalSession = await response.json();
  //       // Rediriger l'utilisateur vers l'URL du portail Stripe
  //       window.location.href = portalSession.url;
  //     } else {
  //       const errorResponse = await response.json();
  //       console.error(
  //         'Failed to create Stripe portal session:',
  //         errorResponse.message,
  //       );
  //       alert(errorResponse.message);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <div className="custom_margin_top  p-3">
      <div>
        <Subscription />
      </div>
    </div>
  );
};

export default Withauth(Index);
