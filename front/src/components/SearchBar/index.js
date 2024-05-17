import React, {useState, useEffect} from 'react';
import {IoClose} from 'react-icons/io5';
import {FaSearch} from 'react-icons/fa';

import {SearchMovies} from '@/services/movies';

import MovieListing from '@/components/Movies/MovieListing';

import styles from './index.module.scss';

const Index = ({onClose}) => {
  const [inputValue, setInputValue] = useState('');
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const searchingMovies = async () => {
      if (inputValue.length >= 3) {
        const response = await SearchMovies(inputValue);
        if (response && response.data) {
          setMovies(response.data);
        }
        return;
      }

      setMovies([]);
    };

    searchingMovies();
  }, [inputValue]);

  return (
    <div className={styles.overlay}>
      <div className={styles.searchContainer}>
        <FaSearch className={styles.searchIcon} />

        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          onChange={e => setInputValue(e.target.value)}
          autoFocus
        />
      </div>

      <MovieListing movies={movies} onClose={onClose} />

      <button onClick={onClose} className={styles.closeBtn}>
        <IoClose />
      </button>
    </div>
  );
};

export default Index;
