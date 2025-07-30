import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, Ticket, X } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  _id: string;
  bookingId: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  bookingDate: string;
  showDate: string;
  showTime: string;
  seats: Array<{
    seatNumber: string;
    price: number;
  }>;
  movie: {
    _id: string;
    title: string;
    poster: string;
  };
  theater: {
    _id: string;
    name: string;
    location: string;
  };
  show: {
    _id: string;
    screenNumber: number;
  };
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setCancelling(bookingId);
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">My Bookings</h1>
        <p className="text-gray-600">View and manage your movie bookings</p>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">You haven't made any bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Movie Poster */}
                <div className="md:col-span-1">
                  {booking.movie.poster ? (
                    <img
                      src={booking.movie.poster}
                      alt={booking.movie.title}
                      className="w-full rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>

                {/* Booking Details */}
                <div className="md:col-span-3 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {booking.movie.title}
                      </h3>
                      <p className="text-sm text-gray-600">Booking ID: {booking.bookingId}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{booking.theater.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {format(new Date(booking.showDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{booking.showTime}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600">Screen:</span>
                        <span className="ml-2 font-medium">{booking.show.screenNumber}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Seats:</span>
                        <span className="ml-2 font-medium">
                          {booking.seats.map(s => s.seatNumber).join(', ')}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="ml-2 font-medium">₹{booking.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Booked on {format(new Date(booking.bookingDate), 'MMM dd, yyyy')}
                    </div>
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancelling === booking._id}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        {cancelling === booking._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                          {cancelling === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings; 