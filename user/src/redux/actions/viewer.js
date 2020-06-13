export function selectLayout(layout){
  return function(dispatch) {
    dispatch({type: 'SELECT_LAYOUT', payload: layout})
  }
}

export function selectGroup(group){
  return function(dispatch) {
    dispatch({type: 'SELECT_GROUP', payload: group})
  }
}

export function selectPlaylist(playlist){
  return function(dispatch) {
    dispatch({type: 'SELECT_PLAYLIST', payload: playlist})
  }
}

export function selectItem(item){
  return function(dispatch) {
    dispatch({type: 'SELECT_ITEM', payload: item})
  }
}

export function playAction(action){
  return function(dispatch) {
    dispatch({type: 'PLAY_ACTION', payload: action})
  }
}

export function selectCube(cube){
  return function(dispatch) {
    dispatch({type: 'SELECT_CUBE', payload: cube})
  }
}

export function selectPlaylistViewerHeight(height){
  return function(dispatch) {
    dispatch({type: 'SELECT_PLAYLIST_VIEWER_HEIGHT', payload: height})
  }
}

export function selectImportContent(value){
  return function(dispatch) {
    dispatch({type: 'SELECT_IMPORT_CONTENT', payload: value})
  }
}

export function selectSearchContent(value){
  return function(dispatch) {
    dispatch({type: 'SELECT_SEARCH_CONTENT', payload: value})
  }
}

export function selectWikiShow(value){
  return function(dispatch) {
    dispatch({type: 'SELECT_WIKI_SHOW', payload: value})
  }
}