import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// react component for creating dynamic tables
import ReactTable from "react-table";

import {
    addPlatform,
    fetchPlatforms,
    removePlatform
} from '../../actions/platform';

import './styles.css';

class Platforms extends Component {
    constructor() {
        super();

        this.state = {
            platforms: [],
        };
    }

    componentWillMount() {
        this.fetchAllPlatforms();
    }

    fetchAllPlatforms = () => {
        const { fetchPlatforms } = this.props;
        fetchPlatforms()
            .then(({ platforms }) => {
                this.setState({ platforms });
            })
            .catch();
    }

    onNewPlatform = () => {
        const name = document.getElementById('newname').value.trim();
        if (name === '') {
            return alert('Name can\'t be blank!');
        }
        const { addPlatform } = this.props;
        addPlatform(name)
            .then(() => {
                document.getElementById('newname').value = '';
                this.fetchAllPlatforms();
            })
    }

    onRemovePlatform = (index) => {
        const { platforms } = this.state;
        const platform = platforms[index];
        const { removePlatform } = this.props;
        removePlatform(platform.id)
            .then(() => {
                this.fetchAllPlatforms();
            })
            .catch(() => {
                this.fetchAllPlatforms();
            });
    }

    render() {
        const {
            platforms
        } = this.state;
        const columns = [
            {
                Header: "Remove",
                accessor: "remove",
                headerStyle: {
                    textAlign: 'left',
                }
            },
            {
                Header: "Gridset Name",
                accessor: "name",
                headerStyle: {
                    textAlign: 'left'
                }
            }
        ];
        const tableData = platforms.map(({ name }, idx) => ({
            name,
            remove: <button onClick={() => this.onRemovePlatform(idx)}>remove</button>
        }));
        return (
            <div className="gridsets-page">
                <h4>Tethyr.io Admin Panel</h4>
                <h4>4-1 Platform Browser</h4>
                <div className='new-platform-panel'>
                    <div className='info-item'>
                        <label>Name</label>
                        <input type='text' id='newname' />
                    </div>
                    <button onClick={this.onNewPlatform}>Add Platform</button>
                </div>
                <ReactTable
                    data={tableData}
                    sortable={false}
                    columns={columns}
                    defaultPageSize={25}
                    showPaginationTop={false}
                    className="-striped -highlight"
                />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    addPlatform: bindActionCreators(addPlatform, dispatch),
    fetchPlatforms: bindActionCreators(fetchPlatforms, dispatch),
    removePlatform: bindActionCreators(removePlatform, dispatch)
})

export default connect(null, mapDispatchToProps)(Platforms);
