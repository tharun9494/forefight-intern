import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  readOnly = false,
  size = 20 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const handleClick = (index: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index);
    }
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((index) => (
        <button
          key={index}
          type="button"
          className={`p-1 ${!readOnly ? 'cursor-pointer' : 'cursor-default'}`}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
          disabled={readOnly}
        >
          <Star
            size={size}
            className={`${
              (hoverRating || rating) >= index
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
