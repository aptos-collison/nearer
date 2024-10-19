import React, { useState, useEffect } from "react";

interface Review {
  userName: string;
  reviewMessage: string;
  timestamp: string;
}

const ReviewDisplay: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/reviews');

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((review, index) => (
            <li key={index}>
              <strong>{review.userName}</strong>
              <p>{review.reviewMessage}</p>
              <small>{new Date(review.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewDisplay;