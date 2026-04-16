import { useState } from "react";

const BreedSelector = ({ setBreed, currentBreed }) => {
  const [inputValue, setInputValue] = useState("");
  const suggestions = [
    "akita",
    "beagle",
    "boxer",
    "chihuahua",
    "dalmatian",
    "husky",
    "labrador",
    "poodle",
    "pug",
    "retriever",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      setBreed(inputValue.toLowerCase().trim());
      setInputValue("");
    }
  };

  return (
    <>
      <div className="w-100">
        <form onSubmit={handleSearch}>
          <div className="input-group shadow-sm rounded-pill overflow-hidden border">
            <input
              type="text"
              className="form-control border-0 py-2 px-3"
              placeholder="Cerca razza"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                fontSize: "14px",
                color: "#212529",
              }}
              list="dog-breeds"
            />
            <button className="btn btn-primary px-3" type="submit">
              Cerca
            </button>
          </div>

          {/* lista suggerimenti */}
          <datalist id="dog-breeds">
            {suggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>

          {/* feedback visivo della ricerca attuale */}
          <div className="mt-2 ps-1">
            <span
              className="text-muted"
              style={{
                fontSize: "11px",
              }}
            >
              Risultati per:
              <b className="text-primary text-capitalize ms-1">
                {currentBreed}
              </b>
            </span>
          </div>
        </form>
      </div>
    </>
  );
};
export default BreedSelector;
