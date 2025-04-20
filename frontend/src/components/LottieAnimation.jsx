import React from 'react';
import Lottie from 'react-lottie';
import loadingAnimation from '../assets/animations/loading.json';
import algorithmAnimation from '../assets/animations/algorithm.json';
import successAnimation from '../assets/animations/success.json';
import retryAnimation from '../assets/animations/retry.json';

function LottieAnimation({ animationName, height = 200, width = 200 }) {
  const getAnimationData = () => {
    switch (animationName) {
      case 'loading':
        return loadingAnimation;
      case 'algorithm':
        return algorithmAnimation;
      case 'success':
        return successAnimation;
      case 'retry':
        return retryAnimation;
      default:
        return loadingAnimation;
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: getAnimationData(),
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="lottie-container">
      <Lottie 
        options={defaultOptions}
        height={height}
        width={width}
      />
    </div>
  );
}

export default LottieAnimation;