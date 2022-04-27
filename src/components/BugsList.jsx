import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadBugs, getUnresolvedBugs, resolveBug } from "../store/slices/bugs";

export const BugsList = () => {
    const dispatch = useDispatch();
    const bugs = useSelector(getUnresolvedBugs);

    useEffect(() => {
      dispatch(loadBugs());
    }, [dispatch]);

    const onResolveClick = (bug) => dispatch(resolveBug(bug));
    
    return (
        <div>
            <ul>
                {bugs.map(bug => 
                <li key={bug.id}>
                    {bug.description} 
                    {' '}<button onClick={() => onResolveClick({ id: bug.id})}> Resolve</button>
                </li>
                )}
            </ul>
        </div>
    );
};