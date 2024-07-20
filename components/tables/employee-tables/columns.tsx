'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Employee>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'account_id',
    header: '用户信息',
    cell: ({ row }) => (
      <div className="flex items-center gap-4 p-2 min-w-[150px]">
        <img src={row.original.user_profile_image ?? ''} alt="用户头像" className="w-12 h-12 rounded-full object-cover" />
        <div className="flex flex-col">
          <div className="font-bold">{row.original.username ?? ''}</div>
          <div className="text-sm">{row.original.phone ?? ''}</div>
          <div className="text-sm">宠物名: {row.original.pet_name ?? ''}</div>
          <div className="text-sm">宠物类型: {row.original.pet_type ?? ''}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'address',
    header: '地址',
    cell: ({ row }) => (
      <div className="min-w-[150px]">
        {(row.original.address+" "+row.original.address_detail) ?? ''}
      </div>
    ),
  },
  {
    accessorKey: 'store_name',
    header: '所属服务点',
    cell: ({ row }) => (
      <div className="min-w-[150px]">
        {row.original.store_name ?? ''}
      </div>
    ),
  },
  {
    accessorKey: 'product_name',
    header: '商品信息',
    cell: ({ row }) => (
      <div className="min-w-[150px]">
        {row.original.product_name ?? ''}
      </div>
    ),
  },
  {
    accessorKey: 'order_date',
    header: '订单日期',
    cell: ({ row }) => (
      <div className="min-w-[150px]">
        {row.original.order_date ?? ''}
      </div>
    ),
  },
  {
    accessorKey: 'order_type',
    header: '订单类型',
    cell: ({ row }) => (
      <div className="min-w-[150px]">
        {row.original.order_type ?? ''}
      </div>
    ),
  },
  
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];



// // 在使用列的组件中
// // 假设orderType是从某个地方获取的，比如组件的props或者state
// const orderType = '特定类型'; // 这里是一个示例值

// // 根据orderType动态过滤列
// const filteredColumns = allColumns.filter(column => {
//   // 根据条件返回true来包含列，或者返回false来排除列
//   if (column.accessorKey === 'product_name' && orderType !== '特定类型') {
//     return false; // 如果不是特定类型，就不显示商品名称列
//   }
//   return true; // 其他情况下都显示列
// });

