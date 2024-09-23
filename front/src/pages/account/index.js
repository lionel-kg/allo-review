import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import {apiStripe} from '@/config/axios';
import {useUser} from '@/context/UserContext';
import Title from '@/components/Account/Title';
import WithAuth from '@/HDC/withAuth';
import Card from '@/components/Account/Card';
import CardRow from '@/components/Account/CardRow';
import Modal from '@/components/Account/Modal';
import FormInfo from '@/components/Form/info';
import {IoSettingsOutline} from 'react-icons/io5';
import {MdOutlineSecurity} from 'react-icons/md';
import {CiCreditCard1, CiLock} from 'react-icons/ci';

const Index = () => {
  const {user, token} = useUser();
  const [subscription, setSubscription] = useState(null);
  const [form, SetForm] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const getSubscription = async () => {
        setIsLoading(true);
        try {
          const subscription = await apiStripe.get(
            `/customer-subscription/${user.id}`,
          );
          setSubscription(subscription.data);
        } catch (error) {
          console.error(
            'Erreur lors de la récupération de l’abonnement:',
            error,
          );
        }
        setIsLoading(false);
      };
      getSubscription();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log(showModal);
  }, [showModal]);

  const handleManageSubscription = async () => {
    try {
      const response = await apiStripe.post(`/create-portal-session`);
      console.log(response);
      if (response.status === 200) {
        const portalSession = await response.data;
        // Rediriger l'utilisateur vers l'URL du portail Stripe
        window.location.href = portalSession.url;
      } else {
        const errorResponse = await response.data;
        console.error(
          'Failed to create Stripe portal session:',
          errorResponse.message,
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Title title={'Account'} />
      {isLoading ? (
        <p>Loading...</p>
      ) : subscription ? (
        <Card title={'Abonnement'}>
          <CardRow
            title={subscription?.name}
            subtitle={`Expiration date : ${subscription?.current_period_end}`}
            details={`Payment method : ${subscription?.cardNumber}`}
          />
          <CardRow
            title={'Manage subscription'}
            onClick={() => handleManageSubscription()}
            topBorder
          />
        </Card>
      ) : (
        <p>You don't have any subscription</p>
      )}

      <Card title={'Informations'}>
        {subscription && (
          <CardRow
            title={'Change your offer'}
            icon={<CiCreditCard1 />}
            topBorder
          />
        )}
        <CardRow
          onClick={() => {
            SetForm(
              <FormInfo
                action={() => {
                  setShowModal(false);
                }}
              />,
            );
            setShowModal(true);
          }}
          title={'Update your informations'}
          icon={<MdOutlineSecurity />}
          topBorder
        />
        {/* <CardRow
          title={'Mettre à jour le mot de passe'}
          icon={<CiLock />}
          topBorder
        />
        <CardRow
          title={'Modifier les paramètres'}
          subtitle={'Langues, thèmes, notifications, confidentialité et plus'}
          icon={<IoSettingsOutline />}
          topBorder
        /> */}
      </Card>

      <Modal modalStatut={showModal} setShowModal={setShowModal}>
        {form}{' '}
      </Modal>
    </div>
  );
};
export default Index;
