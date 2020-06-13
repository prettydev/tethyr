
import React from 'react';

class Andmoor extends React.Component {

    // componentDidMount() {
    //     // var player = videojs('player');
    //     // console.log("============    ", player)
    // }

    // componentDidUpdate(prevProps) {
    //     const changes = Object.keys(this.props).filter(name => this.props[name] !== prevProps[name]);

    //     this.updateProps(changes);
    // }

    // /**
    //  * @private
    //  */
    // updateProps(propNames) {
    //     propNames.forEach((name) => {
    //         const value = this.props[name];
    //         switch (name) {
    //             case 'muted':
    //                 if (value) {
    //                     this.player.callMethod('volume', 0);
    //                 } else {
    //                     this.player.callMethod('volume', 100);
    //                 }
    //                 break;
    //             case 'paused':
    //                 if (value) {
    //                     this.player.callMethod('pause');
    //                 } else {
    //                     this.player.callMethod('play');
    //                 }
    //                 break;
    //             case 'url':
    //                 if (!value) {
    //                     this.player.callMethod('stop');
    //                 } else {
    //                     this.player.callMethod('load', 'video', value);
    //                 }
    //                 break;
    //             default:
    //             // Nothing
    //         }
    //     });
    // }

    render() {
        return (
            <iframe
                title="AndmoorEmbeded"
                style={{width:"100%", height:"100%"}}
                src={`https://andmoor.com/embed/${this.props.url}`}
                frameBorder="0" 
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
            >
            </iframe>
        );
    }
}

// Andmoor.defaultProps = {
//     onEnd: () => {},
// };

export default Andmoor;

