// components/CustomImage.js
import Image from 'next/image';
import PropTypes from 'prop-types';

const CustomImage = ({ src, alt, width, height }) => {
  return (
    <Image
      src={src || 'https://dummyimage.com/720x400'}
      alt={alt || 'Product image'}
      width={width || 600}       // Default width for responsive aspect ratio
      height={height || 400}     // Default height for responsive aspect ratio
      layout="responsive"        // Responsive layout
      objectFit="cover"          // Ensures the image covers its container
    />
  );
};

CustomImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default CustomImage;
