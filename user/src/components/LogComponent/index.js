import React from 'react';

import './styles.scss';

class LogComponent extends React.Component {
    
    render() {
        const logs = this.props.logs;
        return (
                <div id="logArea">
                    <ul>
                        {logs.map(function(item, index) {
                            return <li key={index}>{item}</li>;
                        })}
                    </ul>
                </div>
            );
    }
}
export default LogComponent;
