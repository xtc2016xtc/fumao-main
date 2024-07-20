import { gql } from "@apollo/client";

export const ORDER_QUERY = gql`
query ($limit: Int, $offset: Int, $order_by: [ud_orders_652aca_order_by!], $where: ud_orders_652aca_bool_exp) {
ud_orders_652aca_aggregate(where: $where) {
    aggregate {
      count
    }
  }  
ud_orders_652aca(
    limit: $limit
    offset: $offset
    order_by: $order_by
    where: $where
  ) {
    id
    created_at
    updated_at
    ud_account_id_zhanghu_5ff2dc
    account_id {
      username
      ud_shoujihao_d5699c
      profile_image {
        url
      }
      ud_dizhi_cb66dc {
        ud_dizhi_d0510c
        ud_xiangxidizhi_849d0b
      }
    }
    ud_pet_pets_3c523f
    pet {
      name
      type
    }
    distance_id_distance
    distance_id {
      store_name
    }
    order_date
    total_amount
    status
    type
    order_details {
      id
      quantity
      unitprice
      product_id {
        id
        name
        value_ids {
          value {
            id
            label
          }
        }
      }
    }
    post_ids {
      id
      shipped_date
      tracking_number
    }
    schduled_service_id {
      id
      schduled_date
      schduled_time
      service_type
      status
      carrier
      created_at
    }
    instant_ship_id {
      id
      created_at
      carrier
      estime
      actual_time
      real_time_location
      status
      shipped_date
    }
    subscription_ship_id {
      id
      created_at
      last_date
      next_date
      delivery_frequency
      start_date
      status
    }
  }
}
`;

export const STORE_QUERY = gql`
query ($limit: Int, $offset: Int, $order_by: [distance_order_by!], $where: distance_bool_exp) {
  distance(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
    id
    store_name
  }
}
`;
