import type { Rangschikking } from '../../utils/types';

type Props = {
  rankschikking: Rangschikking[];
};

const Rangschikking: React.FC<Props> = ({ rankschikking }) => {
  // Debug: log the received ranking data
  console.log('Rangschikking data:', rankschikking);
  // If no data, show a default row. If data, show all teams with punten 0 and volgorde as 'ex aequo'.
  const hasData = rankschikking && rankschikking.length > 0;
  return hasData ? (
    <table>
      <thead>
        <tr>
          <th>Positie</th>
          <th>Team</th>
          <th>Punten</th>
        </tr>
      </thead>
      <tbody>
        {rankschikking.map((team, index) => (
          <tr key={index}>
            <td></td>
            <td>{team.ploegnaam}</td>
            <td>0</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>Geen rangschikking beschikbaar.</p>
  );
};

export default Rangschikking;