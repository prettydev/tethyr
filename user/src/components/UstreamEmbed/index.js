import React from 'react';
import UstreamEmbed from 'ustream-embedapi/src/ustream-embedapi';

class Ustream extends React.Component {

    componentDidMount() {
        const viewer = UstreamEmbed(this.props.id);
        this.player = viewer;
        this.player.addListener('finished', this.props.onEnd);
    }

    componentDidUpdate(prevProps) {
        const changes = Object.keys(this.props).filter(name => this.props[name] !== prevProps[name]);

        this.updateProps(changes);
    }

    /**
     * @private
     */
    updateProps(propNames) {
        propNames.forEach((name) => {
            const value = this.props[name];
            switch (name) {
                case 'muted':
                    if (value) {
                        this.player.callMethod('volume', 0);
                    } else {
                        this.player.callMethod('volume', 100);
                    }
                    break;
                case 'paused':
                    if (value) {
                        this.player.callMethod('pause');
                    } else {
                        this.player.callMethod('play');
                    }
                    break;
                case 'url':
                    if (!value) {
                        this.player.callMethod('stop');
                    } else {
                        this.player.callMethod('load', 'video', value);
                    }
                    break;
                default:
                // Nothing
            }
        });
    }

    render() {
        return (
            <iframe
                className={this.props.className}
                id={this.props.id}
                title='ustream'
                src={`https://www.ustream.tv/embed/${this.props.url}?html5ui&autoplay=true&volume=0.0`}
                allow="autoplay; encrypted-media"
            >
            </iframe>
        );
    }
}

Ustream.defaultProps = {
    onEnd: () => {},
};

export default Ustream;
