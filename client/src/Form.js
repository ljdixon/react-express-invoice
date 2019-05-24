import React, { useState } from 'react';
import List from './List';

export default function Form() {
    let [dockets, setDockets] = useState([]);

    return (
        <form>
            <List dockets={dockets} />
        </form>
    );
}