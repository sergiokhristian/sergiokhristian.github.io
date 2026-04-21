import styles from './Home.module.css'

function Home({ onPlay }) {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.card}>
          <h1 className={styles.title}>Subway Surfer</h1>
          <p className={styles.subtitle}>Welcome! Get ready to hit the tracks</p>
          <button className={styles.button} onClick={onPlay}>
            Play Now
          </button>
        </div>
      </section>
    </main>
  )
}

export default Home
