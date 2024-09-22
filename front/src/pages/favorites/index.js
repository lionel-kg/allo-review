import React, {useEffect, useState} from 'react';
import Title from '@/components/Account/Title';
import WithAuth from '@/HDC/withAuth';
import {useUser} from '@/context/UserContext';
import {fetchFavorites} from '@/services/favorites';
import Grid from '@/components/Movies/Grid';
const Index = () => {
  const {user} = useUser();

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user) {
      fetchFavorites(user.id).then(data => {
        console.log('data', data);
        setFavorites(data);
      });
    }
  }, [user]);

  return (
    <div className={`custom_margin_top custom_padding_horizontal`}>
      <Title title={'My favorites'} />
      <Grid movies={favorites} />
    </div>
  );
};
export default WithAuth(Index);
