
import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReviewModalProps {
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ onClose }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send review to email
      const reviewData = {
        rating,
        review,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };

      // Here you would typically send to your backend
      // For now, we'll simulate sending to email
      console.log('Review submitted:', reviewData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "🌟 Review Submitted!",
        description: "Thank you for your feedback!",
        duration: 3000,
      });

      onClose();
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to submit review. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg rounded-3xl max-w-md w-full border border-white/30 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
          <h2 className="text-2xl font-bold text-white">Leave a Review</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-white font-medium mb-3">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-all duration-200 hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-white/30'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-white font-medium mb-3">Your Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us about your experience with Brain Burst Arcade..."
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-200 resize-none"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !review.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <div className="loading-spinner" />
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
