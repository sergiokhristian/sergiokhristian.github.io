import { useState } from 'react';
import { TbTrain } from 'react-icons/tb';
import styles from './TripPlanner.module.css';
import subwayData from '../data/subwayData.js';
import connections from '../data/connections.js';
import routes from '../data/routes.js';

function TripPlanner({ onBack }) {
  const [step, setStep] = useState('selectFromLine');
  const [selectedFromLine, setSelectedFromLine] = useState(null);
  const [selectedToLine, setSelectedToLine] = useState(null);
  const [expandedBoroughs, setExpandedBoroughs] = useState({});


  const renderLineGrid = (onSelect, selectedLine = null) => (
    <div className={styles.lineGrid}>
      {Object.keys(subwayData).map(line => (
        <button
          key={line}
          className={`${styles.lineBadge} ${selectedLine === line ? styles.selected : ''}`}
          style={{ backgroundColor: subwayData[line].color }}
          onClick={() => onSelect(line)}
        >
          {line}
        </button>
      ))}
    </div>
  );

  const connection = connections[`${selectedFromLine}|${selectedToLine}`];

  const route = routes.find(r => r.from === selectedFromLine && r.to === selectedToLine);

  return (
    <main className={styles.page}>
      <div className={styles.step}>
        <h1>Trip Planner</h1>

        {step === 'selectFromLine' && (
          <>
            <h2>Select Departure Line</h2>
            {renderLineGrid(line => {
              setSelectedFromLine(line);
              setStep('selectToLine');
            }, selectedFromLine)}
          </>
        )}

        {step === 'selectToLine' && (
          <>
            <div className={styles.stickyHeader}>
              <h3>From: {selectedFromLine}</h3>
            </div>
            <h2>Select Destination Line</h2>
            {renderLineGrid(line => {
              setSelectedToLine(line);
              setStep('showConnection');
            }, selectedToLine)}
          </>
        )}

        {step === 'showConnection' && selectedFromLine === selectedToLine && (
          <div className={styles.connectionPanel}>
            <div className={styles.trainIcons}>
              <TbTrain className={styles.trainIcon} />
            </div>
            <div className={styles.boardHere}>Board here</div>
            <div className={styles.transferTip}>
              No transfer needed. Stay on the {selectedFromLine} line.
            </div>
          </div>
        )}

        {step === 'showConnection' && selectedFromLine !== selectedToLine && connection && (
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
            {route && (
              <div style={{ marginTop: '1rem' }}>
                <p>{route.message}</p>
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <TbTrain
                      key={num}
                      className={styles.trainIcon}
                      style={{
                        color: num === route.cart ? 'red' : 'black',
                        fontSize: '24px'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default TripPlanner;
