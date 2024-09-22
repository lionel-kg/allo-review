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
      name: 'Pack Découverte',
      price: '0€ / mois',
      callToAction: 'Essayez gratuitement',
      priceValue: 'price_1P6YD9ItkzdIGiy5oYtO235j',
      advantages: ['Avantage 1'],
      isTrial: true,
    },
    {
      name: 'Pack Standard',
      price: '9.99€ / mois',
      priceValue: 'price_1P6YD9ItkzdIGiy5oYtO235j',
      callToAction: "S'abonner",
      advantages: ['Avantage 1', 'Avantage 2'],
      isTrial: false,
    },
    {
      name: 'Pack Premium',
      price: '19.99€ / mois',
      priceValue: 'price_1P6YD9ItkzdIGiy5oYtO235j',
      callToAction: "S'abonner",
      advantages: ['Avantage 1', 'Avantage 2', 'Avantage 3'],
      isTrial: false,
    },
  ];

  return (
    <div className={styles.subscription}>
      <h3 className={styles.subscription_title}>
        A more effective way to track progress
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
