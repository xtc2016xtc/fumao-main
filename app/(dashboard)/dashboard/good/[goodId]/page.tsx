import BreadCrumb from '@/components/breadcrumb';
import { ProductForm } from '@/components/forms/product-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import { getClient } from '@/lib/apollo-client';
import { CATEGORY_QUERY, PRODUCT_QUERY, SUBSCRIPTION_QUERY } from '@/graphql/good/queries';
import { de } from 'date-fns/locale';
import {getRandomString} from '@/lib/utils';
type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const breadcrumbItems = [
    { title: '商品管理', link: `/dashboard/good?${getRandomString()}&page=1&limit=10` },
    { title: '添加商品', link: '/dashboard/good/create' }
  ];
  let initialData = null;
  const updateId = searchParams.update;
  const client = getClient();

  const {
    data: subscriptionData
  }:{data: {ud_subscriptiontypes_5951dd:{ id: string; name: string }[]}} = 
  await client.query({
    query: SUBSCRIPTION_QUERY
  });
  
  const subscription = subscriptionData.ud_subscriptiontypes_5951dd.map((sub: any) => {
    return {
      id: sub.id,
      name: sub.name,
      options: sub.options.map((option:any)=>{
        return option.option.name
      })
    };
  })
  
  const {
    data
  }: { data: { ud_categories_608e40: { id: string; name: string }[] } } =
    await client.query({
      query: CATEGORY_QUERY,
      context: {
        headers: {
          Authorization: process.env.GRAPHQL_TOKEN
        }
      },
      variables: {
        offset: 0,
        limit: 99,
        order_by: [
          {
            id: 'desc_nulls_last'
          }
        ],
        where: {}
      }
    });

  const categories = data.ud_categories_608e40.map(
    (category: { id: string; name: string; }) => {
      return {
        id: category.id,
        name: category.name,
        
      };
    }
  );

  if (updateId) {
    const {
      data: { ud_product_7f74c1 }
    } = await client.query({
      query: PRODUCT_QUERY,
      context: {
        headers: {
          Authorization: process.env.GRAPHQL_TOKEN
        }
      },
      variables: {
        offset: 0,
        limit: 10,
        order_by: [
          {
            id: 'desc_nulls_last'
          }
        ],
        where: {
          id: {
            _eq: updateId
          }
        }
      }
    });
    initialData = {
      name: ud_product_7f74c1[0].name,
      description: ud_product_7f74c1[0].description,
      base_price: ud_product_7f74c1[0].base_price,
      is_active: ud_product_7f74c1[0].is_active,
      category: ud_product_7f74c1[0].category_ids.map((value: { category_id: any })=> {
        return {
          label: value.category_id.name,
          value: value.category_id.id
        }
      }) || [],
      optionValues: ud_product_7f74c1[0].value_ids?.map((value: { value: any }) => {
        return {
          label: value.value.label,
          value: value.value.id
        }
      }) || [],
      subscription: ud_product_7f74c1[0].subscriptions.map((value: { subscription: any })=> {
        return {
          label: value.subscription.name,
          value: value.subscription.id
        }
      }) || [],
      imgUrl: ud_product_7f74c1[0].pictrues?.filter((o:{pictrue:any,type:number})=>o.type == 1).map((img:{pictrue:any})=>{
        return {
          value: img.pictrue.id,
          url: img.pictrue.url
        }
      }) || [],
      detailImgUrl: ud_product_7f74c1[0].pictrues?.filter((o:{pictrue:any,type:number})=>o.type == 2).map((img:{pictrue:any})=>{
        return {
          value: img.pictrue.id,
          url: img.pictrue.url
        }
      }) || [],
      weight: ud_product_7f74c1[0].weight,
    };
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <ProductForm
          categories={categories}
          initialData={initialData}
          subscription={subscription}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
