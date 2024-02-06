const regression = require("regression");

function calculateStorage(inflow, outflow, x, deltaTime) {
    let deltaS = []; // array for change in S
    let storage = [0]; // Initial storage is usually 0
    let weightedFlux = []; // array for weightFlux result

    // A loop to compute
    for (let i = 0; i < inflow.length; i++) {
        let IO = inflow[i] - outflow[i]; // inflow - outflow (I-O)
        IO = IO; // (I -O)
        let avgIO = i === 0 ? IO : (IO + (inflow[i - 1] - outflow[i - 1])) / 2; // (Avg(I -O))
        deltaS[i] = avgIO * deltaTime; // Column 6 (∆S)
        storage.push(storage[i] + deltaS[i]); // Column 7 (S)
        weightedFlux[i] = (x * inflow[i] + (1 - x) * outflow[i]).toFixed(4); // Column 8
    }
    storage.shift();
    return { storage, weightedFlux };
}

// Using regression to compute for K using a graph of storage against weightedFlux
function calculateK(storage, weightedFlux) {
    const inputData = storage.map((s, index) => [s, weightedFlux[index]]);
    const result = regression.linear(inputData);
    const k = result.equation[1]; // The slope of the line
    const intercept = result.equation[0]; // The intercept of the line
    return { k, intercept };
}

function determineK(storage, weightedFlux) {
    // Prepare data for regression analysis
    const regressionData = storage.map((s, index) => [s, weightedFlux[index]]);

    // Perform linear regression
    const result = regression.linear(regressionData);

    // The slope of the line is your K value
    const K = result.equation[0];

    // Returning the determined K value
    return K;
}

// Function to calculate muskingum coefficients
function calculateMuskingumCoefficients(k, x, t) {
    const denominator = 2 * k * (1 - x) + t;
    const C0 = (-2 * k * x + t) / denominator;
    const C1 = (2 * k * x + t) / denominator;
    const C2 = (2 * k * (1 - x) - t) / denominator;

    return { C0, C1, C2 };
}

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

// const c = calculateC(2.3, 0.15, 1);
function test() {
    const Q1 = 85;
    const k = 2.3;
    const x = 0.15;
    const t = 1;
    const I = (93, 137, 208, 320);
    const c = calculateC(k, x, t);
}

const denominator = (input) => {
    // return input.k * (1 - input.x) + 0.5 * input.t;
    return 2 * input.k * (1 - input.x) + input.t;
};

const getC0 = (input, d) => {
    // const top = -input.k * input.x + 0.5 * input.t;
    const top = -2 * input.k * input.x + input.t;
    const res = top / d;
    return res;
};

const getC1 = (input, d) => {
    // const top = input.k * input.x + 0.5 * input.t;
    const top = 2 * input.k * input.x + input.t;
    const res = top / d;
    return res;
};

const getC2 = (input, d) => {
    // const top = input.k * (1 - input.x) - 0.5 * input.t;
    const top = 2 * input.k * (1 - input.x) - input.t;
    const res = top / d;
    return res;
};

const calculateC = (k, x, t) => {
    const input = { k, x, t };
    const d = denominator({ ...input });
    const C0 = getC0(input, d);
    const C1 = getC1(input, d);
    const C2 = getC2(input, d);
    const total = C0 + C1 + C2;
    return { C0, C1, C2, total };
};

module.exports = {
    calculateMuskingumCoefficients,
    calculateK,
    calculateStorage,
    calculateOutflow,
};
