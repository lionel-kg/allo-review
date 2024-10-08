import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import Plan from './Plan';
import LoginForm from '@/components/Form/login';
import Modal from '@/components/Modal';

import {useUser} from '@/context/UserContext';

const Index = () => {
  const {token, user} = useUser();
  const [showModal, setShowModal] = useState(false);
  // Exemple
  const plans = [
    {
      name: 'Free Pack',
      price: '0€ / month',
      priceValue: 'price_1P6YD9ItkzdIGiy5oYtO235j',
      callToAction: 'Free',
      advantages: [
        'Limited filters access',
        'Review limited to 1000 characters',
        'Advertising',
      ],
      isFree: true,
      isTrial: true,
    },
    {
      name: 'Standard Pack',
      price: '9.99€ / month',
      priceValue: 'price_1P6YD9ItkzdIGiy5oYtO235j',
      callToAction: 'Subscribe',
      advantages: [
        'Unlimited recommendations',
        'Access to all filters',
        'Unlimited reviews',
        'No advertising',
      ],
      isTrial: false,
      isFree: false,
    },
  ];

  return (
    <div className={styles.subscription}>
      <h3 className={styles.subscription_title}>
        Upgrade for More Features and Flexibility
      </h3>

      <div className={styles.subscription_pricing}>
        {plans.map((plan, index) => (
          <Plan
            key={index}
            plan={plan}
            setShowModal={setShowModal}
            classe={index % 2 === 1 ? styles.reverse : ''}
          />
        ))}
      </div>
      {!user ? (
        <Modal modalStatut={showModal} setShowModal={setShowModal} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Index;
