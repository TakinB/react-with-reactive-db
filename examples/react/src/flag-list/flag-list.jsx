import React, { Component } from 'react';
import * as Database from '../Database';
import './flag-list.css';

class FlagList extends Component {
    state = {
        flags: null,
        loading: true
    };
    subs = [];

    async componentDidMount() {
        const db = await Database.get();

        const sub = db.flags.find({
            selector: {},
            sort: [
                { name: 'asc' }
            ]
        }).$.subscribe(flags => {
            if (!flags) {
                return;
            }
            console.log('reload flags-list ');
            console.dir(flags);
            this.setState({
                flags,
                loading: false
            });
        });
        this.subs.push(sub);
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    deleteflag = async (flag) => {
        console.log('delete flag:');
        console.dir(flag);
        await flag.remove();
    }

    editflag = async (flag) => {
        console.log('edit flag:');
        console.dir(flag);
    }

    render() {
        const { flags, loading } = this.state;
        return (
            <div id="list-box" className="box">
                <h3>flags</h3>
                {loading && <span>Loading...</span>}
                {!loading && flags.length === 0 && <span>No flags</span>}
                {!loading &&
                    <ul id="flags-list">
                        {flags.map(flag => {
                            return (
                                <li key={flag.name}>
                                    <div className="color-box" style={{
                                        background: flag.value
                                    }}></div>
                                    <span className="name">
                                        {flag.name}
                                    </span>
                                    <div className="actions">
                                        {/* <i className="fa fa-pencil-square-o" aria-hidden="true" onClick={() => this.editflag(flag)}></i> */}
                                        <span className="delete fa fa-trash-o" aria-hidden="true" onClick={() => this.deleteflag(flag)}>DELETE</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                }
            </div>
        );
    }
}

export default FlagList;
