import { useState } from "react";
import "./App.css";

import React from "react";
//HOST=127.0.0.1 PORT=5000 cors-proxy-server npx cors-proxy-server

export const App = () => {
  const [sodukuGrid, setsodukuGrid] = useState<number[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  interface sodukuData {
    puzzle: string;
    solution: string;
    status: string;
    message: string;
  }

  const [sodukuState, setsodukuState] = useState<sodukuData>({
    puzzle: "",
    solution: "",
    status: "",
    message: "",
  });
  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e);
    let newGrid = [...sodukuGrid].toString();
    newGrid = newGrid.replace(/,/g, "");
    newGrid = newGrid.replace(/0/g, ".");
    console.log(newGrid);
    const response = await fetch(
      "http://127.0.0.1:9000/http://127.0.0.1:5000",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sudoku: [newGrid],
        }),
      }
    );
    const data = await response.json();
    console.log(data.data[0]);
    setsodukuState(data.data[0]);
    const solution = data.data[0].solution;
    const solutionGrid = new Array(9).fill("").map(() => new Array(9).fill(0));
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
        solutionGrid[rowIndex][cellIndex] = parseInt(
          solution.charAt(rowIndex * 9 + cellIndex)
        );
      }
    }
    setsodukuGrid(solutionGrid);
  };

  const handleSetsodukuGrid = async (
    e: string,
    rowIndex: number,
    cellIndex: number
  ) => {
    const newGrid = [...sodukuGrid];
    newGrid[rowIndex][cellIndex] = parseInt(e);
    setsodukuGrid(newGrid);
  };

  function thereIsError() {
    return (
      <div>
        <h3>The Soduku you entered is : {sodukuState?.status}</h3>
        <h3>And the Errors Are : {sodukuState?.message}</h3>
      </div>
    );
  }

  function thereIsNoError() {
    return <h3>The Soduku you entered is : {sodukuState?.status}</h3>;
  }

  return (
    <div className="App">
      <h1>Soduku Grid</h1>
      <form onSubmit={handleFinish}>
        <div className="soduku-grid">
          {sodukuGrid?.map((row, rowIndex) => (
            <div className="soduku-row" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <div className="soduku-cell" key={cellIndex}>
                  <input
                    className="soduku-input"
                    type="number"
                    onChange={(e) =>
                      handleSetsodukuGrid(e.target.value, rowIndex, cellIndex)
                    }
                    value={sodukuGrid[rowIndex][cellIndex]}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <button type="submit">Solve</button>
      </form>
      <div>
        <h1>Result</h1>
        show soduku state here
        {sodukuState?.status === "error" ? thereIsError() : thereIsNoError()}
      </div>
    </div>
  );
};

export default App;
