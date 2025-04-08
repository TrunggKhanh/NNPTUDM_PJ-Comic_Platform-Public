const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'COMIC-DATA MANAGER',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'main-page',
          title: 'Main Page',
          type: 'item',
          icon: 'feather icon-home',
          url: '/manager',
        },
        {
          id: 'comic-manager',
          title: 'Comic Manager',
          type: 'collapse',
          icon: 'feather icon-layers',
          children: [
            {
              id: 'comic-list',
              title: 'Comic Index',
              type: 'item',
              icon: 'feather icon-book',
              url: '/manager/comic/comic-index',
            },
            {
              id: 'comic-author',
              title: 'Author Index',
              type: 'item',
              icon: 'feather icon-edit',
              url: '/manager/comic/author-index',
            },
            {
              id: 'comic-gerne',
              title: 'Gerne Index',
              type: 'item',
              icon: 'feather icon-edit',
              url: '/manager/comic/gerne-index',
            },
            {
              id: 'Edit-Element',
              title: 'Edit Manager',
              type: 'item',
              icon: 'feather icon-layers',
              url: '/manager/comic/Edit',
            },
          ],
        },
        {
          id: 'trans-manager',
          title: 'User Manager',
          type: 'collapse',
          icon: 'feather icon-layers',
          children: [
            {
              id: 'staff-list',
              title: 'Staff Index',
              type: 'item',
              icon: 'feather icon-book',
              url: '/manager/user/staff-index',
            },
            {
              id: 'rbac-control',
              title: 'RBAC Control',
              type: 'item',
              icon: 'feather icon-settings', // Icon phù hợp cho chi tiết quản lý quyền
              url: '/manager/config/rbac-control/rbac-staff-detail',
            },
          
            {
              id: 'customer-control',
              title: 'Customer Index',
              type: 'item',
              icon: 'feather icon-book',
              url: '/manager/user/customer-index',
            },
            {
              id: 'payment-chart',
              title: 'Transactions Chart',
              type: 'item',
              icon: 'feather icon-bar-chart-2', // Icon phù hợp cho biểu đồ giao dịch
              url: '/manager/comic/payment-index/chart',
            },
            {
              id: 'payment',
              title: 'Payment',
              type: 'item',
              icon: 'feather icon-credit-card', // Icon phù hợp cho thanh toán
              url: '/manager/comic/payment-index',
            },
          ],
        },
      ],
    },
    {
      id: 'ui-config',
      title: 'Config website',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'Config',
          title: 'Config website',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'notification',
              title: 'Notification',
              type: 'item',
              icon: 'feather icon-bell', // Icon phù hợp cho thông báo
              url: '/manager/basic',
            },
 
            {
              id: 'rbac-manager',
              title: 'RBAC Manager',
              type: 'item',
              icon: 'feather icon-shield', // Icon phù hợp cho quản lý quyền
              url: '/manager/config/rbac-control',
            },
      
          
          ],
        },
      ],
    },
    {
      id: 'pages',
      title: 'PAGES',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'auth',
          title: 'Authentication',
          type: 'collapse',
          icon: 'feather icon-lock',
          // badge: {
          //   title: 'New',
          //   type: 'label-danger',
          // },
          children: [
            {
              id: 'signin',
              title: 'Sign in',
              type: 'item',
              url: '/manager/login',
              target: true,
              breadcrumbs: false,
            },
          ],
        },
      ],
    },
  ],
};

export default menuItems;
