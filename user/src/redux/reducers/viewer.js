export default function reducer(state = {
  layout: 4, //id of the selected layout
  group: 0, //current group index
  playlist: 0, //current playlist index
  item: 0, //current selected item index
  playAction: 0, // play_all : 0, pause_all : 1, none of either : 3
  activeCube: 0, // current selected cube index
  playlistViewerHeight: 1, // 0: Hide, 1: Short, 2: Medium, 3: Full
  importContent: false,
  searchContent: false,
  showWiki: false,
}, action) {
  switch(action.type) {

    case 'SELECT_LAYOUT': {
      return {...state, layout: action.payload, playlist: 0, item: 0, playAction: 0}
    }

    case 'SELECT_GROUP': {
      return {...state, group: action.payload, playlist: 0, item: 0, playAction: 0}
    }

    case 'SELECT_PLAYLIST': {
      return {...state, playlist: action.payload, item: 0}
    }

    case 'SELECT_ITEM': {
      return {...state, item: action.payload}
    }

    case 'PLAY_ACTION': {
      return {...state, playAction: action.payload}
    }

    case 'SELECT_CUBE': {
      return {...state, activeCube: action.payload}
    }

    case 'SELECT_PLAYLIST_VIEWER_HEIGHT': {
      return {...state, playlistViewerHeight: action.payload}
    }

    case 'SELECT_IMPORT_CONTENT': {
      return {...state, importContent: action.payload, searchContent: false, showWiki: false}
    }

    case 'SELECT_SEARCH_CONTENT': {
      return {...state, importContent: false, searchContent: action.payload, showWiki: false}
    }

    case 'SELECT_WIKI_SHOW': {
      return {...state, importContent: false, searchContent: false, showWiki: action.payload}
    }

    default: {
      return {...state}
    }

  }
}