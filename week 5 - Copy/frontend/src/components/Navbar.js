import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/travel-logs">Travel Logs</Link> |{' '}
      <Link to="/journey-plans">Journey Plans</Link>
    </nav>
  );
}

export default Navbar;