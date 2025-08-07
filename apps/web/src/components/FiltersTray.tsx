import React, { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import type { StatsQuery } from '@worldfeel/shared';

interface FiltersTrayProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: StatsQuery) => void;
  currentFilters: StatsQuery;
}

export function FiltersTray({ isOpen, onClose, onFiltersChange, currentFilters }: FiltersTrayProps) {
  const [selectedCountry, setSelectedCountry] = useState(currentFilters.country || '');
  const [selectedRegion, setSelectedRegion] = useState(currentFilters.region || '');
  const [selectedCity, setSelectedCity] = useState(currentFilters.city || '');

  const countries = Country.getAllCountries();
  const states = selectedCountry ? State.getStatesOfCountry(
    countries.find(c => c.name === selectedCountry)?.isoCode || ''
  ) : [];
  const cities = selectedRegion && selectedCountry ? City.getCitiesOfState(
    countries.find(c => c.name === selectedCountry)?.isoCode || '',
    states.find(s => s.name === selectedRegion)?.isoCode || ''
  ) : [];

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedRegion(''); // Reset dependent filters
    setSelectedCity('');
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedCity(''); // Reset dependent filters
  };

  const handleApplyFilters = () => {
    const filters: StatsQuery = {};
    if (selectedCountry) filters.country = selectedCountry;
    if (selectedRegion) filters.region = selectedRegion;
    if (selectedCity) filters.city = selectedCity;

    onFiltersChange(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setSelectedCountry('');
    setSelectedRegion('');
    setSelectedCity('');
    onFiltersChange({});
    onClose();
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Tray */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-4">
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Filter by Location</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100/50 rounded-full transition-colors"
              aria-label="Close filters"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Country selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-3 py-2 glass-input text-sm focus-visible-ring"
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.name}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State/Region selector */}
            {selectedCountry && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="w-full px-3 py-2 glass-input text-sm focus-visible-ring"
                >
                  <option value="">All Regions</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* City selector */}
            {selectedRegion && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 glass-input text-sm focus-visible-ring"
                >
                  <option value="">All Cities</option>
                  {cities.slice(0, 100).map((city) => ( // Limit to prevent performance issues
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleClearFilters}
              className="flex-1 py-2 px-4 text-sm glass-button text-gray-600 focus-visible-ring"
            >
              Clear All
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 py-2 px-4 text-sm glass-button text-blue-600 font-medium focus-visible-ring"
            >
              Apply Filters
            </button>
          </div>

          {/* Current filters display */}
          {(selectedCountry || selectedRegion || selectedCity) && (
            <div className="text-xs text-gray-500 text-center">
              Filtering: {[selectedCity, selectedRegion, selectedCountry].filter(Boolean).join(' → ')}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
