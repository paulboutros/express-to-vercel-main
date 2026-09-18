/* global use */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
 

use("wulirocks_test");
/*
db.users.updateOne(
    { userId: "test_001" },
    {
        $set: {
            preferences: {
                sheetAutoSave: false
            }
        }
    }
);*/
db.users.findOne(
    { userId: "test_001" }
);