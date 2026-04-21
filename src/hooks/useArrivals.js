import { useState, useEffect } from 'react';
import stopIds from '../data/stopIds.js';
import subwayData from '../data/subwayData.js';

function useArrivals(fromLine, fromStation, toLine, toStation) {
  const [fromArrivals, setFromArrivals] = useState([]);
  const [toArrivals, setToArrivals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasStopData, setHasStopData] = useState(true);

  useEffect(() => {
    if (!fromLine || !fromStation || !toLine || !toStation) return;

    const fetchArrivals = async () => {
      setLoading(true);
      setError(null);

      try {
        // Determine direction for from
        let fromDirection = 'N'; // default
        if (fromLine === toLine && subwayData[fromLine].stations.Manhattan && subwayData[fromLine].stations.Brooklyn) {
          const fromStations = [...subwayData[fromLine].stations.Manhattan, ...subwayData[fromLine].stations.Brooklyn];
          const fromIndex = fromStations.findIndex(s => s.name === fromStation);
          const toIndex = fromStations.findIndex(s => s.name === toStation);
          if (fromIndex < toIndex) {
            fromDirection = 'N'; // uptown
          } else {
            fromDirection = 'S'; // downtown
          }
        }

        // Determine direction for to
        let toDirection = 'N';
        if (toLine === fromLine) {
          toDirection = fromDirection === 'N' ? 'S' : 'N'; // opposite
        } else {
          // For transfers, assume N
        }

        const fromStopId = stopIds[fromLine]?.[fromStation];
        const toStopId = stopIds[toLine]?.[toStation];

        if (!fromStopId || !toStopId) {
          setHasStopData(false);
          return;
        }

        setHasStopData(true);

        const [fromRes, toRes] = await Promise.all([
          fetch(`/api/arrivals?stopId=${fromStopId}${fromDirection}&line=${fromLine}`),
          fetch(`/api/arrivals?stopId=${toStopId}${toDirection}&line=${toLine}`)
        ]);

        if (!fromRes.ok || !toRes.ok) {
          throw new Error('Failed to fetch arrivals');
        }

        const fromData = await fromRes.json();
        const toData = await toRes.json();

        setFromArrivals(fromData.arrivals || []);
        setToArrivals(toData.arrivals || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArrivals();
  }, [fromLine, fromStation, toLine, toStation]);

  return { fromArrivals, toArrivals, loading, error, hasStopData };
}

export default useArrivals;