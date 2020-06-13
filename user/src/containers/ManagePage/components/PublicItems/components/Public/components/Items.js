import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import images from '../../../../../../../constants/images';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  thumb: {
    width: 120,
  },
  typeThumb: {
    width: 60,
  },
  subtitle: {
    position: 'absolute',
    top: 120,
    right: 16,
    color: 'grey',
  },
  title: {
    display: 'flex',
    '& p': {
      lineHeight: 2,
    }
  },
  badgeImage: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
});

class PublicItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageSize : 20,
      playlist_id : props.playlist_id,
      playlist_title : props.playlist_title,
    };

    this.tableRef = React.createRef();
  }

  removeItem = (id) => {
    const { removePlaylistItem } = this.props;
    const { playlist_id } = this.state;

    removePlaylistItem(playlist_id, id)
    .then(() => {
      this.tableRef.current && this.tableRef.current.onQueryChange();
    })
    .catch(err => {console.log(err)})
  }

  onChangeRowsPerPage = (event) => {
    this.setState({
      pageSize : event,
    })
  }

  isEncoded = (uri) => {
    uri = uri || '';
    return uri !== decodeURI(uri);
  }
  
  decodeString = (str) => {
    if (this.isEncoded(str)) return decodeURI(str);
    return str;
  }

  setUserItemDot = (rowData) => {
    const video_id = rowData.id;
    const value = rowData.dotted === 1 ? 0 : 1;
    const { setPlaylistRating } = this.props;
    setPlaylistRating(value, video_id)
    .then( res => {
      this.tableRef.current && this.tableRef.current.onQueryChange();
    })
    .catch( err => {
      console.log(err);
    })
  }

  setUserItemHidden = (rowData) => {
    const { playlist_id } = this.state;
    const { hideUserItem } = this.props;
    const value = rowData.hidden === 1 ? 0 : 1;
    hideUserItem(playlist_id, rowData.id, value)
    .then( res => {
      this.tableRef.current && this.tableRef.current.onQueryChange();
    })
    .catch( err => {
      console.log(err);
    })
  }

  render() {
    //const user_id = sessionStorage.getItem('userId');
    const { classes } = this.props;
    const { pageSize, playlist_id, playlist_title } = this.state;
    return (
      <React.Fragment>
        <MaterialTable
          title={
            <div className={classes.title}>
              <img className={classes.badgeImage} src={images.crumb_plist} alt="Video Item" />
              <p>{playlist_title}</p>
            </div>
          }
          options={{
            sorting: false,
            draggable: false,
            actionsColumnIndex: 6,
            pageSize: pageSize,
          }}
          style={{
            marginBottom : 16,
          }}
          onChangeRowsPerPage = {this.onChangeRowsPerPage}
          tableRef={this.tableRef}
          columns={[
            { title: 'ID',
              field: 'playlist_order',
              render: rowData =>
              <div className={classes.title}>
                <PlayArrowOutlinedIcon className={classes.badgeImage} />
                <p>{rowData.id}</p>
              </div>
            },
            { title: 'Platform',
              field: 'video_type',
              render: rowData => (
                <img src={require(`../../../../../../../resources/images/broadcasters/` + rowData.video_type.toLowerCase() + `.png`)} className={classes.typeThumb} alt={rowData.video_type}/>
              )
            },
            {
              title: 'Thumb',
              field: 'thumbnail',
              render: rowData => (
                <img
                  style={{ maxWidth: 120 }}
                  src={rowData.thumbnail}
                  alt="Video Thumbnail"
                />
              ),
            },
            { title: 'Title',
              field: 'video_title',
              render: rowData => {
                const str = this.decodeString(rowData.video_title);
                return str;
              }
            },
            { title: 'Author', field: 'video_author' },
            { title: 'Length',
              field: 'length',
              render: rowData => {
                let hour = 0;
                let min = Math.floor(rowData.video_length / 60);
                const sec = rowData.video_length - min * 60;
                if (min > 60) {
                  hour = Math.floor(min / 60);
                  min = min % 60;
                }
                const length = rowData.video_length !== -1 ? `${hour !== 0 ? `${hour}h` : ''}${min}m${sec}s` : 'na';
                return length;
              },
            },
          ]}
          data={query =>
            new Promise((resolve, reject) => {
              let url = `${process.env.REACT_APP_SERVER_URL}/user/video/getPublicVideo/${playlist_id}`;
              url += `/${query.pageSize}`;
              url += `/${(query.page + 1)}`;
              fetch(url)
                .then(response => response.json())
                .then(result => {
                  resolve({
                    data: result.data,
                    page: result.page - 1,
                    totalCount: result.total,
                  })
                })
            })
          }
        />
        <p className={classes.subtitle}>M-1-3</p>
      </React.Fragment>
    )
  }
};


export default withStyles(styles)(PublicItems);