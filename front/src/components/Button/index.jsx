import React from 'react';

const Index = props => {
  const {classes, type, onClick, text, icon} = props;

  return (
    <div>
      <button className={classes} type={type} onClick={onClick}>
        {icon ? icon : null}
        {text}
      </button>
    </div>
  );
};

export default Index;
