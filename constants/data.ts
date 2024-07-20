import { Icons } from '@/components/icons';
import { NavItem, SidebarNavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export interface Order {
  id: number;
  created_at: string;
  updated_at: string;
  ud_account_id_zhanghu_5ff2dc: string;
  account_id: {
    username: string;
    ud_shoujihao_d5699c: string;
    profile_image: {
      url: string;
    };
    ud_dizhi_cb66dc:Address[];
  };
  ud_pet_pets_3c523f: number;
  pet: {
    name: string;
    type: string;
  };
  distance_id_distance: string;
  order_date: string;
  total_amount: number;
  status: string;
  type: string;
  order_details: OrderDetail[];
  post_ids: PostID[];
  schduled_service_id: ScheduledService | null; // 假设这些字段可能为null
  instant_ship_id: InstantShip | null;
  subscription_ship_id: SubscriptionShip | null;
  distance_id:{
    store_name:string;
  }
}

type Address = {
  ud_dizhi_d0510c: string;
  ud_xiangxidizhi_849d0b: string;
};

interface OrderDetail {
  id: number | null;
  quantity: number;
  unitprice: number;
  product_id: ProductID;
}

interface ProductID {
  id: number | null;
  name: string;
  value_ids: ValueID[];
}

interface ValueID {
  value: {
    id: number | null;
    label: string;
  };
}

interface PostID {
  id: number | null;
  shipped_date: string;
  tracking_number: string;
}

interface ScheduledService {
  id: number | null;
  schduled_date: string;
  schduled_time: string;
  service_type: string;
  status: string;
  carrier: string;
  created_at: string;
}

interface InstantShip {
  id: number | null;
  created_at: string;
  carrier: string;
  estime: string;
  actual_time: string;
  real_time_location: string;
  status: string;
  shipped_date: string;
}

interface SubscriptionShip {
  id: number | null;
  created_at: string;
  last_date: string;
  next_date: string;
  delivery_frequency: string;
  start_date: string;
  status: string;
}

export type Employee = {
  id: number | null;
  created_at: string;
  account_id: string;
  username: string;
  phone: string;
  user_profile_image: string;
  address: string;
  address_detail: string;
  ud_pet_pets_3c523f: number | null;
  pet_name: string;
  pet_type: string;
  distance_id_distance: string;
  store_name: string;
  order_date: string;
  total_amount: number | null;
  order_status: string; // Consider using a proper date type if possible
  order_type: string;
  product_name: string;
  post_shipped_date?: string;
  post_tracking_number?: string;
  schduled_id?: number | null;
  schduled_date?: string;
  schduled_time?: string; // Optional field
  service_type?: string; // Optional field
  service_status?: string; // Optional field
  service_carrier?: string; // Optional field
  schduled_status?: string;
  schduled_carrier?: string | null; // Profile picture can be a string (URL) or null (if no picture)
  schduled_created_at?: string;
  instant_ship_id?: number | null;
  instant_created_at?: string;
  instant_carrier?: string | null;
  instant_estime?: string;
  instant_actual_time?: string;
  instant_real_time_location?: string;
  instant_status?: string;
  instant_shipped_date?: string;
  subscription_ship_id?: number | null;
  subscription_created_at?: string;
  subscription_last_date?: string;
  subscription_next_date?: string;
  subscription_delivery_frequency?: string;
  subscription_start_date?: string;
  subscription_status?: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: '商品管理',
    href: '/dashboard/good?page=1&limit=10',
    icon: 'user',
    label: '商品管理'
  },
  {
    title: '订单管理',
    href: '/dashboard/employee',
    icon: 'employee',
    label: '订单管理'
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: 'profile',
    label: 'profile'
  },
  {
    title: 'Kanban',
    href: '/dashboard/kanban',
    icon: 'kanban',
    label: 'kanban'
  },
  {
    title: 'Login',
    href: '/',
    icon: 'login',
    label: 'login'
  }
];
