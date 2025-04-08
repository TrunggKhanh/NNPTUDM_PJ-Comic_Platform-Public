import { useState, useEffect } from "react";

const SearchBar = () => {
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // Trạng thái đang tìm kiếm

  const toggleSearch = () => {
    setIsActive((current) => !current);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
    setIsActive(false);
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setIsSearching(true); // Bắt đầu tìm kiếm
      try {
        const response = await fetch(
          `/api/botruyen/search?query=${encodeURIComponent(searchTerm)}`
        );
        const data = await response.json();
        console.log("Results: ", data); // Kiểm tra dữ liệu từ API
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsSearching(false); // Kết thúc tìm kiếm
      }
    } else {
      setResults([]);
    }
  };

  const onChangeHandler = (e) => {
    setSearchTerm(e.target.value);
  };

  // Thêm debounce để giảm số lần gọi API
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchTerm) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 300); // Đợi 300ms sau khi người dùng ngừng gõ

    return () => clearTimeout(debounceTimeout); // Hủy timeout nếu người dùng tiếp tục gõ
  }, [searchTerm]);

  return (
    <>
      {/* Thanh tìm kiếm */}
      <div className={`search ${isActive ? "active" : ""}`}>
        <div className="icon" onClick={toggleSearch}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        <div className="input">
          <input
            type="text"
            placeholder="Tìm Kiếm ..."
            value={searchTerm}
            onChange={onChangeHandler}
            className="searchInput"
          />
        </div>
        <span className="clear" onClick={clearSearch}>
          <i className="ri-close-large-line"></i>
        </span>
      </div>

      {/* Kết quả tìm kiếm */}
      {isActive && (
        <div className="results" id="search-results">
          {/* Hiển thị trạng thái đang tìm kiếm */}
          {isSearching && (
            <div className="loading-indicator">Đang tìm kiếm...</div>
          )}

          {/* Hiển thị danh sách kết quả */}
          {!isSearching && results.length > 0 && (
            <ul id="results">
              {results.map((result) => (
                <li key={result.id}>
                  <a href={`/comic/${result.id}`} className="item-search">
                    <img
                      src={`http://localhost:5000${result.img}`}
                      alt={result.tenBo}
                      style={{
                        width: "40px",
                        height: "60px",
                        borderRadius: "2px",
                        marginRight: "10px",
                      }}
                    />
                    <div>
                      <h4>{result.tenBo}</h4>
                      <span>{result.view} Views</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* Hiển thị thông báo không tìm thấy */}
          {!isSearching && results.length === 0 && searchTerm && (
            <div className="no-results">Không tìm thấy kết quả</div>
          )}
        </div>
      )}
    </>
  );
};

export default SearchBar;
