import React, {useState} from 'react';
import styles from './index.module.scss';

const CheckFilter = ({category, onFilterChange}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onFilterChange(category, newValue);
  };

  return (
    <label className={styles.filter}>
      <input type="checkbox" checked={isChecked} onChange={handleChange} />
      <span className={styles.toggle}></span>
    </label>
  );
};

export default CheckFilter;
