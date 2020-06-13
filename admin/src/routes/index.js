import MovieIcon from '@material-ui/icons/Movie';
import PlaylistIcon from '@material-ui/icons/PlaylistAddCheck';
import GroupIcon from '@material-ui/icons/Group';
import PlatformIcon from '@material-ui/icons/VideoLabel';
import UserIcon from '@material-ui/icons/Person';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import FeaturedVideoIcon from '@material-ui/icons/FeaturedVideo';
import GetAppIcon from '@material-ui/icons/GetApp';

const routes = [
  {
    path: '/videos',
    name: 'Videos',
    icon: MovieIcon
  },
  {
    path: '/playlists',
    name: 'Playlists',
    icon: PlaylistIcon
  },
  {
    path: '/gridset',
    name: 'Playlist Groups',
    icon: GroupIcon
  },
  {
    path: '/platform',
    name: 'Platform',
    icon: PlatformIcon
  },
  {
    path: '/users',
    name: 'Users',
    icon: UserIcon
  },
  {
    path: '/defaultGridset',
    name: 'Default Playlist Groups',
    icon: GroupAddIcon
  },
  {
    path: '/ads',
    name: 'Ads',
    icon: FeaturedVideoIcon
  },
  // {
  //   path: '/api_generator',
  //   name: 'Generate Social API Keys',
  //   icon: GetAppIcon
  // }
]

export default routes;
