import React, {useEffect, useState} from 'react';
import {useUser} from '@/context/UserContext';
import Withauth from '@/HDC/withAuth';
import {fetchRecommendations} from '@/services/recommendations';
import Title from '@/components/Account/Title';
import List from '@/components/Recommendations/List';

const Index = () => {
  const {user} = useUser();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (user) {
      fetchRecommendations(user.id).then(res => {
        setRecommendations(res);
      });
    }
  }, [user]);

  return (
    <div className={`custom_margin_top custom_padding_horizontal`}>
      <Title title={'My recommendations'} />
      <List recommendations={recommendations} />
    </div>
  );
};

export default Withauth(Index);
