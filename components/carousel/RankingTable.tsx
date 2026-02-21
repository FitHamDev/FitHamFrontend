import type { Rangschikking } from '../../utils/types';
import theme from '../../utils/themeConfig';
import { calculateEstimatedWins, isPlayingTeam } from './helpers/carouselHelpers';

type Props = {
  ranking: Rangschikking[];
  homeTeam?: string;
  awayTeam?: string;
  maxTeams?: number;
};

/**
 * Displays a windowed ranking table centered around key teams.
 */
const RankingTable: React.FC<Props> = ({ ranking, homeTeam, awayTeam, maxTeams }) => {
  const hasData = ranking && ranking.length > 0;
  const { colors: c, layout: l, text: t } = theme;
  const showWinsColumn = false;

  // Filter to show teams closest to Ham teams, limited by maxTeams (screen-height aware)
  const getDisplayedTeams = (teams: Rangschikking[]): Rangschikking[] => {
    const DISPLAY_COUNT = maxTeams ?? 11;
    if (teams.length <= DISPLAY_COUNT) return teams;

    // Prefer centering around Ham teams (isVCM)
    const hamIndices = teams
      .map((team, index) => ({ team, index }))
      .filter(({ team }) => team.isVCM)
      .map(({ index }) => index);

    // If no Ham teams in ranking, fallback to playing teams' positions
    const playingIndices = teams
      .map((team, index) => ({ team, index }))
      .filter(({ team }) => isPlayingTeam(team.ploegnaam, homeTeam, awayTeam))
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
  
  const displayedTeams = hasData ? getDisplayedTeams(ranking) : [];
  
  return hasData ? (
    <div className="w-full">
      {/* Table header */}
      <div
        className={`grid ${showWinsColumn ? 'grid-cols-12' : 'grid-cols-11'} gap-2 mb-2 ${l.tableRowPx} ${l.tableRowPy} ${l.tableRowMinH} ${l.tableRowRadius}`}
        style={{ backgroundColor: c.tableHeaderBg }}
      >
        <div className={`col-span-1 text-center font-black ${t.tableHeader}`} style={{ color: c.tableHeaderText }}>#</div>
        <div className={`col-span-8 text-left font-black ${t.tableHeader}`} style={{ color: c.tableHeaderText }}>PLOEGEN</div>
        {showWinsColumn && (
          <div className={`col-span-1 text-center font-black ${t.tableHeader}`} style={{ color: c.tableHeaderText }}>#W</div>
        )}
        <div className={`col-span-2 text-center font-black ${t.tableHeader}`} style={{ color: c.tableHeaderText }}>PTN</div>
      </div>
      {/* Table rows */}
      <div className={l.tableRowSpacing}>
        {displayedTeams.map((team) => {
          const isHighlighted = team.isVCM;
          const wins = calculateEstimatedWins(Number(team.puntentotaal));
          const textColor = isHighlighted ? c.tableHighlightText : c.tableRowText;
          
          return (
            <div 
              key={team.volgorde} 
              className={`grid ${showWinsColumn ? 'grid-cols-12' : 'grid-cols-11'} gap-2 ${l.tableRowPy} ${l.tableRowPx} ${l.tableRowMinH} ${l.tableRowRadius} shadow-md items-center transition-all duration-200`}
              style={isHighlighted
                ? { backgroundColor: c.tableHighlightBg, borderWidth: 2, borderColor: c.tableHighlightBorder }
                : { backgroundColor: c.tableRowBg }
              }
            >
              <span className={`col-span-1 text-center ${t.tableRowNumber} font-black`} style={{ color: textColor }}>
                {team.volgorde}
              </span>
              <span className={`col-span-8 whitespace-normal break-words ${t.tableRowName} font-black`} style={{ color: textColor }}>
                {team.ploegnaam}
              </span>
              {showWinsColumn && (
                <span className={`col-span-1 text-center ${t.tableRowNumber} font-black`} style={{ color: textColor }}>
                  {wins}
                </span>
              )}
              <span className={`col-span-2 text-center ${t.tableRowNumber} font-black`} style={{ color: textColor }}>
                {team.puntentotaal}
              </span>
            </div>
          );
        })}
      </div>
      {ranking.length > displayedTeams.length && (
        <p className={`${t.tableFooter} font-bold drop-shadow-md text-center mt-3`} style={{ color: c.tableFooterText }}>
          {displayedTeams.length} van {ranking.length} teams
        </p>
      )}
    </div>
  ) : (
    <div className="p-4 text-center">
      <p style={{ color: c.primary, opacity: 0.6 }}>Geen rangschikking beschikbaar.</p>
    </div>
  );
};

export default RankingTable;