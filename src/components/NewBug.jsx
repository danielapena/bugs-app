import { useState } from 'react';

import { addBug } from '../store/slices/bugs';
import { useDispatch } from 'react-redux';

export const NewBug = () => {
    const [description, setDescription] = useState('');

    const dispatch = useDispatch();
    const onSubmit = (event) => {
        event.preventDefault();

        dispatch(addBug({description}));
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
            <label>New Bug </label>
            <input type="text" required onChange={({ target: input }) => setDescription(input.value)} id="description" />
            <button type="submit">Save</button>
            </form>
        </div>
    );
};