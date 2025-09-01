import React, { useEffect, useState } from 'react';
import rangschikkingService from '../service/rangschikkingService';
import Rangschikking from '../components/carrousel/rangschikking';
import { Rangschikking as RangschikkingType } from '../utils/types';

const RangschikkingTestPage: React.FC = () => {
  const [rangschikkingData, setRangschikkingData] = useState<RangschikkingType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [testReeks, setTestReeks] = useState<string>('VDP2-B'); // Default test reeks

  const fetchRangschikking = async (reeks: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rangschikkingService.getRangschikkingByReeks(reeks);
      if (response.success) {
        setRangschikkingData(response.data || []);
      } else {
        setError('Failed to fetch ranking data');
      }
    } catch (error) {
      console.error('Error fetching rangschikking:', error);
      setError('Error fetching ranking data: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRangschikking(testReeks);
  }, [testReeks]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Rangschikking Test</h1>
      
      <div className="mb-4">
        <label htmlFor="reeks" className="block text-sm font-medium text-gray-700 mb-2">
          Test Reeks:
        </label>
        <input
          type="text"
          id="reeks"
          value={testReeks}
          onChange={(e) => setTestReeks(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-64"
          placeholder="Enter reeks code (e.g., VDP2-B)"
        />
        <button
          onClick={() => fetchRangschikking(testReeks)}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Fetch Ranking
        </button>
      </div>

      {loading && (
        <div className="text-blue-600">
          Loading ranking for {testReeks}...
        </div>
      )}

      {error && (
        <div className="text-red-600 bg-red-50 p-4 rounded-md mb-4">
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Ranking for {testReeks} ({rangschikkingData.length} teams)
          </h2>
          <Rangschikking rankschikking={rangschikkingData} />
        </div>
      )}

      <div className="mt-8 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Common test reeks codes:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>VDP2-B (Dames A)</li>
          <li>VDP4-B (Dames B)</li>
          <li>VJU19N2R1 (U19J)</li>
          <li>VMU17N1R1-A (U17MB)</li>
          <li>VMU15N2R1-A (U15M)</li>
        </ul>
      </div>
    </div>
  );
};

export default RangschikkingTestPage;
