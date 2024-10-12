// React import removed as it's not used in this file

const Home = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome Home</h1>
      <p style={styles.subtitle}>This is the home screen of your app</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#333',
  },
};

export default Home;
