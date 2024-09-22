import React from 'react';
import {useRouter} from 'next/router';
import styles from './index.module.scss';
import {getGenres} from '@/services/genres';
import {useState, useEffect} from 'react';
import Filters from './Filters';
import {addRecommendationsList} from '@/services/recommendations';
import {BsStars} from 'react-icons/bs';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import {useUser} from '@/context/UserContext';

const Index = ({onClose}) => {
  const router = useRouter();
  const {user} = useUser();
  const [genres, setGenres] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getGenres().then(test => setGenres(test.map(genre => genre.name)));
  }, []);

  const filters = {
    platforms: {
      options: ['Netflix', 'Prime Video', 'Disney Plus', 'Apple TV+', 'Hulu'],
      isMultiple: true,
      filterType: 'button',
      title: 'Platforms',
      description:
        "Select the streaming services you use, and we'll make sure the recommendations are available there.",
    },
    genres: {
      options: genres,
      isMultiple: true,
      filterType: 'button',
      title: 'Genres',
      description:
        'Select your favorite genres to help us suggest movies that match your mood.',
    },
    withReviews: {
      options: true,
      isMultiple: false,
      filterType: 'check',
      title: 'Reviews',
      description:
        'We’ll analyze your previous reviews to suggest movies tailored to your preferences.',
    },
    withLikes: {
      options: true,
      isMultiple: false,
      filterType: 'check',
      title: 'Likes',
      description:
        'Get movie recommendations based on what you’ve liked in the past. Discover more films you’ll love!',
    },
  };

  const handleFilterChange = (category, selectedOptions) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [category]: selectedOptions,
    }));
  };

  const handleRecommendations = () => {
    if (!user) {
      handleCloseRecommendations();
      router.push('/login');
      return;
    }
    if (user && user.subscriptions.length <= 0) {
      handleCloseRecommendations();
      router.push('/pricing');
      return;
    }
    setIsLoading(true);

    const params = {
      filters: selectedFilters,
    };

    addRecommendationsList(params)
      .then(response => {
        handleCloseRecommendations();
        router.push(`/recommendations/${response.data.listId}`);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(
          'Erreur lors de la récupération des recommandations:',
          error,
        );
        setIsLoading(false);
      });
  };

  const handleCloseRecommendations = () => {
    setSelectedFilters({});
    onClose();
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className={styles.recommendations}>
        <div className={styles.recommendations_title}>Recommendations</div>
        <div className={styles.recommendations_description}>
          <p>
            With our movie recommendation feature, you’re just a few clicks away
            from finding the perfect movies tailored to your taste.
          </p>
        </div>
        {Object.entries(filters).map(([category, filterConfig]) => (
          <Filters
            key={category}
            category={category}
            options={filterConfig.options}
            onFilterChange={handleFilterChange}
            isMultiple={filterConfig.isMultiple}
            filterType={filterConfig.filterType}
            title={filterConfig.title}
            description={filterConfig.description}
          />
        ))}
        <div className={styles.recommendations_button_container}>
          <Button
            onClick={handleRecommendations}
            icon={<BsStars />}
            classes={styles.recommendations_button}
            text="Générer"
          />
        </div>
      </div>
      <div
        className={styles.overlay}
        onClick={handleCloseRecommendations}></div>
    </>
  );
};

export default Index;
