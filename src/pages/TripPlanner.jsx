function TripPlanner({ onBack }) {
  return (
    <main style={{ minHeight: '100vh', padding: '2rem', background: '#061027', color: '#fff' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Trip Planner</h1>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          You’re on the right platform to plan your next ride. Build your route,
          check trains, and keep your journey moving.
        </p>
        <button
          onClick={onBack}
          style={{
            marginTop: '2rem',
            background: 'transparent',
            border: '1px solid #fff',
            color: '#fff',
            padding: '0.9rem 1.5rem',
            borderRadius: 999,
            cursor: 'pointer',
          }}
        >
          Back to Home
        </button>
      </div>
    </main>
  )
}

export default TripPlanner
