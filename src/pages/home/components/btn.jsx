import React from 'react';
// import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const SingleBtn = ({ cnName, name, route }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(route);
  };

  return (
    <button type='button' className={`BTN_${cnName} BTN`} onClick={handleClick}>
      {name}
    </button>
  );
};

export default SingleBtn;