import {FaStar, FaStarHalfAlt, FaRegStar} from 'react-icons/fa';

const StarRating = ({rating}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      {/* Full stars */}
      {Array(fullStars)
        .fill()
        .map((_, index) => (
          <FaStar key={index} color="#ffc107" />
        ))}

      {/* Half star */}
      {hasHalfStar && <FaStarHalfAlt color="#ffc107" />}

      {/* Empty stars */}
      {Array(emptyStars)
        .fill()
        .map((_, index) => (
          <FaRegStar key={index} color="#ffc107" />
        ))}
    </div>
  );
};

export default StarRating;
