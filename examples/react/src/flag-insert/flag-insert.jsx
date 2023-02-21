import React, { Component } from 'react';
import * as Database from '../Database';

class FlagInsert extends Component {
    state = {
        name: '',
        value: ''
    }
    subs = []

    addflag = async (event) => {
        event.preventDefault();
        const { name, value } = this.state;
        const db = await Database.get();

        const addData = {
            name,
            value
        };
        await db.flags.insert(addData);
        this.setState({
            name: '',
            value: ''
        });
    }
    handleNameChange = (event) => {
        this.setState({ name: event.target.value });
    }
    handleValueChange = (event) => {
        this.setState({ value: event.target.value });
    }

    render() {
        return (
            <div id="insert-box" className="box">
                <h3>Add a flag</h3>
                <form onSubmit={this.addflag}>
                    <input name="name" type="text" placeholder="Name" value={this.state.name} onChange={this.handleNameChange} />
                    <input name="value" type="text" placeholder="value" value={this.state.value} onChange={this.handleValueChange} />
                    <button type="submit">Insert a flag</button>
                </form>
            </div>
        );
    }
}

export default FlagInsert;
