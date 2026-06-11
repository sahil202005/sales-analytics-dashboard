import { useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud } from "react-icons/fi";

export default function UploadPage() {
  const navigate = useNavigate();

  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState([]);
  const [previewData, setPreviewData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const data = results.data;

        setRows(data.length);
        setColumns(Object.keys(data[0]));
        setPreviewData(data.slice(0, 5));

        localStorage.setItem(
          "csvData",
          JSON.stringify(data)
        );

        localStorage.setItem(
          "csvColumns",
          JSON.stringify(Object.keys(data[0]))
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Sales Analytics Platform
        </h1>

        <p className="text-slate-400 mb-8">
          Upload your dataset to begin analysis
        </p>

        <label className="cursor-pointer block">

          <div className="border-2 border-dashed border-slate-700 rounded-3xl p-16 text-center bg-slate-900 hover:border-blue-500 transition">

            <FiUploadCloud
              size={70}
              className="mx-auto mb-4"
            />

            <h2 className="text-2xl font-semibold">
              Upload CSV File
            </h2>

            <p className="text-slate-400 mt-2">
              Drag & Drop or Click to Upload
            </p>

          </div>

          <input
            type="file"
            accept=".csv"
            hidden
            onChange={handleFileUpload}
          />

        </label>

        {fileName && (
          <>
            <div className="grid grid-cols-3 gap-4 mt-8">

              <div className="bg-slate-900 rounded-2xl p-6">
                <h3 className="text-slate-400">
                  File Name
                </h3>

                <p className="mt-2 font-medium">
                  {fileName}
                </p>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6">
                <h3 className="text-slate-400">
                  Rows
                </h3>

                <p className="text-2xl mt-2">
                  {rows}
                </p>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6">
                <h3 className="text-slate-400">
                  Columns
                </h3>

                <p className="text-2xl mt-2">
                  {columns.length}
                </p>
              </div>

            </div>

            <div className="bg-slate-900 rounded-2xl mt-8 p-6">

              <h2 className="text-xl font-semibold mb-4">
                Dataset Preview
              </h2>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col}
                          className="text-left p-3 border-b border-slate-700"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>

                  </thead>

                  <tbody>

                    {previewData.map((row, idx) => (
                      <tr key={idx}>

                        {columns.map((col) => (
                          <td
                            key={col}
                            className="p-3 border-b border-slate-800"
                          >
                            {row[col]}
                          </td>
                        ))}

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>

            <button
              onClick={() => navigate("/mapping")}
              className="mt-8 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold"
            >
              Continue →
            </button>

          </>
        )}

      </div>

    </div>
  );
}