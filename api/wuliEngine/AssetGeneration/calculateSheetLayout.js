/**
 * Calculates the optimal sheet layout.
 *
 * Example:
 * totalItems = 17
 *
 * Returns:
 * {
 *   total: 17,
 *   sheetSize: 6,
 *   sheetCount: 3,
 *   sheets: [
 *      { index:0, from:0,  to:5,  count:6, rows:2 },
 *      { index:1, from:6,  to:11, count:6, rows:2 },
 *      { index:2, from:12, to:16, count:5, rows:2 }
 *   ]
 * }
 */

function calculateSheetLayout(
    totalItems,
    totalItemsSearchResult,
    {

        maxPerSheet = 4,//6,//8,
        minLastSheet = 4,
        columns = 4
    } = {}
) {

    if (totalItems <= 0) {
        return {
            total: 0,
            sheetSize: 0,
            sheetCount: 0,
            sheets: []
        };
    }

    const totalSheetCount = Math.ceil(totalItemsSearchResult / maxPerSheet);
    


    // Small collections fit on one sheet.
    if (totalItems <= maxPerSheet) {

        return {
            totalSheetCount : totalSheetCount,
            total: totalItems,
            sheetSize: totalItems,
            sheetCount: 1,
            sheets: [
                {
                    index: 0,
                    from: 0,
                    to: totalItems - 1,
                    count: totalItems,
                    rows: Math.ceil(totalItems / columns)
                }
            ]
        };
    }

    //-----------------------------------------
    // Find best sheet size
    //-----------------------------------------

    let sheetSize = maxPerSheet;

    while (sheetSize > minLastSheet) {

        const remainder = totalItems % sheetSize;

        if (remainder === 0 || remainder >= minLastSheet)
            break;

        sheetSize--;
    }

    //-----------------------------------------
    // Build sheet list
    //-----------------------------------------

    const sheets = [];

    let from = 0;
    let index = 0;


    
      
     //totalItemsSearchResult

    while (from < totalItems) {

        const count = Math.min(sheetSize, totalItems - from);

        sheets.push({
            index,
            from,
            to: from + count - 1,
            count,
            rows: Math.ceil(count / columns)
        });

        from += count;
        index++;
    }

    return {
        totalSheetCount:totalSheetCount,
        total: totalItems,
        sheetSize,
        sheetCount: sheets.length,
        sheets
    };
}

module.exports = {
    calculateSheetLayout
};