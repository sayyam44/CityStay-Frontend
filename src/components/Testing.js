import React from 'react';
import { useImmerReducer } from 'use-immer';

function Testing() {
    const initialState = {
        appleCount: 1,
        bananaCount: 10,
        message: "Hello",
        happy: false,
    };

    function ReducerFunction(draft, action) {
        switch (action.type) {
            case 'addApple':
                draft.appleCount = draft.appleCount + 1;
                break;
            case 'changeEverything':
                draft.bananaCount = draft.bananaCount + 10;
                draft.message = action.customMessage;
                draft.happy = true;
                break;
            default:
                // Ensure default case to return draft unchanged
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);
    // state holds the initialState
    // dispatch holds the ReducerFunction

    return (
        <>
            <div>Apple Count is {state.appleCount}</div>
            <div>Banana Count is {state.bananaCount}</div>
            <div>Message is {state.message}</div>
            <div>Happy is {state.happy ? "Yes" : "No"}</div>
            <br />
            <button onClick={() => dispatch({ type: "addApple" })}>Add Apple</button>
            <br />
            <button onClick={() => dispatch({ type: "changeEverything", customMessage: "The message from dispatcher" })}>
                Change Everything
            </button>
        </>
    );
}

export default Testing;
