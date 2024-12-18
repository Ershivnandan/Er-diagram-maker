import "./App.css";
import Navbar from "./components/Navbar";
import AllRoutes from "./Routes/AllRoutes";

function App() {
  return (
    <div className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
      <Navbar />
      <AllRoutes />
    </div>
  );
}

export default App;
