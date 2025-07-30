import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Clock, Calendar, MapPin, Play } from 'lucide-react';
import { format } from 'date-fns';

interface Movie {
  _id: string;
  title: string;
  description: string;
  poster: string;
  rating: number;
  genre: string;
  duration: number;
  language: string;
  director: string;
  cast: string[];
  releaseDate: string;
  trailer: string;
}

interface Show {
  _id: string;
  date: string;
  time: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  screenNumber: number;
  theater: {
    _id: string;
    name: string;
    location: string;
    address: string;
  };
}

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieResponse, showsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/movies/${id}`),
          axios.get(`http://localhost:5000/api/shows/movie/${id}`)
        ]);
        
        setMovie(movieResponse.data);
        setShows(showsResponse.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Movie not found</h2>
        <Link
          to="/movies"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Movie Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            {movie.poster ? (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-96 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {movie.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{movie.rating}/10</span>
                </div>
                <span>{movie.genre}</span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{movie.duration} min</span>
                </div>
                <span>{movie.language}</span>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">{movie.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Director</h3>
                <p className="text-gray-600">{movie.director}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Cast</h3>
                <p className="text-gray-600">{movie.cast.join(', ')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Release Date</h3>
                <p className="text-gray-600">
                  {format(new Date(movie.releaseDate), 'MMMM dd, yyyy')}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Genre</h3>
                <p className="text-gray-600">{movie.genre}</p>
              </div>
            </div>

            {movie.trailer && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Trailer</h3>
                <a
                  href={movie.trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <Play className="h-4 w-4" />
                  <span>Watch Trailer</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Available Shows */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Shows</h2>
        
        {shows.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shows available</h3>
            <p className="text-gray-600">Check back later for upcoming shows.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shows.map((show) => (
              <div
                key={show._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{show.theater.name}</h3>
                  <span className="text-sm text-gray-500">Screen {show.screenNumber}</span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{show.theater.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(show.date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{show.time}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">₹{show.price}</span>
                    <span className="ml-2">({show.availableSeats} seats left)</span>
                  </div>
                  <Link
                    to={`/booking/${show._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail; 