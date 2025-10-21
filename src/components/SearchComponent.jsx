import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import { config } from '../utils/config.js';

const SearchComponent = ({ 
  placeholder = 'Search...', 
  className = '',
  showFilters = true,
  onResultSelect,
  searchEndpoint = '/api/search',
  debounceMs = 300
}) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filters, setFilters] = useState({
    type: 'all', // all, athletes, sponsors, deals
    sport: '',
    location: '',
    priceRange: 'all'
  });
  
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const debounceRef = useRef(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen || results.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : results.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length > 2) {
      debounceRef.current = setTimeout(() => {
        performSearch(query.trim());
      }, debounceMs);
    } else {
      setResults([]);
      setIsOpen(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, filters]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        type: filters.type,
        ...(filters.sport && { sport: filters.sport }),
        ...(filters.location && { location: filters.location }),
        ...(filters.priceRange !== 'all' && { priceRange: filters.priceRange })
      });

      const response = await fetch(`${config.apiUrl}${searchEndpoint}?${params}`, {
        headers: {
          'Authorization': user?.token ? `Bearer ${user.token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setIsOpen(true);
        setSelectedIndex(-1);
      } else {
        console.error('Search failed:', response.statusText);
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleResultClick = (result) => {
    if (onResultSelect) {
      onResultSelect(result);
    } else {
      // Default navigation based on result type
      switch (result.type) {
        case 'athlete':
          navigate(`/athletes/${result.id}`);
          break;
        case 'sponsor':
          navigate(`/sponsors/${result.id}`);
          break;
        case 'deal':
          navigate(`/deals/${result.id}`);
          break;
        default:
          console.log('Selected:', result);
      }
    }
    setIsOpen(false);
    setQuery('');
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'athlete': return '🏃‍♂️';
      case 'sponsor': return '🏢';
      case 'deal': return '🤝';
      case 'event': return '📅';
      default: return '🔍';
    }
  };

  const highlightQuery = (text, query) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          aria-label="Search"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
          aria-autocomplete="list"
        />
        
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-y-0 right-8 flex items-center">
            <LoadingSpinner size="small" />
          </div>
        )}
        
        {/* Clear Button */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 mt-1 z-50"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="athletes">Athletes</option>
                <option value="sponsors">Sponsors</option>
                <option value="deals">Deals</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Sport
              </label>
              <select
                value={filters.sport}
                onChange={(e) => handleFilterChange('sport', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Sports</option>
                <option value="football">Football</option>
                <option value="basketball">Basketball</option>
                <option value="baseball">Baseball</option>
                <option value="soccer">Soccer</option>
                <option value="tennis">Tennis</option>
                <option value="golf">Golf</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="City, State"
                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Ranges</option>
                <option value="0-1000">$0 - $1,000</option>
                <option value="1000-5000">$1,000 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000+">$10,000+</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search Results */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-40 max-h-96 overflow-y-auto"
            role="listbox"
          >
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleResultClick(result)}
                className={`
                  px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0
                  ${selectedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  transition-colors duration-150
                `}
                role="option"
                aria-selected={selectedIndex === index}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg" role="img" aria-hidden="true">
                    {getResultIcon(result.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {highlightQuery(result.title || result.name, query)}
                      </h4>
                      <span className="text-xs text-gray-500 ml-2 capitalize">
                        {result.type}
                      </span>
                    </div>
                    
                    {result.subtitle && (
                      <p className="text-sm text-gray-600 truncate">
                        {highlightQuery(result.subtitle, query)}
                      </p>
                    )}
                    
                    {result.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {highlightQuery(result.description, query)}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      {result.tags && result.tags.length > 0 && (
                        <div className="flex space-x-1">
                          {result.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {result.price && (
                        <span className="text-sm font-medium text-green-600">
                          ${result.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* View All Results */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-3 border-t border-gray-200 bg-gray-50"
            >
              <button
                onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
                className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium text-center"
              >
                View all results for "{query}"
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      {isOpen && !loading && query.length > 2 && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-40 p-4 text-center"
        >
          <div className="text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-sm">No results found for "{query}"</p>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your search terms or filters
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchComponent;