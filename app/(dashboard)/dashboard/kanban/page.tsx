import BreadCrumb from '@/components/breadcrumb';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import NewTaskDialog from '@/components/kanban/new-task-dialog';
import { Heading } from '@/components/ui/heading';
import { getClient, } from '@/lib/apollo-client';
import { useQuery, gql } from '@apollo/client';

// const GET_PRODUCTS_QUERY = gql`
// query ($limit: Int, $offset: Int, $order_by: [ud_shangpin_77e0bf_order_by!], $where: ud_shangpin_77e0bf_bool_exp) {
//   ud_shangpin_77e0bf(
//     limit: $limit
//     offset: $offset
//     order_by: $order_by
//     where: $where
//   ) {
//     id
//     created_at
//     updated_at
//     ud_shangpinming_0c3ac7
//     ud_shangpinxiangqing_6ffb6d
//   }
// }
// `;

const breadcrumbItems = [{ title: 'Kanban', link: '/dashboard/kanban' }];

export default function page() {
  // const { loading, error, data } = useQuery(GET_PRODUCTS_QUERY, {
  //   variables: {
  //     offset: 0,
  //     limit: 20,
  //     order_by: [
  //       {
  //         id: "desc_nulls_last"
  //       }
  //     ],
  //     where: {}
  //   }
  // });

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error :</p>;
  
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Kanban`} description="Manage tasks by dnd" />
          <NewTaskDialog />
        </div>
        <KanbanBoard />
      </div>
    </>
  );
}
