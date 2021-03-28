import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import MainPage from "./components/mainPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={MainPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
