import React, { useEffect, useState } from 'react';
import rangschikkingService from '../service/rangschikkingService';
import Rangschikking from '../components/carrousel/rangschikking';
import { Rangschikking as RangschikkingType, VolleyAdminKlassement } from '../utils/types';

const RangschikkingTestPage: React.FC = () => {
  const [rangschikkingData, setRangschikkingData] = useState<RangschikkingType[]>([]);
  const [volleyAdminData, setVolleyAdminData] = useState<VolleyAdminKlassement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [volleyAdminLoading, setVolleyAdminLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [volleyAdminError, setVolleyAdminError] = useState<string | null>(null);
  const [testReeks, setTestReeks] = useState<string>('VDP2-B'); // Default test reeks
  const [volleyAdminReeks, setVolleyAdminReeks] = useState<string>('LHP1'); // Default VolleyAdmin reeks
  const [stamnummer, setStamnummer] = useState<string>('L-0759'); // Default stamnummer

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

  const fetchVolleyAdminRangschikking = async (reeks: string, stamnummer: string) => {
    setVolleyAdminLoading(true);
    setVolleyAdminError(null);
    try {
      const data = await rangschikkingService.getRangschikkingFromVolleyAdmin(reeks, stamnummer);
      setVolleyAdminData(data);
    } catch (error) {
      console.error('Error fetching VolleyAdmin rangschikking:', error);
      setVolleyAdminError('Error fetching VolleyAdmin ranking data: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setVolleyAdminLoading(false);
    }
  };

  useEffect(() => {
    fetchRangschikking(testReeks);
  }, [testReeks]);

  useEffect(() => {
    fetchVolleyAdminRangschikking(volleyAdminReeks, stamnummer);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Rangschikking Test</h1>
      
      {/* Original API Test Section */}
      <section className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Original API Test</h2>
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

        {!loading && !error && rangschikkingData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">
              Ranking for {testReeks} ({rangschikkingData.length} teams)
            </h3>
            <Rangschikking rankschikking={rangschikkingData} />
          </div>
        )}
      </section>

      {/* VolleyAdmin API Test Section */}
      <section className="mb-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">VolleyAdmin API Test</h2>
        <div className="mb-4 space-y-4">
          <div>
            <label htmlFor="stamnummer" className="block text-sm font-medium text-gray-700 mb-2">
              Stamnummer:
            </label>
            <input
              type="text"
              id="stamnummer"
              value={stamnummer}
              onChange={(e) => setStamnummer(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-64"
              placeholder="Enter stamnummer (e.g., L-0759)"
            />
          </div>
          <div>
            <label htmlFor="volleyAdminReeks" className="block text-sm font-medium text-gray-700 mb-2">
              Reeks:
            </label>
            <input
              type="text"
              id="volleyAdminReeks"
              value={volleyAdminReeks}
              onChange={(e) => setVolleyAdminReeks(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-64"
              placeholder="Enter reeks code (e.g., LHP1)"
            />
          </div>
          <button
            onClick={() => fetchVolleyAdminRangschikking(volleyAdminReeks, stamnummer)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Fetch VolleyAdmin Ranking
          </button>
        </div>

        {volleyAdminLoading && (
          <div className="text-blue-600">
            Loading VolleyAdmin ranking for {volleyAdminReeks}...
          </div>
        )}

        {volleyAdminError && (
          <div className="text-red-600 bg-red-50 p-4 rounded-md mb-4">
            Error: {volleyAdminError}
          </div>
        )}

        {!volleyAdminLoading && !volleyAdminError && volleyAdminData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">
              VolleyAdmin Ranking for {volleyAdminReeks} ({volleyAdminData.rangschikking.length} teams)
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Games</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Won 3-0/3-1</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Won 3-2</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lost 2-3</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lost 0-3/1-3</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sets +/-</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {volleyAdminData.rangschikking.map((team, index) => (
                    <tr key={team.ploegid} className={team.ploegnaam.includes('Ham') ? 'bg-yellow-50' : ''}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{team.volgorde}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{team.ploegnaam}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{team.aantalGespeeldeWedstrijden}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{team.aantalGewonnen30_31}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{team.aantalGewonnen32}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{team.aantalVerloren32}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{team.aantalVerloren30_31}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{team.aantalGewonnenSets}/{team.aantalVerlorenSets}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-gray-900">{team.puntentotaal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <div className="mt-8 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Common test reeks codes:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-1">Original API:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>VDP2-B (Dames A)</li>
              <li>VDP4-B (Dames B)</li>
              <li>VJU19N2R1 (U19J)</li>
              <li>VMU17N1R1-A (U17MB)</li>
              <li>VMU15N2R1-A (U15M)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-1">VolleyAdmin API:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>LHP1 (Ham A - Herenhoofdreeks)</li>
              <li>LDM1 (Ham A - Damenhoofdreeks)</li>
              <li>LP1 (Provincial leagues)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RangschikkingTestPage;
