
interface Review {
  id: string;
  rating: number;
  comment: string;
  name: string;
  timestamp: number;
  hidden: boolean;
}

const REVIEWS_KEY = 'brain-burst-reviews';

export const reviewStorage = {
  addReview: (review: { rating: number; comment: string; name: string }) => {
    const reviews = reviewStorage.getReviews();
    const newReview: Review = {
      id: Date.now().toString(),
      ...review,
      timestamp: Date.now(),
      hidden: true // Hide all reviews by default
    };
    
    reviews.push(newReview);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return newReview;
  },

  getReviews: (): Review[] => {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  getVisibleReviews: (): Review[] => {
    return reviewStorage.getReviews().filter(review => !review.hidden);
  },

  hideReview: (reviewId: string) => {
    const reviews = reviewStorage.getReviews();
    const updatedReviews = reviews.map(review => 
      review.id === reviewId ? { ...review, hidden: true } : review
    );
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));
  },

  showReview: (reviewId: string) => {
    const reviews = reviewStorage.getReviews();
    const updatedReviews = reviews.map(review => 
      review.id === reviewId ? { ...review, hidden: false } : review
    );
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));
  }
};
