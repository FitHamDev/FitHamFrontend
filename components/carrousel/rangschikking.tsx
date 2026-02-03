import type { Rangschikking } from '../../utils/types';

type Props = {
  rangschikking: Rangschikking[];
  thuisploeg?: string;
  bezoekersploeg?: string;
};

// Helper function to check if a team is playing in the current match
const isPlayingTeam = (teamName: string, home?: string, away?: string): boolean => {
  if (!home || !away) return false;
  const normalizedName = teamName.replaceAll(/[+-]/g, '').trim().toLowerCase();
  const normalizedHome = home.trim().toLowerCase();
  const normalizedAway = away.trim().toLowerCase();
  return normalizedName === normalizedHome || normalizedName === normalizedAway;
};

const RangschikkingTable: React.FC<Props> = ({ rangschikking, thuisploeg, bezoekersploeg }) => {  
  const hasData = rangschikking && rangschikking.length > 0;

  // Filter to show only 11 teams closest to Ham teams (or playing teams) when there are more than 11 teams
  const getDisplayedTeams = (teams: Rangschikking[]): Rangschikking[] => {
    const DISPLAY_COUNT = 11;
    if (teams.length <= DISPLAY_COUNT) return teams;

    // Prefer centering around Ham teams (isVCM)
    const hamIndices = teams
      .map((team, index) => ({ team, index }))
      .filter(({ team }) => team.isVCM)
      .map(({ index }) => index);

    // If no Ham teams in ranking, fallback to playing teams' positions
    const playingIndices = teams
      .map((team, index) => ({ team, index }))
      .filter(({ team }) => isPlayingTeam(team.ploegnaam, thuisploeg, bezoekersploeg))
      .map(({ index }) => index);

    const centerSource = hamIndices.length ? hamIndices : playingIndices;

    if (centerSource.length === 0) {
      return teams.slice(0, DISPLAY_COUNT);
    }

    const centerIndex = Math.floor(centerSource.reduce((sum, i) => sum + i, 0) / centerSource.length);
    const totalTeams = teams.length;
    let startIndex = Math.max(0, centerIndex - Math.floor(DISPLAY_COUNT / 2));
    let endIndex = Math.min(totalTeams, startIndex + DISPLAY_COUNT);

    if (endIndex - startIndex < DISPLAY_COUNT && startIndex > 0) {
      startIndex = Math.max(0, endIndex - DISPLAY_COUNT);
    }

    return teams.slice(startIndex, endIndex);
  };
  
  const displayedTeams = hasData ? getDisplayedTeams(rangschikking) : [];
  
  return hasData ? (
    <div className="w-full">
      <div className="space-y-3">
        {displayedTeams.map((team) => {
          const isHighlighted = team.isVCM;
          
          return (
            <div 
              key={team.volgorde} 
              className={`transition-none duration-0 flex items-center justify-between py-3 px-6 rounded-lg shadow-md text-blue-900 font-bold ${
                isHighlighted ? 'bg-yellow-400 scale-105 z-10' : 'bg-white/90'
              }`}
            >
              <div className="flex items-center space-x-6 flex-1 min-w-0">
                <span className="text-2xl font-black w-12 text-center flex-shrink-0">
                  {team.volgorde}
                </span>
                <span className="text-3xl truncate">
                  {team.ploegnaam}
                </span>
              </div>
              <span className="text-4xl font-black ml-4 flex-shrink-0">
                {team.puntentotaal}
              </span>
            </div>
          );
        })}
      </div>
      {rangschikking.length > 10 && (
        <p className="text-xl text-white font-bold drop-shadow-md text-center mt-6">
          ... {displayedTeams.length} van {rangschikking.length} teams getoond ...
        </p>
      )}
    </div>
  ) : (
    <div className="p-4 text-center">
      <p className="text-blue-900/60">Geen rangschikking beschikbaar.</p>
    </div>
  );
};

export default RangschikkingTable;