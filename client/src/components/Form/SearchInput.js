import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container-fluid">
      <form
        className="d-flex flex-column flex-sm-row "
        role="search"
        onSubmit={handleSubmit}
      >
        <input
          className="form-control col-sm-2 col-md"
          type="search"
          placeholder="Search for color, name"
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <div className="d-flex  mx-1">
          <button
            className="btn btn-outline-primary mt-2 mt-sm-0"
            type="submit"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
