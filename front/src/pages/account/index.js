import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import {apiStripe} from '@/config/axios';
import {useUser} from '@/context/UserContext';
import Title from '@/components/Account/Title';
import WithAuth from '@/HDC/withAuth';
import Card from '@/components/Account/Card';
import CardRow from '@/components/Account/CardRow';
import {IoSettingsOutline} from 'react-icons/io5';
import {MdOutlineSecurity} from 'react-icons/md';
import {CiCreditCard1, CiLock} from 'react-icons/ci';

const Index = () => {
  const {user, token} = useUser();
  const [subscription, setSubscription] = useState(null);
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
        <p>Chargement en cours...</p> // Afficher un spinner ou un message pendant le chargement
      ) : subscription ? (
        <Card title={'Abonnement'}>
          <CardRow
            title={subscription?.name}
            subtitle={`Date d'expiration : ${subscription?.current_period_end}`}
            details={`Mode de paiement : ${subscription?.cardNumber}`}
          />
          <CardRow
            title={"Gérer l'abonnement"}
            onClick={() => handleManageSubscription()}
            topBorder
          />
        </Card>
      ) : (
        <p>Vous n'avez pas d'abonnement</p>
      )}

      <Card title={'Informations'}>
        {subscription && (
          <CardRow
            title={"Changer d'offre"}
            icon={<CiCreditCard1 />}
            topBorder
          />
        )}
        <CardRow
          title={'Mettre à jour ses informations'}
          icon={<MdOutlineSecurity />}
          topBorder
        />
        <CardRow
          title={'Mettre à jour le mot de passe'}
          icon={<CiLock />}
          topBorder
        />
        <CardRow
          title={'Modifier les paramètres'}
          subtitle={'Langues, thèmes, notifications, confidentialité et plus'}
          icon={<IoSettingsOutline />}
          topBorder
        />
      </Card>
    </div>
  );
};
export default WithAuth(Index);
