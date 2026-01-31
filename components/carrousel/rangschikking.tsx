import type { Rangschikking } from '../../utils/types';

type Props = {
  rankschikking: Rangschikking[];
  thuisploeg?: string;
  bezoekersploeg?: string;
};

const RangschikkingTable: React.FC<Props> = ({ rankschikking, thuisploeg, bezoekersploeg }) => {  
  const hasData = rankschikking && rankschikking.length > 0;
  
  // Helper function to check if a team is a Ham team and playing in the current match
  const isPlayingHamTeam = (teamName: string): boolean => {
    if (!thuisploeg || !bezoekersploeg) return false;

  const isHamTeam = teamName.toLowerCase().includes('ham');

    if (!isHamTeam) return false;

  const normalizedName = teamName.replaceAll('+', '').replaceAll('-', '').trim().toLowerCase();
    const normalizedHome = thuisploeg.trim().toLowerCase();
    const normalizedAway = bezoekersploeg.trim().toLowerCase();
    return normalizedName === normalizedHome || normalizedName === normalizedAway;
  };

  // Helper to detect Ham teams anywhere in the ranking (used for centering)
  const isHamTeam = (teamName: string): boolean => {
    return teamName.toLowerCase().includes('ham');
  };
  
  // Helper function to check if any Ham team is playing (for centering the view)
  const isAnyPlayingTeam = (teamName: string): boolean => {
    if (!thuisploeg || !bezoekersploeg) return false;
  const normalizedName = teamName.replaceAll('+', '').replaceAll('-', '').trim().toLowerCase();
    const normalizedHome = thuisploeg.trim().toLowerCase();
    const normalizedAway = bezoekersploeg.trim().toLowerCase();
    return normalizedName === normalizedHome || normalizedName === normalizedAway;
  };
  
  // Filter to show only 12 teams closest to Ham teams (or playing teams) when there are more than 12 teams
  const getDisplayedTeams = (teams: Rangschikking[]): Rangschikking[] => {
    const DISPLAY_COUNT = 12;
    if (teams.length <= DISPLAY_COUNT) return teams;

    // Prefer centering around Ham teams if present in the ranking
    const hamIndices = teams
      .map((team, index) => ({ team, index }))
      .filter(({ team }) => isHamTeam(team.ploegnaam))
      .map(({ index }) => index);

    // If no Ham teams in ranking, fallback to playing teams' positions
    const playingTeamIndices = teams
      .map((team, index) => ({ team, index }))
      .filter(({ team }) => isAnyPlayingTeam(team.ploegnaam))
      .map(({ index }) => index);

    let centerSource = hamIndices.length ? hamIndices : playingTeamIndices;

    if (centerSource.length === 0) {
      // If no Ham or playing teams found, show first DISPLAY_COUNT teams
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
  
  const displayedTeams = hasData ? getDisplayedTeams(rankschikking) : [];
  
  return hasData ? (
    <div className="p-2">
      <div className="space-y-1">
        {displayedTeams.map((team) => (
          <div 
            key={team.volgorde} 
            className={`flex items-center justify-between py-2 px-3 rounded text-blue-900 font-bold ${
              isPlayingHamTeam(team.ploegnaam) || isHamTeam(team.ploegnaam) || team.isVCM
                ? 'bg-yellow-400' 
                : 'bg-white/80'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm w-6">
                {team.volgorde}
              </span>
              <span>
                {team.ploegnaam}
              </span>
            </div>
            <span className="font-black">
              {team.puntentotaal}
            </span>
          </div>
        ))}
      </div>
      {rankschikking.length > 12 && (
        <p className="text-xs text-blue-900/60 text-center mt-2">
          {displayedTeams.length} van {rankschikking.length} teams
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