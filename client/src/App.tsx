import { Switch, Route } from "wouter";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
    </Switch>
  );
}

export default App;