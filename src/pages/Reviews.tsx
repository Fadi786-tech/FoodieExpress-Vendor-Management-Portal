import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { Flag, MessageSquareReply, Star, X, AlertCircle } from "lucide-react";

interface Review {
  id: number;
  customer: string;
  rating: number;
  date: string;
  comment: string;
  status: string;
}

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  
  // Modal states
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; reviewId: number | null }>({ isOpen: false, reviewId: null });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo) return;

    try {
      const response = await fetch(`/api/reviews/${replyingTo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: "Replied" })
      });
      const updated = await response.json();
      setReviews(reviews.map(r => r.id === updated.id ? updated : r));
      setReplyingTo(null);
      setReplyText("");
    } catch (error) {
      console.error('Error replying to review:', error);
    }
  };

  const handleReportClick = (id: number) => {
    setConfirmModal({ isOpen: true, reviewId: id });
  };

  const confirmReport = async () => {
    if (confirmModal.reviewId === null) return;
    try {
      await fetch(`/api/reviews/${confirmModal.reviewId}`, { method: 'DELETE' });
      setReviews(reviews.filter(r => r.id !== confirmModal.reviewId));
    } catch (error) {
      console.error('Error reporting review:', error);
    } finally {
      setConfirmModal({ isOpen: false, reviewId: null });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
        <p className="text-gray-500">Monitor and respond to customer feedback.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Overall Rating</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="text-5xl font-bold text-gray-900">4.6</div>
            <div className="flex items-center mt-2 text-yellow-400">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current text-gray-300" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Based on 1,245 reviews</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{review.customer}</h4>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex items-center mt-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    {review.status === "Pending" ? (
                      <Badge variant="warning">Needs Reply</Badge>
                    ) : (
                      <Badge variant="success">Replied</Badge>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-gray-700">{review.comment}</p>
                  <div className="mt-4 flex items-center gap-3">
                    {review.status === "Pending" && (
                      <Button variant="outline" size="sm" onClick={() => setReplyingTo(review)}>
                        <MessageSquareReply className="mr-2 h-4 w-4" />
                        Reply
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600" onClick={() => handleReportClick(review.id)}>
                      <Flag className="mr-2 h-4 w-4" />
                      Report
                    </Button>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No reviews available.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Action</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to report and remove this review? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setConfirmModal({ isOpen: false, reviewId: null })}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmReport}>
                Report & Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Reply to {replyingTo.customer}</h3>
              <button onClick={() => setReplyingTo(null)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm text-gray-700 italic border border-gray-200">
              "{replyingTo.comment}"
            </div>
            <form onSubmit={handleReplySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Reply</label>
                <textarea 
                  required 
                  rows={4}
                  value={replyText} 
                  onChange={e => setReplyText(e.target.value)} 
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Type your response here..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setReplyingTo(null)}>Cancel</Button>
                <Button type="submit">Send Reply</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
