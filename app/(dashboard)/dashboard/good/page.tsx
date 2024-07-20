import BreadCrumb from '@/components/breadcrumb';
import { UserClient } from '@/components/tables/user-tables/client';
import { columns } from '@/components/tables/user-tables/columns';
import { gql } from "@apollo/client";
import { getClient } from '@/lib/apollo-client';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus, Delete } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { PRODUCT_QUERY } from '@/graphql/good/queries';
import { getRandomString } from '@/lib/utils';



const breadcrumbItems = [{ title: '商品管理', link: `/dashboard/good?${getRandomString()}page=1&limit=10`}];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};
interface ValueOption {
  name: string;
}

interface Value {
  name: string; // Add the 'name' property
  label: string;
  option: ValueOption;
}

interface ValueId {
  id: number;
  value: Value;
}

interface ProcessedOption {
  option: string;
  value: string[];
}

export default async function Page({ searchParams }: paramsProps){
  
  const search = searchParams.search || '';
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;

  const client = getClient();

  const productVariables = {
    offset: offset,
    limit: pageLimit,
    order_by: [
      {
        id: "desc_nulls_last"
      }
    ],
    where: {name: {_ilike: `%${search}%`}}
  };

  const { data } = await client.query({
    query: PRODUCT_QUERY,
    variables: productVariables
  });

  const users = data.ud_product_7f74c1.map((user:any) => {
    return {
      id: user.id,
      name: user.name,
      category: user.category_ids.map((category: { category_id: { name: string } }) => category.category_id.name).join(', '),
      description: user.description,
      base_price: user.base_price,
      is_active: user.is_active,
      options: user.value_ids.map((value: ValueId) => value.value.label).join(', '),
      imageUrl: user.pictrues[0]?.pictrue.url,
      weight: user.weight,
    };
  });

  // console.log(users,'users');
  const totalUsers = data.ud_product_7f74c1_aggregate.aggregate.count; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);

  return (
    <>
    {/* <PreloadQuery query={PRODUCT_QUERY} variables={{productVariables}}> */}
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`商品管理`}
            description="用于不同模块的商品管理"
          />
          <Link
            href={'/dashboard/good/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> 添加商品
          </Link>
        </div>
        <Separator />

        <UserClient 
          data={users} 
          searchKey="name"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          pageCount={pageCount}  
        />
      </div>
      {/* </PreloadQuery> */}
    </>
  );
}
