import React, {useEffect, useState} from 'react';
import Title from '@/components/Account/Title';
import {apiStripe} from '@/config/axios';
import {useUser} from '@/context/UserContext';
import Card from '@/components/Account/Card';
import CardRow from '@/components/Account/CardRow';

const Index = () => {
  const {user, token} = useUser();
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // Vérifier si user est non null avant de procéder
    if (user) {
      const getSubscription = async () => {
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
      };
      getSubscription();
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
      <Title title={'Membership'} />
      {subscription ? (
        <>
          <Card title={'Offer details'}>
            <CardRow
              title={subscription?.name}
              subtitle={subscription?.description}
            />
            <CardRow
              title={'Manage subscription'}
              onClick={() => handleManageSubscription()}
              topBorder
            />
            <CardRow title={'Change your offer'} topBorder />
          </Card>
          <Card title={'Payment informations'}>
            <CardRow
              title={'Next payment'}
              subtitle={subscription?.current_period_end}
              details={subscription?.cardNumber}
            />
            <CardRow title={'Manage your payment method'} topBorder />
          </Card>
        </>
      ) : (
        <>
          <p>You don't have any subscription</p>
        </>
      )}
    </div>
  );
};
export default Index;
