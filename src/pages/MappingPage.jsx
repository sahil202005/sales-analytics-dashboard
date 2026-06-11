import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mappingOptions = [
  "Date",
  "Revenue",
  "Quantity",
  "Product",
  "Region",
  "Category",
  "Customer",
  "Discount",
  "Ignore",
];

export default function MappingPage() {
  const navigate = useNavigate();

  const columns =
    JSON.parse(localStorage.getItem("csvColumns")) || [];

  const [mapping, setMapping] = useState({});

  const handleSelect = (column, value) => {
    setMapping({
      ...mapping,
      [column]: value,
    });
  };

  const validateMapping = () => {
    const values = Object.values(mapping);

    if (!values.includes("Date")) {
      alert("Date field is required");
      return;
    }

    if (!values.includes("Revenue")) {
      alert("Revenue field is required");
      return;
    }

    localStorage.setItem(
      "columnMapping",
      JSON.stringify(mapping)
    );

    navigate("/validation");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Column Mapping
        </h1>

        <p className="text-slate-400 mb-8">
          Map dataset columns to analytics fields
        </p>

        <div className="grid grid-cols-4 gap-6">

          <div className="col-span-3">

            {columns.map((column) => (
              <div
                key={column}
                className="bg-slate-900 rounded-2xl p-6 mb-5"
              >
                <h2 className="text-lg font-semibold mb-4">
                  {column}
                </h2>

                <div className="flex flex-wrap gap-3">

                  {mappingOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() =>
                        handleSelect(column, option)
                      }
                      className={`px-4 py-2 rounded-lg border transition
                      ${
                        mapping[column] === option
                          ? "bg-blue-600 border-blue-600"
                          : "bg-slate-800 border-slate-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}

                </div>

              </div>
            ))}

          </div>

          <div className="bg-slate-900 rounded-2xl p-6 h-fit sticky top-5">

            <h2 className="text-xl font-semibold mb-4">
              Mapping Summary
            </h2>

            {columns.map((column) => (
              <div
                key={column}
                className="flex justify-between mb-3"
              >
                <span>{column}</span>

                <span className="text-blue-400">
                  {mapping[column] || "-"}
                </span>
              </div>
            ))}

            <button
              onClick={validateMapping}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold"
            >
              Continue →
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}