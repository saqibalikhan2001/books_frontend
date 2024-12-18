import React, { useEffect } from "react";
import debounce from "lodash/debounce";

// Function to remove emojis from a string
const removeEmojis = (value) => {
  return value.replace(/[^\x00-\x7F]/g, "");
};

const DebouncedInput = ({ onSearch, inputValue, setInputValue, setPage, fetchinitialData }) => {
  // Create a debounced function
  const debouncedSearch = debounce((value) => {
    const cleanedValue = removeEmojis(value);
    onSearch(cleanedValue);
  }, 300); // Adjust the delay as needed

  useEffect(() => {
    // Call the debounced function whenever inputValue changes
    if (inputValue) {
      debouncedSearch(inputValue);
    }

    // Clean up the debounce effect on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [inputValue]);

  const handleChange = (e) => {
    const value = removeEmojis(e.target.value);
    setInputValue(value);
    if (!value) {
      setPage(1);
      fetchinitialData();
    }
  };

  return (
    <input
      type="text"
      placeholder="search products"
      className="search_box_input search_box"
      value={inputValue}
      onChange={handleChange}
    />
  );
};

export default DebouncedInput;
