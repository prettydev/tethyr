import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

import { saveUserPlaylistOrders } from '../../../../../../actions/index'

const styles = theme => ({
  button: {
    margin: theme.spacing(3),
  }
});

const Th = styled.th`
  background:#eee;
  padding: 8px 16px;
`;
const Table = styled.table`
  border-collapse: collapse; 
  width: 100%;
`;

const DraggableRow = styled.tr`
${props =>
  props.isDragging
    ? `
  border: 1px solid black;
`
    : ''};
`;

const DraggableCell = styled.td`
  padding: 8px 16px;
  ${props =>
    props.isDragging
      ? `
    display: inline-block !important;
  `
      : ''};
`;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class SwapModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      gridset_id: -1,
      updated: false,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    const user_id = sessionStorage.getItem('userId');
    const { gridset_id } = this.props;
    new Promise((resolve, reject) => {
      let url = `${process.env.REACT_APP_SERVER_URL}/user/playlist/getUserPlaylist/${user_id}/${gridset_id}/all/1`;
      fetch(url)
        .then(response => response.json())
        .then(result => {
          this.setState({
            items: result.data,
            gridset_id
          })
        })
    })
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    const items = reorder(this.state.items, result.source.index, result.destination.index);

    this.setState({
        items,
        updated: true,
      });
  }

  savePlaylistOrders = () => {
    const { items, updated, gridset_id } = this.state;
    const { saveUserPlaylistOrders } = this.props;
    if(!updated)
    {
      alert("There is no changes with the orders!!!")
      return null;
    }
    else {
      saveUserPlaylistOrders(gridset_id, items)
      .then(() => {
        this.props.updatePlaylistTable();
        this.setState({
          updated: false,
        })
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Button variant="contained" color="secondary" className={classes.button} onClick={() => this.savePlaylistOrders()}>Save</Button>
        <Button variant="contained" color="secondary" className={classes.button} onClick={this.props.handleSwapModalClose}>Cancel</Button>
        <div style={{overflow: 'scroll', height: 'calc(100% - 100px)'}}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Table>
              <thead>
                <tr>
                  <Th width="10%">ID</Th>
                  <Th width="30%">Title</Th>
                  <Th width="60%">Description</Th>
                </tr>
              </thead>
              <Droppable droppableId="droppable">
                {(provided, droppableSnapshot) => {
                  return (
                    <tbody ref={provided.innerRef}>
                      {this.state.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <DraggableRow
                              ref={provided.innerRef}
                              isDragging={snapshot.isDragging}
                              isDraggingOver={droppableSnapshot.isDraggingOver}
                              hovered={snapshot.isDragging}
                              focused={
                                droppableSnapshot.isDraggingOver ? snapshot.isDragging : undefined
                              }
                              {...provided.draggableProps.style}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <DraggableCell isDragging={snapshot.isDragging} width="10%">
                                {item.id}
                              </DraggableCell>
                              <DraggableCell isDragging={snapshot.isDragging} width="30%">
                                {item.title}
                              </DraggableCell>
                              <DraggableCell isDragging={snapshot.isDragging} width="60%">
                                {item.description}
                              </DraggableCell>
                            </DraggableRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  );
                }}
              </Droppable>
            </Table>
          </DragDropContext>
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  saveUserPlaylistOrders: bindActionCreators(saveUserPlaylistOrders, dispatch),
})

export default withStyles(styles)(connect(null, mapDispatchToProps)(SwapModal));