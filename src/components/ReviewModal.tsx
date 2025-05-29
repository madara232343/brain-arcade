
import React, { useState } from 'react';
import { X, Star, Send, MessageSquare } from 'lucide-react';

interface ReviewModalProps {
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !review.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/xzzbzpnr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          review: review.trim(),
          timestamp: new Date().toISOString(),
          game: 'Brain Burst Arcade'
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-green-900/95 to-emerald-900/95 backdrop-blur-lg rounded-3xl max-w-md w-full border border-green-400/30 shadow-2xl animate-scale-in">
          <div className="p-8 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
              <p className="text-green-200">Your review has been submitted successfully.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg rounded-3xl max-w-md w-full border border-white/30 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Leave a Review</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-white font-medium mb-3">Rate your experience:</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-500'
                  }`}
                >
                  <Star className="h-8 w-8 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="review" className="block text-white font-medium mb-3">
              Tell us about your experience:
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
              placeholder="What did you like about Brain Burst Arcade? Any suggestions for improvement?"
              required
            />
          </div>

          <button
            type="submit"
            disabled={rating === 0 || !review.trim() || isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Submit Review</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
