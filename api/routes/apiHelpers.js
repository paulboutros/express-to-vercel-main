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

/*
async function consumeCredit(userId, collection ) {

    const result = await collection.findOneAndUpdate(
        {
            userId,
            credits: { $gt: 0 }
        },
        {
            $inc: { credits: -1 }
        },
        {
            returnDocument: "after"
        }
    );

    if (!result) {
        throw new Error("Insufficient credits");
    }

    return result;
}*/

async function consumeCredit(userId, collection) {

    const result = await collection.findOneAndUpdate(
        {
            userId,
            credits: { $gt: 0 }
        },
        {
            $inc: { credits: -1 }
        },
        {
            returnDocument: "after"
        }
    );

    if (!result) {
        const error = new Error("Insufficient credits");
        error.status = 402;
        throw error;
    }

    return result;
}


module.exports = {validateRarityCount, consumeCredit}