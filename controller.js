const {
    calculateMuskingumCoefficients,
    calculateK,
    calculateStorage,
    calculateOutflow,
} = require("./helpers");

// parent function that initiates the computation
function performCalculations(time, inflow, outflow, x) {
    const deltaTime = time[1] - time[0];
    const { storage, weightedFlux } = calculateStorage(
        // function to calculate storage(S) and weighted flux
        inflow,
        outflow,
        x,
        deltaTime
    );

    let { k } = calculateK(storage, weightedFlux); // function to calculate storage time constant K
    k = 59.873;

    const { C0, C1, C2 } = calculateMuskingumCoefficients(k, x, deltaTime); // function to calculate muskingum coefficients

    const { outflows, C0I2, C1I1, C2O1 } = calculateOutflow(inflow, C0, C1, C2); // function to calculate outflow
    return {
        storage,
        weightedFlux,
        outflows,
        C0I2,
        C1I1,
        C2O1,
    };
}

module.exports = { performCalculations };
