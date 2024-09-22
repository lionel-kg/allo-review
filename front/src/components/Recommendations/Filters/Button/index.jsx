import React, {useState} from 'react';
import styles from './index.module.scss';

const Index = ({options, category, onFilterChange, isMultiple}) => {
  const [selectedOptions, setSelectedOptions] = useState(isMultiple ? [] : '');

  const handleClick = option => {
    if (isMultiple) {
      setSelectedOptions(prevSelected => {
        const newSelected = prevSelected.includes(option)
          ? prevSelected.filter(item => item !== option)
          : [...prevSelected, option];
        onFilterChange(category, newSelected);
        return newSelected;
      });
    } else {
      setSelectedOptions(option);
      onFilterChange(category, option);
    }
  };

  return options.map(option => (
    <button
      key={option}
      onClick={() => handleClick(option)}
      className={`${styles.filter} ${
        selectedOptions.includes(option) ? styles.filter_selected : ''
      }`}>
      {option}
    </button>
  ));
};

export default Index;
