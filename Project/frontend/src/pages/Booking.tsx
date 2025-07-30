import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

interface Show {
  _id: string;
  date: string;
  time: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  screenNumber: number;
  movie: {
    _id: string;
    title: string;
    poster: string;
  };
  theater: {
    _id: string;
    name: string;
    location: string;
    address: string;
    seatMatrix?: Array<{ row: string; number: number; status: string }>;
  };
  seatMatrix?: Array<{ row: string; number: number; status: string }>;
}

interface Seat {
  seatNumber: string;
  price: number;
}

interface SeatRender {
  seatNumber: string;
  isSelected: boolean;
  isBooked: boolean;
}

const Booking = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shows/${showId}`);
        setShow(response.data);
      } catch (error) {
        console.error('Error fetching show details:', error);
        toast.error('Failed to load show details');
      } finally {
        setLoading(false);
      }
    };

    if (showId) {
      fetchShowDetails();
    }
  }, [showId]);

  const handleSeatSelection = (seatNumber: string) => {
    if (!show) return;

    const seat: Seat = {
      seatNumber,
      price: show.price
    };

    const isSelected = selectedSeats.some(s => s.seatNumber === seatNumber);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.seatNumber !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    setBookingLoading(true);
    try {
      // 1. Book seats
      await axios.post('http://localhost:5000/api/bookings', {
        show: showId,
        seats: selectedSeats
      });
      // 2. Dummy payment
      await axios.post('http://localhost:5000/api/bookings/payment/dummy');
      toast.success('Booking & Payment successful!');
      navigate('/my-bookings');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Booking failed');
      } else {
        toast.error('Booking failed');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const generateSeats = (): SeatRender[] => {
    if (!show || !show.seatMatrix) return [];
    // Group seats by row
    const rows: { [row: string]: { number: number; status: string }[] } = {};
    show.seatMatrix.forEach(seat => {
      if (!rows[seat.row]) rows[seat.row] = [];
      rows[seat.row].push({ number: seat.number, status: seat.status });
    });
    // Sort rows alphabetically and seats numerically
    const sortedRows = Object.keys(rows).sort();
    const seats: SeatRender[] = [];
    sortedRows.forEach(row => {
      rows[row].sort((a, b) => a.number - b.number);
      rows[row].forEach(seat => {
        const seatNumber = `${row}-${seat.number}`;
        const isSelected = selectedSeats.some(s => s.seatNumber === seatNumber);
        const isBooked = seat.status === 'booked';
        seats.push({ seatNumber, isSelected, isBooked });
      });
    });
    return seats;
  };

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Show not found</h2>
        <button
          onClick={() => navigate('/movies')}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Show Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Movie Poster */}
          <div className="md:col-span-1">
            {show.movie.poster ? (
              <img
                src={show.movie.poster}
                alt={show.movie.title}
                className="w-full rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>

          {/* Show Info */}
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{show.movie.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{show.theater.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">
                  {format(new Date(show.date), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{show.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Screen {show.screenNumber}</span>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>{show.theater.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seat Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Your Seats</h2>
        
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-8 bg-gray-300 rounded"></div>
            <span className="ml-2 text-sm text-gray-600">Screen</span>
          </div>
          
          <div className="grid grid-cols-10 gap-2 max-w-2xl mx-auto">
            {generateSeats().map((seat) => (
              <button
                key={seat.seatNumber}
                onClick={() => handleSeatSelection(seat.seatNumber)}
                disabled={seat.isBooked}
                className={`
                  w-8 h-8 rounded text-xs font-semibold transition-colors
                  ${seat.isBooked 
                    ? 'bg-red-500 text-white cursor-not-allowed' 
                    : seat.isSelected 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
              >
                {seat.seatNumber}
              </button>
            ))}
          </div>

          <div className="flex justify-center space-x-6 mt-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Booked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Summary</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Selected Seats:</span>
            <span className="font-semibold">
              {selectedSeats.map(s => s.seatNumber).join(', ') || 'None'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Number of Seats:</span>
            <span className="font-semibold">{selectedSeats.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price per Seat:</span>
            <span className="font-semibold">₹{show.price}</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleBooking}
            disabled={selectedSeats.length === 0 || bookingLoading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bookingLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <CreditCard className="h-5 w-5" />
            )}
            <span>{bookingLoading ? 'Processing...' : 'Confirm Booking'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking; 