import type { Rangschikking } from '../../utils/types';

type Props = {
  rankschikking: Rangschikking[];
};

const Rangschikking: React.FC<Props> = ({ rankschikking }) => {
  // Debug: log the received ranking data
  console.log('Rangschikking data:', rankschikking);
  
  const hasData = rankschikking && rankschikking.length > 0;
  
  // Filter to show only 8 teams closest to Ham when there are more than 8 teams
  const getDisplayedTeams = (teams: Rangschikking[]): Rangschikking[] => {
    if (teams.length <= 8) {
      return teams;
    }
    
    // Find Ham's position
    const hamIndex = teams.findIndex(team => team.isVCM);
    
    if (hamIndex === -1) {
      // If Ham is not found, show first 8 teams
      return teams.slice(0, 8);
    }
    
    // Calculate the range to show 8 teams centered around Ham
    const totalTeams = teams.length;
    let startIndex = Math.max(0, hamIndex - 4);
    let endIndex = Math.min(totalTeams, startIndex + 8);
    
    // Adjust start index if we're near the end
    if (endIndex - startIndex < 8 && startIndex > 0) {
      startIndex = Math.max(0, endIndex - 8);
    }
    
    return teams.slice(startIndex, endIndex);
  };
  
  const displayedTeams = hasData ? getDisplayedTeams(rankschikking) : [];
  
  return hasData ? (
    <div className="bg-white/90 rounded-lg shadow-lg p-6 backdrop-blur-sm">
      <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Klassement</h3>
      {rankschikking.length > 8 && (
        <p className="text-sm text-gray-600 text-center mb-4">
          Tonen {displayedTeams.length} van {rankschikking.length} teams (rond Ham)
        </p>
      )}
      <table className="w-full text-lg">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left p-3 font-semibold text-gray-700">Pos</th>
            <th className="text-left p-3 font-semibold text-gray-700">Team</th>
            <th className="text-right p-3 font-semibold text-gray-700">Punten</th>
          </tr>
        </thead>
        <tbody>
          {displayedTeams.map((team, index) => (
            <tr key={index} className={`border-b border-gray-200 hover:bg-gray-50 ${team.isVCM ? 'bg-yellow-200 font-bold' : ''}`}>
              <td className="p-3 text-gray-800">{team.volgorde}</td>
              <td className={`p-3 ${team.isVCM ? 'text-yellow-800 font-bold' : 'text-gray-800'}`}>
                {team.ploegnaam}
              </td>
              <td className="p-3 text-right text-gray-800 font-semibold">{team.puntentotaal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="bg-white/90 rounded-lg shadow-lg p-6 backdrop-blur-sm text-center">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Klassement</h3>
      <p className="text-lg text-gray-600">Geen rangschikking beschikbaar.</p>
    </div>
  );
};

export default Rangschikking;