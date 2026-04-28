import { TbTrain } from 'react-icons/tb';
import styles from './TripPlanner.module.css'; // reusing styles
import routes from '../data/routes.js';

function Routes({ onBack }) {
  return (
    <main className={styles.page}>
      <div className={styles.step}>
        <h1>Routes</h1>
        <button onClick={onBack} style={{ marginBottom: '1rem' }}>Back to Trip Planner</button>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>From</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>To</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Direction</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Cart</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Message</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Carts</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{route.from}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{route.to}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{route.direction}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{route.cart}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{route.message}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Routes;