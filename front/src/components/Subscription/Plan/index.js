import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import axios from '@/config/axios';
import getStripe from '@/utils/get-stripe';
import {useUser} from '@/context/UserContext';

const Index = ({plan}) => {
  const {token, user} = useUser();

  const handleSubscription = async (priceId, isTrial) => {
    const response = await fetch(
      `${process.env.STRIPE_API_BASE_URL}/create-checkout-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          priceId: priceId,
          userId: user.id,
          user: user,
          isTrial: isTrial,
        }),
      },
    );
    const session = await response.json();

    const stripe = await getStripe();
    const {error} = await stripe.redirectToCheckout({
      sessionId: session.sessionId,
    });
    localStorage.setItem('stripeSessionId', session.sessionId);
    if (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.plan}>
      <p className={styles.plan_name}>{plan.name}</p>
      <h5 className={styles.plan_price}>{plan.price}</h5>
      <button
        className={styles.plan_button}
        onClick={() => handleSubscription(plan.priceValue, plan.isTrial)}>
        {plan.callToAction}
      </button>
      <ul>
        {plan.advantages.map(element => {
          return (
            <>
              <li>
                <span>&#10004;</span>
                {element}
              </li>
            </>
          );
        })}
      </ul>
    </div>
  );
};

export default Index;
