import React from 'react'
import { connect } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import classNames from 'classnames'
import Truncate from 'react-truncate';
import { swapUserItemOrder } from '../../../../../services/UserItem'
import dragHandleIcon from '../../../../../assets/images/videoItemIcons/item_drag_handle.png'
import placeholderAuthorImg from '../../../../../assets/images/placeholder_images/author.png'
import placeholderItemThumb from '../../../../../assets/images/placeholder_images/item.png'
import item_dot_on from '../../../../../assets/images/videoItemIcons/item_dot_on.png'
import item_dot_off from '../../../../../assets/images/videoItemIcons/item_dot_on.png'
import item_hidden_on from '../../../../../assets/images/videoItemIcons/item_hidden_on.png'
import item_hidden_off from '../../../../../assets/images/videoItemIcons/item_hidden_off.png'
import item_link from '../../../../../assets/images/videoItemIcons/item_link.png'
import item_report from '../../../../../assets/images/videoItemIcons/item_report.png'
import item_delete from '../../../../../assets/images/videoItemIcons/item_delete.png'
import './styles.scss';

class PlaylistViewerBody extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      items: [],
      currentPlaylist: 0,
    }
  }

  componentDidMount() {
    this.setState({
      items: this.props.items,
      currentPlaylist: this.props.currentPlaylist,
    })
  }

  componentDidUpdate() {
    if(this.state.currentPlaylist !== this.props.currentPlaylist || this.state.items !== this.props.items) {
      this.setState({
        items: this.props.items,
        currentPlaylist: this.props.currentPlaylist,
      })
    }
  }

  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  }

  onDragEnd = (result) => {
    if (!result.destination || (result.source.index === result.destination.index)) {
      return;
    }
    const { user } = this.props.user;
    const { currentPlaylist } = this.state;
    const items = this.reorder(this.state.items, result.source.index, result.destination.index);
    const source_id = this.state.items[result.source.index].id;
    const destination_id = this.state.items[result.destination.index].id;
    swapUserItemOrder(user.user_id, user.token, currentPlaylist, source_id, destination_id)
    .then(() => {
      this.props.onSortEnd(items, result.source.index, result.destination.index)
    })
    .catch(err => console.log(err))
  }

  toggleLines = (item, event) => {
    event.preventDefault();

    item.expanded = !item.expanded;
    this.setState({})
  }

  onClickItem = (index) => {
    this.props.onClickItem(index)
  }

	render() {
    const { showPlaylistViewerFilters, thumbSize, playingItem } = this.props
    const lines = 3
    return (
      <div className={classNames('playlistViewerBody', {'viewer-height': showPlaylistViewerFilters})}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, droppableSnapshot) => {
              return (
                <div ref={provided.innerRef} className="video_items">
                  {this.state.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          className={classNames('video_item', {'playingItem': index === playingItem})}
                          ref={provided.innerRef}
                          onClick={() => this.onClickItem(index)}
                          isDragging={snapshot.isDragging}
                          isDraggingOver={droppableSnapshot.isDraggingOver}
                          isHovered={snapshot.isDragging}
                          isFocused={
                            droppableSnapshot.isDraggingOver ? snapshot.isDragging : undefined
                          }
                          {...provided.draggableProps.style}
                          {...provided.draggableProps}
                        >
                          <div className="item_header">
                            <div className="item_platform">
                              <img src={require(`../../../../../assets/images/broadcasters/${item.type.toLowerCase()}.png`)} alt={item.type}/>
                            </div>
                            <div className="item_title">
                              { item.type.toLowerCase() === 'podcast' ? item.title + ' : ' + item.episode_title : item.title }
                            </div>
                            <div className="item_author">
                              <div className="item_author_img">
                                {
                                  item.author_img ?
                                  <img src={item.author_img} /> :
                                  <img src={placeholderAuthorImg} alt="item"/>
                                }
                              </div>
                              <div className="item_author_name">
                                {item.author}
                              </div>
                            </div>
                          </div>
                          <div className="item_content">
                            <div className={classNames("item_thumb", sizes[thumbSize])}>
                              {
                                item.thumb ?
                                <img src={item.thumb} alt="videoThumb"/>:
                                <img src={placeholderItemThumb} alt="videoThumb"/>                                
                              }
                            </div>
                            <div className="item_description">
                              <Truncate 
                                lines={!item.expanded && lines} 
                                ellipsis={<span>... <button className="truncate_btn" onClick={(e) => this.toggleLines(item, e)}>Click to expand</button></span>}
                              >
                                {item.description}
                              </Truncate>
                              {item.expanded &&
                                <span className="less-btn-box"><button className="truncate_btn" onClick={(e) => this.toggleLines(item, e)}>Show Less</button></span>
                              }
                              <div className="item_category">CATEGORY <span style={{color: "white"}}>Trees and Shrubbery</span> TAGS <span style={{color: "white"}}> Rules, Dogs, Hats, Get Over Here, Killers</span></div>
                            </div>
                          </div>
                          <div className="item_footer">
                            <div className="item_length">{item.length} {item.sponsored === 1 && <span className="item_sponsored">SPONSORED</span>}</div>
                            <div className="item_actions">
                              <img src={item.dotted ? item_dot_on : item_dot_off} className="action_icon" alt="dot" title="Dot this" />
                              <img src={item.hidden ? item_hidden_on : item_hidden_off} className="action_icon" alt="hidePlaylist" title="Hide this" />
                              <img src={item_report} className="action_icon" alt="brokenBtn" title="Flag this"/>
                              <img src={item_delete} className="action_icon" alt="removeBtn" title="Remove this"/>
                              <img src={item_link} onClick={() =>this.itemInterface(item)} className="action_icon" alt="interfaceBtn" title="Open Source"/>
                              <img src={dragHandleIcon} className="action_icon" id={item.id} {...provided.dragHandleProps} />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(PlaylistViewerBody)