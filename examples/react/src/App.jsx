import React from 'react';
import './App.css';

import FlagList from './flag-list/flag-list.jsx';
import FlagInsert from './flag-insert/flag-insert';

const App = () => {
    return (
        <div>
            <h1>RxDB Example - React</h1>
            <FlagList/>
            <FlagInsert/>
        </div>
    );
};

export default App;
