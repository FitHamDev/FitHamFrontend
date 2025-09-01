import type { Rangschikking } from '../../utils/types';

type Props = {
  rankschikking: Rangschikking[];
};

const Rangschikking: React.FC<Props> = ({ rankschikking }) => {
  // Debug: log the received ranking data
  console.log('Rangschikking data:', rankschikking);
  
  const hasData = rankschikking && rankschikking.length > 0;
  
  return hasData ? (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left p-2">Pos</th>
          <th className="text-left p-2">Team</th>
          <th className="text-right p-2">Punten</th>
        </tr>
      </thead>
      <tbody>
        {rankschikking.map((team, index) => (
          <tr key={index} className={`border-b ${team.isVCM ? 'bg-yellow-100 font-bold' : ''}`}>
            <td className="p-2">{team.volgorde}</td>
            <td className={`p-2 ${team.isVCM ? 'text-yellow-600' : ''}`}>
              {team.ploegnaam}
            </td>
            <td className="p-2 text-right">{team.puntentotaal}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div className="text-center p-4">
      <p>Geen rangschikking beschikbaar.</p>
    </div>
  );
};

export default Rangschikking;