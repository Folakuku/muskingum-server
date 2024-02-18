const regression = require("regression");

function calculateStorage(inflow, outflow, x, deltaTime) {
    let deltaS = []; // array for change in S
    let storage = [0]; // Initial storage is usually 0
    let weightedFlux = []; // array for weightFlux result

    // A loop to compute storage and weighted flux
    for (let i = 0; i < inflow.length; i++) {
        let IO = inflow[i] - outflow[i]; // inflow - outflow (I-O)
        IO = IO; // (I -O)
        let num;
        let avgIO = i === 0 ? IO : (IO + (inflow[i - 1] - outflow[i - 1])) / 2; // (Avg(I -O))
        deltaS[i] = avgIO * deltaTime; // Column 6 (∆S)
        num = Number(storage[i] + deltaS[i]).toFixed(4);
        storage.push(Number(num)); // Column 7 (S)
        weightedFlux[i] = Number(
            (x * inflow[i] + (1 - x) * outflow[i]).toFixed(4)
        ); // Column 8
    }
    storage.shift();
    return { storage, weightedFlux };
}

// Using regression to compute for K using a graph of storage against weightedFlux
function calculateK(storage, weightedFlux) {
    const inputData = storage.map((s, index) => [weightedFlux[index], s]);
    const result = regression.linear(inputData); // Calculate regression
    const k = result.equation[0]; // The slope of the line is K
    const intercept = result.equation[1]; // The intercept of the line
    return { k, intercept };
}

// Function to calculate muskingum coefficients
function calculateMuskingumCoefficients(k, x, t) {
    const denominator = 2 * k * (1 - x) + t;
    const C0 = (-2 * k * x + t) / denominator;
    const C1 = (2 * k * x + t) / denominator;
    const C2 = (2 * k * (1 - x) - t) / denominator;

    return { C0, C1, C2 };
}

// Function to calculate outflow
function calculateOutflow(inflow, C0, C1, C2) {
    let outflows = [inflow[0]]; // Initialize with the first outflow value
    let C0I2 = [0]; // Initialize with the first outflow value
    let C1I1 = [0]; // Initialize with the first outflow value
    let C2O1 = [0]; // Initialize with the first outflow value

    for (let i = 1; i < inflow.length; i++) {
        C0I2.push((C0 * inflow[i]).toFixed(4)); // Column 3: C0 * Current Inflow
        C1I1.push((C1 * inflow[i - 1]).toFixed(4)); // Column 4: C1 * Previous Inflow
        C2O1.push((C2 * outflows[i - 1]).toFixed(4)); // Column 5: C2 * Previous Outflow
        const calculatedOutflow =
            parseFloat(C0I2[i]) + parseFloat(C1I1[i]) + parseFloat(C2O1[i]); // Column 6: Calculated Outflow

        outflows.push(calculatedOutflow.toFixed(3));
    }
    return { outflows, C0I2, C1I1, C2O1 };
}

module.exports = {
    calculateMuskingumCoefficients,
    calculateK,
    calculateStorage,
    calculateOutflow,
};
