import BreadCrumb from '@/components/breadcrumb';
import { columns } from '@/components/tables/employee-tables/columns';
import { EmployeeTable } from '@/components/tables/employee-tables/employee-table';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Employee, Order } from '@/constants/data';
import { getClient } from '@/lib/apollo-client';
import { ORDER_QUERY, STORE_QUERY } from '@/graphql/employee/queries';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';


const breadcrumbItems = [{ title: '订单管理 ', link: '/dashboard/employee' }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;
  const order_type = searchParams.order_type || '即时订单';
  const store_name = searchParams.store_name || '';
  const client = getClient();

  const { data } = await client.query({
    query: ORDER_QUERY,
    context: {
      headers: {
        Authorization: process.env.GRAPHQL_TOKEN,
      },
    },
    variables: {
      offset: offset,
      limit: pageLimit,
      order_by: [
        {
          id: "desc_nulls_last"
        }
      ],
      where: {
        _and: [
          {
            type: {
              _ilike: `%${order_type=='全部订单' ? '' : order_type}%`
            }
          },
          {
            distance_id: {
              store_name: {
                _ilike: `%${store_name}%`
              }
            }
          }
        ]
      }
    }
  });

  const { data: store_data } = await client.query({
    query: STORE_QUERY,
    context: {
      headers: {
        Authorization: process.env.GRAPHQL_TOKEN,
      },
    },
    variables: {
      limit: 100,
      offset: 0,
      order_by: [
        {
          id: "desc_nulls_last"
        }
      ],
      where: {}
    }
  });

  const storeOptions = store_data.distance.map((store: any) => {
    return {
      value: store.id,
      label: store.store_name
    };
  })


  const orders = data.ud_orders_652aca.map((order:Order):Employee => {
    return {
      id: order.id,
      created_at: order.created_at,
      account_id: order.ud_account_id_zhanghu_5ff2dc,
      username: order.account_id?.username ?? '',
      phone: order.account_id?.ud_shoujihao_d5699c ?? '',
      user_profile_image: order.account_id?.profile_image?.url ?? '',
      address: order.account_id?.ud_dizhi_cb66dc?.[0].ud_dizhi_d0510c ?? '',
      address_detail: order.account_id?.ud_dizhi_cb66dc?.[0].ud_xiangxidizhi_849d0b ?? '',
      ud_pet_pets_3c523f: order.ud_pet_pets_3c523f,
      pet_name: order.pet?.name ?? '',
      pet_type: order.pet?.type ?? '',
      distance_id_distance: order.distance_id_distance,
      store_name: order.distance_id?.store_name ?? '',
      order_date: order.order_date,
      total_amount: order.total_amount,
      order_status: order.status,
      order_type: order.type,
      product_name: order.order_details?.[0]?.product_id?.name ?? '',
      post_shipped_date: order.post_ids?.[0]?.shipped_date ?? '',
      post_tracking_number: order.post_ids?.[0]?.tracking_number ?? '',
      schduled_id: order.schduled_service_id?.id ?? null,
      schduled_date: order.schduled_service_id?.schduled_date ?? '',
      schduled_time: order.schduled_service_id?.schduled_time ?? '',
      service_type: order.schduled_service_id?.service_type ?? '',
      service_status: order.schduled_service_id?.status ?? '',
      service_carrier: order.schduled_service_id?.carrier ?? '',
      instant_ship_id: order.instant_ship_id?.id ?? null,
      instant_created_at: order.instant_ship_id?.created_at ?? '',
      instant_carrier: order.instant_ship_id?.carrier ?? '',
      instant_estime: order.instant_ship_id?.estime ?? '',
      instant_actual_time: order.instant_ship_id?.actual_time ?? '',
      instant_real_time_location: order.instant_ship_id?.real_time_location ?? '',
      instant_status: order.instant_ship_id?.status ?? '',
      instant_shipped_date: order.instant_ship_id?.shipped_date ?? '',
      subscription_ship_id: order.subscription_ship_id?.id ?? null,
      subscription_created_at: order.subscription_ship_id?.created_at ?? '',
      subscription_last_date: order.subscription_ship_id?.last_date ?? '',
      subscription_next_date: order.subscription_ship_id?.next_date ?? '',
      subscription_delivery_frequency: order.subscription_ship_id?.delivery_frequency ?? '',
      subscription_start_date: order.subscription_ship_id?.start_date ?? '',
      subscription_status: order.subscription_ship_id?.status ?? '',
    };
  });

  const totalUsers = data.ud_orders_652aca_aggregate.aggregate.count; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const employee: Employee[] = orders;
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        
        <div className="flex items-start justify-between">
          <Heading
            title={`订单管理`}
            description="用于管理各种类型的订单"
          />
          {/* <div
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> 连接打印机
          </div> */}
        </div>
        <Separator />

        <EmployeeTable
          searchKey="order_type"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={employee}
          pageCount={pageCount}
          storeOptions={storeOptions}
        />
      </div>
    </>
  );
}
