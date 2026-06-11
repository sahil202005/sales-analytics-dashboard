import { useMemo, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function DashboardPage() {
  const rawData =
    JSON.parse(localStorage.getItem("csvData")) || [];

  const mapping =
    JSON.parse(localStorage.getItem("columnMapping")) || {};

  const reverseMapping = {};

  Object.entries(mapping).forEach(([column, mapped]) => {
    reverseMapping[mapped] = column;
  });

  const dateColumn = reverseMapping["Date"];
  const revenueColumn = reverseMapping["Revenue"];
  const quantityColumn = reverseMapping["Quantity"];
  const productColumn = reverseMapping["Product"];
  const regionColumn = reverseMapping["Region"];
  const categoryColumn = reverseMapping["Category"];
  const discountColumn = reverseMapping["Discount"];
  const [selectedDate, setSelectedDate] =
    useState("All");

  const [selectedProduct, setSelectedProduct] =
    useState("All");

  const [selectedRegion, setSelectedRegion] =
    useState("All");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const dates = [
    "All",
    ...new Set(
      rawData
        .map(item => item[dateColumn])
        .filter(Boolean)
    )
  ];

  const filteredData = useMemo(() => {
  return rawData.filter((row) => {

    if (
      selectedDate !== "All" &&
      row[dateColumn] !== selectedDate
    )
      return false;

    if (
      selectedProduct !== "All" &&
      row[productColumn] !== selectedProduct
    )
      return false;
    if (
    selectedCategory !== "All" &&
    row[categoryColumn] !== selectedCategory
    )
        return false;
    if (
      selectedRegion !== "All" &&
      row[regionColumn] !== selectedRegion
    )
      return false;

    return true;
  });
}, [
  rawData,
  selectedDate,
  selectedProduct,
  selectedRegion,
  selectedCategory,
]);
  const totalRevenue = filteredData.reduce(
    (sum, row) =>
      sum + Number(row[revenueColumn] || 0),
    0
  );

  const totalQuantity = filteredData.reduce(
    (sum, row) =>
      sum + Number(row[quantityColumn] || 0),
    0
  );

  const totalDiscount = filteredData.reduce(
    (sum, row) =>
      sum + Number(row[discountColumn] || 0),
    0
  );

  const products = [
    "All",
    ...new Set(
      filteredData.map(
        (item) => item[productColumn]
      )
    ),
  ];

  const regions = [
    "All",
    ...new Set(
      filteredData.map(
        (item) => item[regionColumn]
      )
    ),
  ];

  const categories = [
    "All",
    ...new Set(
      filteredData.map(
        (item) => item[categoryColumn]
      )
    ),
  ];

  const revenueTrend = useMemo(() => {
    const grouped = {};

    filteredData.forEach((row) => {
      const date = row[dateColumn];

      if (!grouped[date]) {
        grouped[date] = 0;
      }

      grouped[date] += Number(
        row[revenueColumn] || 0
      );
    });
    
    return Object.entries(grouped).map(
      ([date, revenue]) => ({
        date,
        revenue,
      })
    );
  }, [
    filteredData,
    dateColumn,
    revenueColumn,
  ]);
    const topProducts = useMemo(() => {
        const grouped = {};

        filteredData.forEach((row) => {
            const product = row[productColumn];

            if (!product) return;

            if (!grouped[product]) {
            grouped[product] = 0;
            }

            grouped[product] += Number(
            row[revenueColumn] || 0
            );
        });

        return Object.entries(grouped).map(
            ([product, revenue]) => ({
            product,
            revenue,
            })
        );
        }, [
        filteredData,
        productColumn,
        revenueColumn,
        ]);

        const revenueByRegion = useMemo(() => {
        const grouped = {};

        filteredData.forEach((row) => {
            const region = row[regionColumn];

            if (!region) return;

            if (!grouped[region]) {
            grouped[region] = 0;
            }

            grouped[region] += Number(
            row[revenueColumn] || 0
            );
        });

        return Object.entries(grouped).map(
            ([region, revenue]) => ({
            region,
            revenue,
            })
        );
        }, [
        filteredData,
        regionColumn,
        revenueColumn,
        ]);

        const quantityByProduct = useMemo(() => {
        const grouped = {};

        filteredData.forEach((row) => {
            const product = row[productColumn];

            if (!product) return;

            if (!grouped[product]) {
            grouped[product] = 0;
            }

            grouped[product] += Number(
            row[quantityColumn] || 0
            );
        });

        return Object.entries(grouped).map(
            ([product, quantity]) => ({
            product,
            quantity,
            })
        );
        }, [
        filteredData,
        productColumn,
        quantityColumn,
        ]);
                    const monthlyRevenue = useMemo(() => {
  const grouped = {};

  filteredData.forEach((row) => {
    const date = new Date(row[dateColumn]);

    if (isNaN(date)) return;

    const monthYear =
      date.toLocaleString("default", {
        month: "short",
      }) +
      " " +
      date.getFullYear();

    if (!grouped[monthYear]) {
      grouped[monthYear] = 0;
    }

    grouped[monthYear] += Number(
      row[revenueColumn] || 0
    );
  });

  return Object.entries(grouped).map(
    ([month, revenue]) => ({
      month,
      revenue,
    })
  );
}, [
  filteredData,
  dateColumn,
  revenueColumn,
]);
const predictedRevenue =
  Math.round(totalRevenue * 1.1);

const growthPercent = 10;

const bestProduct =
  topProducts.length > 0
    ? [...topProducts].sort(
        (a, b) =>
          b.revenue - a.revenue
      )[0].product
    : "N/A";

const predictionData = [
  {
    month: "Current",
    revenue: totalRevenue,
  },
  {
    month: "Next Month",
    revenue: predictedRevenue,
  },
];
const generateReport = () => {
  const report = `
SALES ANALYTICS REPORT
======================

Total Revenue: ₹${totalRevenue.toLocaleString()}
Total Orders: ${filteredData.length}
Total Quantity: ${totalQuantity}
Total Discount: ₹${totalDiscount.toLocaleString()}

MONTHLY REVENUE
---------------
${monthlyRevenue
  .map(
    (m) =>
      `${m.month}: ₹${m.revenue.toLocaleString()}`
  )
  .join("\n")}

TOP PRODUCTS
------------
${topProducts
  .map(
    (p) =>
      `${p.product}: ₹${p.revenue.toLocaleString()}`
  )
  .join("\n")}

REVENUE BY REGION
-----------------
${revenueByRegion
  .map(
    (r) =>
      `${r.region}: ₹${r.revenue.toLocaleString()}`
  )
  .join("\n")}
`;

            const blob = new Blob(
                [report],
                { type: "text/plain" }
            );

            const link =
                document.createElement("a");

            link.href =
                URL.createObjectURL(blob);

            link.download =
                "sales-report.txt";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Analytics Dashboard
        </h1>

        {/* FILTERS */}
        <h2 className="text-xl font-semibold mb-4">
         Filters
        </h2>
        <div className="grid grid-cols-4 gap-4 mb-8">

  <input
    type="date"
    value={selectedDate}
    onChange={(e) =>
      setSelectedDate(e.target.value)
    }
    className="bg-slate-900 p-3 rounded-xl w-full"
  />

  <select
    value={selectedProduct}
    onChange={(e) =>
      setSelectedProduct(e.target.value)
    }
    className="bg-slate-900 p-3 rounded-xl w-full"
  >
    <option value="All">Product</option>

    {products
      .filter((p) => p !== "All")
      .map((product) => (
        <option
          key={product}
          value={product}
        >
          {product}
        </option>
      ))}
  </select>

  <select
    value={selectedCategory}
    onChange={(e) =>
      setSelectedCategory(e.target.value)
    }
    className="bg-slate-900 p-3 rounded-xl w-full"
  >
    <option value="All">Category</option>

    {categories
      .filter((c) => c !== "All")
      .map((category) => (
        <option
          key={category}
          value={category}
        >
          {category}
        </option>
      ))}
  </select>

  <select
    value={selectedRegion}
    onChange={(e) =>
      setSelectedRegion(e.target.value)
    }
    className="bg-slate-900 p-3 rounded-xl w-full"
  >
    <option value="All">Region</option>

    {regions
      .filter((r) => r !== "All")
      .map((region) => (
        <option
          key={region}
          value={region}
        >
          {region}
        </option>
      ))}
  </select>

 </div>
 {/* REPORT BUTTON */}

<div className="flex justify-end mb-6">

  <button
    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-white"
    onClick={generateReport}
  >
    Generate Report
  </button>

</div>
        {/* KPI CARDS */}

        <div className="grid grid-cols-4 gap-4 mb-8">

          <div className="bg-slate-900 p-6 rounded-2xl">
            <p className="text-slate-400">
              Revenue
            </p>

            <h2 className="text-3xl font-bold">
              ₹{totalRevenue.toLocaleString()}
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl">
            <p className="text-slate-400">
              Orders
            </p>

            <h2 className="text-3xl font-bold">
              {filteredData.length}
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl">
            <p className="text-slate-400">
              Quantity
            </p>

            <h2 className="text-3xl font-bold">
              {totalQuantity}
            </h2>
          </div>

          
          <div className="bg-slate-900 p-6 rounded-2xl">
            <p className="text-slate-400">
              Discount
            </p>

            <h2 className="text-3xl font-bold">
              ₹{totalDiscount.toLocaleString()}
            </h2>
          </div>

        </div>

        {/* REVENUE TREND */}

        <div className="bg-slate-900 rounded-2xl p-6">

          <h2 className="text-xl font-semibold mb-4">
            Revenue Trend
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />

              <Line
  type="monotone"
  dataKey="revenue"
  stroke="#22c55e"
  strokeWidth={3}
/>
            </LineChart>
          </ResponsiveContainer>

        </div>
            <div className="bg-slate-900 p-6 rounded-2xl mt-8">

  <h2 className="text-xl font-semibold mb-4">
    Monthly Revenue By Year
  </h2>

  <ResponsiveContainer
    width="100%"
    height={350}
  >
    <LineChart data={monthlyRevenue}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />

      <Line
        type="monotone"
        dataKey="revenue"
      />
    </LineChart>
  </ResponsiveContainer>
</div>
        <div className="grid grid-cols-2 gap-6 mt-8">

        <div className="bg-slate-900 p-6 rounded-2xl">

            <h2 className="text-xl font-semibold mb-4">
            Top Products
            </h2>

            <ResponsiveContainer
            width="100%"
            height={300}
            >
            <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" />
                <YAxis />
                <Tooltip />

                <Bar
  dataKey="revenue"
  fill="#3b82f6"
/>
            </BarChart>
            </ResponsiveContainer>

        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">

            <h2 className="text-xl font-semibold mb-4">
            Revenue By Region
            </h2>

            <ResponsiveContainer
            width="100%"
            height={300}
            >
            <BarChart data={revenueByRegion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />

                <Bar
  dataKey="revenue"
  fill="#8b5cf6"
/>
            </BarChart>
            </ResponsiveContainer>

        </div>

        </div>

        <div className="bg-slate-900 p-6 rounded-2xl mt-8">

        <h2 className="text-xl font-semibold mb-4">
            Quantity By Product
        </h2>

        <ResponsiveContainer
            width="100%"
            height={300}
        >
            <BarChart data={quantityByProduct}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />

           <Bar
  dataKey="quantity"
  fill="#f59e0b"
/>
            </BarChart>
        </ResponsiveContainer>

        </div>
        {/* AI BUSINESS INSIGHTS */}

<h2 className="text-3xl font-bold mt-10 mb-6">
  AI Business Insights
</h2>

<div className="grid grid-cols-3 gap-6">

  <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl shadow-lg">
    <p className="text-sm opacity-80">
      Predicted Revenue
    </p>

    <h2 className="text-4xl font-bold mt-2">
      ₹{predictedRevenue.toLocaleString()}
    </h2>

    <p className="mt-2">
      Next month forecast
    </p>
  </div>

  <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 rounded-2xl shadow-lg">
    <p className="text-sm opacity-80">
      Growth Forecast
    </p>

    <h2 className="text-4xl font-bold mt-2">
      {growthPercent}%
    </h2>

    <p className="mt-2">
      Expected increase
    </p>
  </div>

  <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 rounded-2xl shadow-lg">
    <p className="text-sm opacity-80">
      Best Product
    </p>

    <h2 className="text-2xl font-bold mt-2">
      {bestProduct}
    </h2>

    <p className="mt-2">
      Highest revenue generator
    </p>
  </div>

</div>

<div className="bg-slate-900 p-6 rounded-2xl mt-8">

  <h2 className="text-2xl font-bold mb-4">
    AI Revenue Forecast
  </h2>

  <ResponsiveContainer
    width="100%"
    height={350}
  >
    <LineChart data={predictionData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />

<Line
  type="monotone"
  dataKey="revenue"
  stroke="#06b6d4"
  strokeWidth={4}
/>
      
    </LineChart>
  </ResponsiveContainer>

</div>


      </div>
    </div>
  );
}