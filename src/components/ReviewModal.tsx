
import React, { useState } from 'react';
import { X, Star, Send, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReviewModalProps {
  onClose: () => void;
  onSubmit: (review: { rating: number; comment: string; name: string }) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Comment Too Short",
        description: "Please write at least 10 characters in your review.",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      rating,
      comment: comment.trim(),
      name: name.trim() || 'Anonymous'
    });

    toast({
      title: "Review Submitted! 🎉",
      description: "Thank you for your feedback!",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-hidden border border-white/30 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Write a Review</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Rating Section */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-3">
              Rate your experience:
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-all duration-200 hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-white/70 text-sm mt-2">
                {rating === 5 ? 'Excellent!' : 
                 rating === 4 ? 'Good!' : 
                 rating === 3 ? 'Average' : 
                 rating === 2 ? 'Below Average' : 'Poor'}
              </p>
            )}
          </div>

          {/* Name Section */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">
              Your Name (Optional):
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              maxLength={50}
            />
          </div>

          {/* Comment Section */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">
              Your Review:
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with Brain Burst Arcade..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              rows={4}
              maxLength={500}
              required
            />
            <div className="text-right text-white/50 text-sm mt-1">
              {comment.length}/500 characters
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Submit Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
