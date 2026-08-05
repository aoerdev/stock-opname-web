import { Search, X } from "lucide-react";
import "./SearchInput.css";

function SearchInput({
  value,
  onChange,
  placeholder = "Cari...",
}) {
  return (
    <div className="search-input">

      <Search
        className="search-icon"
        size={18}
      />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {value && (
        <button
          className="clear-btn"
          onClick={() =>
            onChange({
              target: {
                value: "",
              },
            })
          }
        >
          <X size={16} />
        </button>
      )}

    </div>
  );
}

export default SearchInput;