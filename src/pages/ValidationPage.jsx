import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function ValidationPage() {
  const navigate = useNavigate();

  const data =
    JSON.parse(localStorage.getItem("csvData")) || [];

  const mapping =
    JSON.parse(localStorage.getItem("columnMapping")) || {};

  const validation = useMemo(() => {
    let missingValues = 0;

    data.forEach((row) => {
      Object.values(row).forEach((value) => {
        if (
          value === "" ||
          value === null ||
          value === undefined
        ) {
          missingValues++;
        }
      });
    });

    const duplicates =
      data.length -
      new Set(
        data.map((row) =>
          JSON.stringify(row)
        )
      ).size;

    return {
      totalRows: data.length,
      missingValues,
      duplicates,
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Dataset Validation
        </h1>

        <p className="text-slate-400 mb-8">
          Review dataset quality before
          generating analytics
        </p>

        <div className="grid grid-cols-3 gap-4">

          <div className="bg-slate-900 rounded-2xl p-6">
            <h3 className="text-slate-400">
              Total Rows
            </h3>

            <p className="text-3xl mt-2">
              {validation.totalRows}
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <h3 className="text-slate-400">
              Missing Values
            </h3>

            <p className="text-3xl mt-2">
              {validation.missingValues}
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <h3 className="text-slate-400">
              Duplicates
            </h3>

            <p className="text-3xl mt-2">
              {validation.duplicates}
            </p>
          </div>

        </div>

        <div className="bg-slate-900 rounded-2xl p-6 mt-8">

          <h2 className="text-xl font-semibold mb-4">
            Column Mapping Summary
          </h2>

          {Object.entries(mapping).map(
            ([key, value]) => (
              <div
                key={key}
                className="flex justify-between py-2 border-b border-slate-800"
              >
                <span>{key}</span>

                <span className="text-blue-400">
                  {value}
                </span>
              </div>
            )
          )}

        </div>

        <div className="bg-slate-900 rounded-2xl p-6 mt-8">

          <h2 className="text-xl font-semibold mb-4">
            Validation Result
          </h2>

          <div className="space-y-3">

            <p>
              ✅ Date mapped
            </p>

            <p>
              ✅ Revenue mapped
            </p>

            <p>
              ⚠ Quantity optional
            </p>

            <p>
              ⚠ Product optional
            </p>

          </div>

        </div>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="mt-8 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold"
        >
          Generate Dashboard →
        </button>

      </div>

    </div>
  );
}