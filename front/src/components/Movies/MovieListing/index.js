import MovieItemResume from '../MovieItemResume';

import styles from './index.module.scss';

const index = ({movies, onClose}) => {
  return (
    <div className={styles.listContainer}>
      {movies.map(movie => (
        <MovieItemResume key={movie.id} movie={movie} onClose={onClose} />
      ))}
    </div>
  );
};
export default index;
