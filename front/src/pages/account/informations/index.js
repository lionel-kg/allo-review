import React, {useEffect, useState} from 'react';
import Title from '@/components/Account/Title';
import {useUser} from '@/context/UserContext';
import Card from '@/components/Account/Card';
import CardRow from '@/components/Account/CardRow';
import {CiMail, CiLock} from 'react-icons/ci';

const Index = () => {
  const {user, token} = useUser();

  return (
    <div>
      <Title title={'Informations'} />
      <Card title={'Détails du compte'}>
        <CardRow title={'Mot de passe'} icon={<CiLock />} />
        <CardRow
          title={'E-mail'}
          subtitle={user?.email}
          icon={<CiMail />}
          topBorder
        />
      </Card>
      <p>Supprimer le compte</p>
    </div>
  );
};
export default Index;
