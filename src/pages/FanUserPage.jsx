import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext.jsx';
import { useConfig } from '../utils/config.js';
import SearchComponent from '../components/SearchComponent.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { toast } from 'react-toastify';

const FanUserPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const config = useConfig();
  const [favoriteAthletes, setFavoriteAthletes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user || user.role !== 'fan') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch favorite athletes
        const response = await fetch(`${config.API_URL}/fans/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch fan data');
        const data = await response.json();
        setFavoriteAthletes(data.fan.favorite_athletes || []);

        // Fetch notifications
        const notifResponse = await fetch(
          `${config.API_URL}/fans/${user.id}/notifications`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          }
        );
        if (!notifResponse.ok) throw new Error('Failed to fetch notifications');
        const notifData = await notifResponse.json();
        setNotifications(notifData.notifications || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load some data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, config]);

  const handleAthleteSelect = (athlete) => {
    navigate(`/athletes/${athlete.user_id}`);
  };

  const handleMarkNotificationRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${config.API_URL}/fans/${user.id}/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to update notification');
      
      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
      
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Discover Athletes Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Discover Athletes</h2>
        <SearchComponent 
          placeholder="Search for athletes to follow..."
          searchEndpoint="/athletes/search"
          onResultSelect={handleAthleteSelect}
          showFilters={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Favorite Athletes Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Your Favorite Athletes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteAthletes.length === 0 ? (
              <div className="col-span-2 bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">
                  You haven't added any favorite athletes yet.
                  Use the search above to discover athletes!
                </p>
              </div>
            ) : (
              favoriteAthletes.map(athlete => (
                <div 
                  key={athlete.id} 
                  className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/athletes/${athlete.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    {athlete.profile_picture ? (
                      <img 
                        src={athlete.profile_picture} 
                        alt={athlete.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl text-gray-500">
                          {athlete.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{athlete.name}</h3>
                      <p className="text-sm text-gray-600">{athlete.sport}</p>
                      {athlete.recent_activity && (
                        <p className="text-sm text-gray-500 mt-1">
                          Recent: {athlete.recent_activity}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notifications Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Notifications</h2>
          <div className="bg-white rounded-lg shadow divide-y">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div 
                  key={index}
                  className={`p-4 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkNotificationRead(notification.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FanUserPage;