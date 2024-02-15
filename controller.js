const {
    calculateMuskingumCoefficients,
    calculateK,
    calculateStorage,
    calculateOutflow,
} = require("./helpers");

// parent function that initiates the computation
function performCalculations(time, inflow, outflow, x) {
    const deltaTime = time[1] - time[0];
    // outflow = [
    //     85, 91, 114, 159, 233, 324, 420, 509, 578, 623, 642, 635, 603, 546, 479,
    //     413, 341, 274, 215, 170,
    // ];

    // inflow = [
    //     93, 137, 208, 320, 442, 546, 630, 678, 691, 675, 634, 571, 477, 390, 329,
    //     247, 184, 134, 108, 90,
    // ];

    // x = 0.15;
    // const deltaTime = 3600;

    const { storage, weightedFlux } = calculateStorage(
        // function to calculate storage(S) and weighted flux
        inflow,
        outflow,
        x,
        deltaTime
    );

    const { k, intercept } = calculateK(storage, weightedFlux); // function to calculate storage time constant K

    console.log(`K: ${k},intercept: ${intercept}`);
    console.log(`storage: ${storage}`);
    console.log(`weightedFlux: ${weightedFlux}`);

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
