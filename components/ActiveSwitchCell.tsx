// ActiveSwitchCell.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Switch } from '@/components/ui/switch'; // 确保从正确的地方导入 Switch 组件
import { useToast } from "@/components/ui/use-toast";
import {getRandomString} from '@/lib/utils';
import { useRouter,useSearchParams } from 'next/navigation';

interface ActiveSwitchCellProps {
  value: boolean;
  rowId: number; // Replace 'string' with the actual type of 'rowId'
}

const UPDATE_ACTIVE = gql`
  mutation UpdateDetail($_set: ud_product_7f74c1_set_input, $pk_columns: ud_product_7f74c1_pk_columns_input!) {
  update_ud_product_7f74c1_by_pk(_set: $_set, pk_columns: $pk_columns) {
    id
  }
}
`;

const ActiveSwitchCell = ({ value, rowId }: ActiveSwitchCellProps) => {
  const [isActive, setIsActive] = useState(value);
  const { toast } = useToast()
  const searchParams = useSearchParams()
  // const [routerReady, setRouterReady] = useState(false);
  const router = useRouter();
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     setRouterReady(true); // 确保我们在客户端
  //   }
  // }, []);

  useEffect(() => {
      console.log(searchParams.get('page'), 'searchParams')
      setIsActive(value);
  }, [value]);

  const [updateActive, { loading }] = useMutation(UPDATE_ACTIVE, {
    onCompleted: () => {
      // 请求完成后，不需要手动更新状态，因为我们依赖于 Apollo 缓存的自动更新
      toast({
        title: '更新商品可见状态成功！',
        description: 'success',
      });
      const newRouterPath = getRandomString();
      router.push(searchParams.get('page') ? `/dashboard/good?${newRouterPath}&page=${searchParams.get('page')}&limit=${searchParams.get('limit')}` : `/dashboard/good?${newRouterPath}`);
    },
    onError: (error) => {
      // 错误处理
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
      console.error(error);
    }
  });

  const handleToggle = (newValue: boolean) => {
    updateActive({
      context: {
        headers: {
          Authorization: process.env.GRAPHQL_TOKEN
        }
      },
      variables: {
        _set: { is_active: newValue },
        pk_columns: { id: rowId }
      }
    }).then(() => setIsActive(newValue)); // 确保在请求成功后更新组件状态
  };

  return (
    <Switch
      checked={isActive}
      onCheckedChange={() => handleToggle(!isActive)}
      disabled={loading} // 当请求进行时禁用切换，避免重复发送请求
    />
  );
};

export default ActiveSwitchCell;
