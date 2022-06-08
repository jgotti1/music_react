import { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Gallery from "./components/Gallery";
import SearchBar from "./components/SearchBar";
import AlbumView from "./components/AlbumView";
import ArtistView from "./components/ArtistView";
import { SearchContext } from "./context/SearchContext";

function App() {
  let [searchTerm, setSearchTerm] = useState("");
  let [data, setData] = useState([]);
  let [message, setMessage] = useState("Search for Music!");
  let searchInput= useRef("")

  const API_URL = `https://itunes.apple.com/search?term=`;

  useEffect(() => {
    if (searchTerm) {
      document.title = `${searchTerm} Music`;
      const fetchData = async () => {
        const response = await fetch(API_URL + searchTerm);
        const resData = await response.json();
        if (resData.results.length > 0) {
          setData(resData.results);
        } else {
          setMessage("Not Found");
        }
      };
      fetchData();
    }
  }, [searchTerm, API_URL]);

  const handleSearch = (e, term) => {
    e.preventDefault();
    setSearchTerm(term);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SearchContext.Provider
                  value={{
                    term: searchInput,
                    handleSearch: handleSearch,
                  }}
                >
                  <SearchBar />
                  <Gallery data={data} />
                </SearchContext.Provider>
              </>
            }
          >
            {message}
          </Route>
          <Route
            path="/album/:id"
            element={<AlbumView term={searchTerm} />}
          ></Route>
          <Route
            path="/artist/:id"
            element={<ArtistView term={searchTerm} />}
          ></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
