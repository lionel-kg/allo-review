import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {useUser} from '@/context/UserContext';
import Withauth from '@/HDC/withAuth';
import {fetchRecommendationsList} from '@/services/recommendations';
import Title from '@/components/Account/Title';
import Grid from '@/components/Movies/Grid';

const Index = () => {
  const router = useRouter();
  const {user} = useUser();
  const [recommendationsList, setRecommendationsList] = useState([]);

  useEffect(() => {
    const {id} = router.query;
    if (id) {
      fetchRecommendationsList(router.query.id).then(res => {
        setRecommendationsList(res.movies);
      });
    }
  }, [router.query]);

  return (
    <div className="custom_margin_top custom_padding_horizontal">
      <Title title={`My recommendations list`} />
      <Grid movies={recommendationsList} />
    </div>
  );
};

export default Withauth(Index);
