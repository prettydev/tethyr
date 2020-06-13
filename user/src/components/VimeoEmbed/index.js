import React from 'react';
import Vimeo from '@vimeo/player';

class VimeoPlayer extends React.Component {

    componentDidMount() {
        var iframe = document.getElementById(this.props.id);
        const viewer = new Vimeo(iframe);
        this.player = viewer;
        this.player.setVolume(this.props.muted ? 0 : 1);
        this.player.on('ended', this.props.onEnd);
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
                        this.player.setVolume(0);
                    } else {
                        this.player.setVolume(1);
                    }
                    break;
                case 'paused':
                    if (value) {
                        this.player.pause();
                    } else {
                        this.player.play();
                    }
                    break;
                case 'url':
                    if (!value) {
                        this.player.callMethod('stop');
                    } else {
                        this.player.loadVideo(value);
                    }
                    break;
                default:
                // Nothing
            }
        });
    }

    render() {
        console.log("vimeo=========================")
        return (
            <iframe
                className={this.props.className}
                id={this.props.id}
                src={`https://player.vimeo.com/video/${this.props.url}?autoplay=true`}
                allow="autoplay; encrypted-media"
            >
            </iframe>
        );
    }
}

VimeoPlayer.defaultProps = {
    onEnd: () => { },
};

export default VimeoPlayer;
