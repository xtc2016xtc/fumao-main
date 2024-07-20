import { gql } from "@apollo/client";

export const SUBSCRIPTION_QUERY = gql`
query ($limit: Int, $offset: Int, $order_by: [ud_subscriptiontypes_5951dd_order_by!], $where: ud_subscriptiontypes_5951dd_bool_exp) {
  ud_subscriptiontypes_5951dd(
    limit: $limit
    offset: $offset
    order_by: $order_by
    where: $where
  ) {
    id
    created_at
    updated_at
    name
    description
    options {
      option {
        id
        name
      }
    }
  }
}
`;  


export const OPTIONS_QUERY = gql`
query ($limit: Int, $offset: Int, $order_by: [ud_productoptions_fe330c_order_by!], $where: ud_productoptions_fe330c_bool_exp) {
  ud_productoptions_fe330c(
    limit: $limit
    offset: $offset
    order_by: $order_by
    where: $where
  ) {
    id
    created_at
    updated_at
    name
    description
    option_values {
      id
      label
    }
    subscriptions {
      subscription {
        id
        name
      }
    }
  }
}
`;

export const CATEGORY_QUERY = gql`
query ($limit: Int, $offset: Int, $order_by: [ud_categories_608e40_order_by!], $where: ud_categories_608e40_bool_exp) {
  ud_categories_608e40(
    limit: $limit
    offset: $offset
    order_by: $order_by
    where: $where
  ) {
    id
    name
    description
  }
}
`;

export const PRODUCT_QUERY = gql`
query ($limit: Int, $offset: Int, $order_by: [ud_product_7f74c1_order_by!], $where: ud_product_7f74c1_bool_exp) {
ud_product_7f74c1_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  ud_product_7f74c1(
    limit: $limit
    offset: $offset
    order_by: $order_by
    where: $where
  ) {
    id
    created_at
    updated_at
    name
    description
    base_price
    is_active
    weight
    subscriptions {
      subscription {
        id
        name
      }
    }
    category_ids {
      id
      category_id {
        id
        name
      }
    }
    ingredients_ids {
      id
    }
    videos {
      id
    }
    pictrues {
      id
      type
      pictrue {
        id
        url
      }
    }
    value_ids {
      id
      value {
        id
        label
      }
    }
    sub_type {
      id
    }
  }
}
`;