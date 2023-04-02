import React from "react";
import { Chart, IGraphData } from "./chart/chart";

const graphs: IGraphData[] = [
  {
    chart: {
      type: "line",
      color: "#ff0000",
    },
    name: "graph1",
    points: Array(100)
      .fill([0, 0])
      .map((item, index) => [index, index * 6]),
    grids: {
      rowsCount: 3,
      enabled: true,
    },
  },
  {
    chart: {
      type: "line",
      color: "rgba(174,7,192)",
    },
    name: "graph3",
    points: Array(100)
      .fill([0, 0])
      .map((item, index) => [index, index]),
    grids: {
      rowsCount: 3,
      enabled: true,
    },
  },
];

const options = {
  height: 400,
  graphs,
};

const graphs2: IGraphData[] = [
  {
    chart: {
      type: "bar",
    },
    name: "asd",
    points: Array(20)
      .fill([0, 0])
      .map((item, index) => [index, index * 4]),
  },
];

const options2 = {
  height: 450,
  graphs: graphs2,
};

function App() {
  return (
    <div className="App">
      <div style={{ display: "flex", flexDirection: "column", gap: 100 }}>
        <Chart options={options} />
        <Chart options={options2} />
      </div>
    </div>
  );
}

export default App;
