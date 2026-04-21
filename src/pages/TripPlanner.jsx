import { useState } from 'react';
import { TbTrain } from 'react-icons/tb';
import styles from './TripPlanner.module.css';
import subwayData from '../data/subwayData.js';
import connections from '../data/connections.js';
import useArrivals from '../hooks/useArrivals.js';

function TripPlanner({ onBack }) {
  const [step, setStep] = useState('selectFromLine');
  const [selectedFromLine, setSelectedFromLine] = useState(null);
  const [selectedFromStation, setSelectedFromStation] = useState(null);
  const [selectedToLine, setSelectedToLine] = useState(null);
  const [selectedToStation, setSelectedToStation] = useState(null);
  const [expandedBoroughs, setExpandedBoroughs] = useState({});

  const { fromArrivals, loading, error, hasStopData } = useArrivals(
    selectedFromLine,
    selectedFromStation,
    selectedToLine,
    selectedToStation
  );

  const toggleBorough = (borough) => {
    setExpandedBoroughs(prev => ({
      ...prev,
      [borough]: !prev[borough]
    }));
  };

  const renderLineGrid = (onSelect) => (
    <div className={styles.lineGrid}>
      {Object.keys(subwayData).map(line => (
        <button
          key={line}
          className={`${styles.lineBadge} ${selectedFromLine === line ? styles.selected : ''}`}
          style={{ backgroundColor: subwayData[line].color }}
          onClick={() => onSelect(line)}
        >
          {line}
        </button>
      ))}
    </div>
  );

  const renderStations = (line, onSelectStation, excludeStation = null) => {
    const stations = subwayData[line].stations;
    if (Array.isArray(stations)) {
      return (
        <div className={styles.stationList}>
          {stations.filter(s => s.name !== excludeStation).map(station => (
            <button
              key={station.name}
              className={styles.stationButton}
              onClick={() => onSelectStation(station.name)}
            >
              <div
                className={styles.stationDot}
                style={{ backgroundColor: subwayData[line].color }}
              />
              {station.name}
            </button>
          ))}
        </div>
      );
    } else {
      return Object.keys(stations).map(borough => (
        <div key={borough} className={styles.boroughSection}>
          <div className={styles.boroughHeader} onClick={() => toggleBorough(borough)}>
            <span className={styles.boroughToggle}>
              {expandedBoroughs[borough] ? '▾' : '▸'}
            </span>
            {borough}
          </div>
          {expandedBoroughs[borough] && (
            <div className={styles.stationList}>
              {stations[borough].filter(s => s.name !== excludeStation).map(station => (
                <button
                  key={station.name}
                  className={styles.stationButton}
                  onClick={() => onSelectStation(station.name)}
                >
                  <div
                    className={styles.stationDot}
                    style={{ backgroundColor: subwayData[line].color }}
                  />
                  {station.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ));
    }
  };

  const connection = connections[`${selectedFromLine}|${selectedToLine}`];

  return (
    <main className={styles.page}>
      <div className={styles.step}>
        <h1>Trip Planner</h1>
        <button onClick={onBack} style={{ marginBottom: '1rem' }}>Back to Home</button>

        {step === 'selectFromLine' && (
          <>
            <h2>Select Departure Line</h2>
            {renderLineGrid(line => {
              setSelectedFromLine(line);
              setStep('selectFromStation');
            })}
          </>
        )}

        {step === 'selectFromStation' && (
          <>
            <h2>Select Departure Station - {selectedFromLine} Line</h2>
            {renderStations(selectedFromLine, station => {
              setSelectedFromStation(station);
              setStep('selectToLine');
            })}
          </>
        )}

        {step === 'selectToLine' && (
          <>
            <div className={styles.stickyHeader}>
              <h3>From: {selectedFromStation} ({selectedFromLine})</h3>
            </div>
            <h2>Select Destination Line</h2>
            {renderLineGrid(line => {
              setSelectedToLine(line);
              setStep('selectToStation');
            })}
          </>
        )}

        {step === 'selectToStation' && (
          <>
            <div className={styles.stickyHeader}>
              <h3>From: {selectedFromStation} ({selectedFromLine})</h3>
            </div>
            <h2>Select Destination Station - {selectedToLine} Line</h2>
            {renderStations(selectedToLine, station => {
              setSelectedToStation(station);
              setStep('showConnection');
            }, selectedFromLine === selectedToLine ? selectedFromStation : null)}
          </>
        )}

        {step === 'showConnection' && connection && (
          <div className={styles.connectionPanel}>
            <div className={styles.trainIcons}>
              <TbTrain className={styles.trainIcon} />
              <TbTrain className={`${styles.trainIcon} ${styles.middle}`} />
              <TbTrain className={styles.trainIcon} />
            </div>
            <div className={styles.boardHere}>Board here</div>
            <div className={styles.transferTip}>
              Transfer at {connection.transferAt}: {connection.tip}
            </div>
          </div>
        )}

        {step === 'showConnection' && (
          <ArrivalsPanel
            arrivals={fromArrivals}
            loading={loading}
            error={error}
            hasStopData={hasStopData}
            title={`Next ${selectedFromLine} trains at ${selectedFromStation}`}
          />
        )}
      </div>
    </main>
  );
}

function ArrivalsPanel({ arrivals, loading, error, hasStopData, title }) {
  return (
    <div className={styles.arrivalsPanel}>
      <h3>{title}</h3>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!hasStopData && <p className={styles.noData}>Live arrivals not yet mapped for this line</p>}
      {hasStopData && !loading && !error && (
        <div className={styles.arrivalChips}>
          {arrivals.map((min, i) => (
            <span key={i} className={styles.chip}>
              {min === 0 ? 'Now' : `${min} min`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default TripPlanner;
