// assets
import {IconLego, IconStar, IconDashboard} from '@tabler/icons';

// constant
const icons = { IconDashboard, IconLego, IconStar };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Ultrahand',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Build',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconLego,
      breadcrumbs: false
    },
    {
      id: 'favorite',
      title: 'My Favorites',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconStar,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
