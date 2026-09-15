  function validateRarityCount(data) {

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return {
            ok: false,
            error: "INVALID_ROOT",
            message: "Collection data must be an object."
        };
    }

    for (const [traitType, traitValues] of Object.entries(data)) {

        if (!traitValues || typeof traitValues !== "object" || Array.isArray(traitValues)) {
            return {
                ok: false,
                error: "INVALID_TRAIT_TYPE",
                message: `Trait "${traitType}" must contain an object of values.`
            };
        }

        for (const [traitValue, nftIds] of Object.entries(traitValues)) {

            if (!Array.isArray(nftIds)) {
                return {
                    ok: false,
                    error: "INVALID_TRAIT_VALUE",
                    message: `"${traitType}.${traitValue}" must contain an array of NFT IDs.`
                };
            }

            if (!nftIds.every(Number.isInteger)) {
                return {
                    ok: false,
                    error: "INVALID_NFT_IDS",
                    message: `"${traitType}.${traitValue}" contains invalid NFT IDs.`
                };
            }

        }

    }

    return {
        ok: true
    };

}


module.exports = {validateRarityCount}