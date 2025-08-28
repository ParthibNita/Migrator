import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/loading.json';

const Loader = ({ height }) => {
  const style = {
    height,
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Lottie animationData={animationData} style={style} loop={true} />
    </div>
  );
};

export default Loader;
