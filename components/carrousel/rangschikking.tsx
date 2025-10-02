import type { Rangschikking } from '../../utils/types';

type Props = {
  rankschikking: Rangschikking[];
  thuisploeg?: string;
  bezoekersploeg?: string;
};

const Rangschikking: React.FC<Props> = ({ rankschikking, thuisploeg, bezoekersploeg }) => {  
  const hasData = rankschikking && rankschikking.length > 0;
  
  // Helper function to check if a team is a Ham team and playing in the current match
  const isPlayingHamTeam = (teamName: string): boolean => {
    if (!thuisploeg || !bezoekersploeg) return false;
    
    // Check if team is a Ham team
    const isHamTeam = teamName.toLowerCase().includes('ham') || 
                      teamName.toLowerCase().includes('molenstede') ||
                      teamName.toLowerCase().includes('vrodis') ||
                      teamName.toLowerCase().includes('gisteren waren') ||
                      teamName.toLowerCase().includes('dovro');
    
    if (!isHamTeam) return false;
    
    // Check if this Ham team is playing in the current match
    const normalizedName = teamName.replace(/[+-]/g, '').trim().toLowerCase();
    const normalizedHome = thuisploeg.trim().toLowerCase();
    const normalizedAway = bezoekersploeg.trim().toLowerCase();
    return normalizedName === normalizedHome || normalizedName === normalizedAway;
  };
  
  // Helper function to check if any Ham team is playing (for centering the view)
  const isAnyPlayingTeam = (teamName: string): boolean => {
    if (!thuisploeg || !bezoekersploeg) return false;
    const normalizedName = teamName.replace(/[+-]/g, '').trim().toLowerCase();
    const normalizedHome = thuisploeg.trim().toLowerCase();
    const normalizedAway = bezoekersploeg.trim().toLowerCase();
    return normalizedName === normalizedHome || normalizedName === normalizedAway;
  };
  
  // Filter to show only 8 teams closest to the playing teams when there are more than 8 teams
  const getDisplayedTeams = (teams: Rangschikking[]): Rangschikking[] => {
    if (teams.length <= 8) {
      return teams;
    }
    
    // Find playing teams' positions
    const playingTeamIndices = teams
      .map((team, index) => ({ team, index }))
      .filter(({ team }) => isAnyPlayingTeam(team.ploegnaam))
      .map(({ index }) => index);
    
    if (playingTeamIndices.length === 0) {
      // If no playing teams found, show first 8 teams
      return teams.slice(0, 8);
    }
    
    // Find the center position based on playing teams
    const centerIndex = Math.floor(
      playingTeamIndices.reduce((sum, index) => sum + index, 0) / playingTeamIndices.length
    );
    
    // Calculate the range to show 8 teams centered around the playing teams
    const totalTeams = teams.length;
    let startIndex = Math.max(0, centerIndex - 4);
    let endIndex = Math.min(totalTeams, startIndex + 8);
    
    // Adjust start index if we're near the end
    if (endIndex - startIndex < 8 && startIndex > 0) {
      startIndex = Math.max(0, endIndex - 8);
    }
    
    return teams.slice(startIndex, endIndex);
  };
  
  const displayedTeams = hasData ? getDisplayedTeams(rankschikking) : [];
  
  return hasData ? (
    <div className="p-2">
      <div className="space-y-1">
        {displayedTeams.map((team, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between py-2 px-3 rounded text-blue-900 font-bold ${
              isPlayingHamTeam(team.ploegnaam)
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
      {rankschikking.length > 8 && (
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

export default Rangschikking;