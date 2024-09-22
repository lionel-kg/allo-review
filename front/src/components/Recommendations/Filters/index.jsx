import React from 'react';
import styles from './index.module.scss';
import Button from './Button';
import Check from './Check';

const Index = ({
  options,
  category,
  onFilterChange,
  isMultiple = false,
  filterType = 'button',
  title,
  description,
}) => {
  const renderFilter = () => {
    switch (filterType) {
      case 'button':
        return (
          <Button
            options={options}
            category={category}
            onFilterChange={onFilterChange}
            isMultiple={isMultiple}
          />
        );
      case 'check':
        return <Check category={category} onFilterChange={onFilterChange} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.filters}>
      <h3 className={styles.filters_title}>{title}</h3>
      <p className={styles.filters_description}>{description}</p>
      <div className={styles.filters_row}>{renderFilter()}</div>
    </div>
  );
};

export default Index;
