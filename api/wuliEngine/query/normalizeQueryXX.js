function normalizeQuery({ raw: query, caret }) {

    if (!query) {
        return { query: "", caret: 0 };
    }

    let state = { text: query, caret };


     console.log(   " >>>>  1 state   =============   "  , state   );
    state = collapseSpaces(state);
    state = normalizeOperators(state);
    state = removeSpaceAfterOpenBracket(state);

     console.log(   " >>>>  2 state   =============   "  , state   );
    state = removeSpaceBeforeCloseBracket(state);
    state = normalizeColon(state);
     console.log(   " >>>>  3 state   =============   "  , state   );
    state = normalizeComma(state);
    state = removeDuplicateCommas(state);
    state = normalizeBlockSpacing(state);

     console.log(   " >>>>  4 state   =============   "  , state   );

    state.text = state.text.trim();

    // clamp caret
    state.caret = Math.max(
        0,
        Math.min(state.caret, state.text.length)
    );

    console.log(   " state.caret   =============   "  , state.caret   );

    return {

        normalizedQuery: state.text,
        updatedCaret: state.caret

    };

}


//-------------------------------------------------------------

function applyReplace({ text, caret }, regex, replacement) {

    let out = "";
    let last = 0;
    let newCaret = caret;

    regex.lastIndex = 0;

    let match;

    while ((match = regex.exec(text)) !== null) {

        out += text.slice(last, match.index);
        out += replacement;

        const removed =
            match[0].length - replacement.length;

        if (match.index < newCaret) {

            newCaret -= Math.min(
                removed,
                newCaret - match.index
            );

        }

        last = match.index + match[0].length;
    }

    out += text.slice(last);

    return {

        text: out,
        caret: newCaret

    };

}


//-------------------------------------------------------------

function collapseSpaces(state) {

    return applyReplace(
        state,
        /\s+/g,
        " "
    );

}


//-------------------------------------------------------------

function normalizeOperators(state) {

    return applyReplace(
        state,
        /(\+\+v|\+v|-v)\s+\[/gi,
        "$1["
    );

}


//-------------------------------------------------------------

function removeSpaceAfterOpenBracket(state) {

    return applyReplace(
        state,
        /\[\s+/g,
        "["
    );

}


//-------------------------------------------------------------

function removeSpaceBeforeCloseBracket(state) {

    return applyReplace(
        state,
        /\s+\]/g,
        "]"
    );

}


//-------------------------------------------------------------

function normalizeColon(state) {

    return applyReplace(
        state,
        /\s*:\s*/g,
        ":"
    );

}


//-------------------------------------------------------------

function normalizeComma(state) {

    return applyReplace(
        state,
        /\s*,\s*/g,
        ","
    );

}


//-------------------------------------------------------------

function removeDuplicateCommas(state) {

    return applyReplace(
        state,
        /,+/g,
        ","
    );

}
 
//-------------------------------------------------------------

function normalizeBlockSpacing(state) {

    return applyReplace(
        state,
        /\]\s+(?=[+-]{1,2}v\[)/g,
        "] "
    );

}

