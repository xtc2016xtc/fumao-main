import { gql } from "@apollo/client";
import { useMutation } from '@apollo/client';
import exp from "constants";
import { object } from "zod";

export const ADD_PRODUCT_MUTATION = gql`
  mutation ($objects: [ud_product_7f74c1_insert_input!]!) {
    insert_ud_product_7f74c1(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = gql`
mutation ($ids: [bigint!]) {
  delete_ud_product_7f74c1(where: {id: {_in: $ids}}) {
    affected_rows
  }
}
`;

export const ADD_CATEGORY_MUTATION = gql`
mutation ($objects: [ud_productcategories_46d026_insert_input!]!) {
  insert_ud_productcategories_46d026(objects: $objects) {
    affected_rows
  }
}
`;


const DELETE_CATEGORY_MUTATION = gql`
mutation ($where: ud_productcategories_46d026_bool_exp!) {
  delete_ud_productcategories_46d026(where: $where) {
    affected_rows
  }
}
`;

export function useDeleteCategoryMutation() {
  const [deleteCategory] = useMutation(DELETE_CATEGORY_MUTATION);
  return (deleteArr:any) => {
    return deleteCategory({
      variables: {
        where: {
          _or: deleteArr.map((item: { productId: string, categoryId: string }) => {
            return {
              _and: [
                {
                  ud_product_id_product_f44425: {
                    _eq: item.productId
                  }
                },
                {
                  ud_category_id_categories_c2e4c1: {
                    _eq: item.categoryId
                  }
                }
              ]
            }
          })
        }
      }
    });
  };
}


export const OPATOINS_MUTATION = gql`
mutation ($objects: [product_value_insert_input!]!) {
  insert_product_value(objects: $objects) {
    affected_rows
  }
}
`;

const DELETE_OPTIONS_MUTATION = gql`
mutation ($where: product_value_bool_exp!) {
  delete_product_value(where: $where) {
    affected_rows
  }
}
`;

export function useDeleteOptionsMutation() {
  const [deleteOptions] = useMutation(DELETE_OPTIONS_MUTATION);
  return (deleteArr:any) => {
    return deleteOptions({
      variables: {
        where: {
          _or: deleteArr.map((item: { productId: string, optionId: string }) => {
            return {
              _and: [
                {
                  ud_product_product_06d780: {
                    _eq: item.productId
                  }
                },
                {
                  ud_value_optionvalues_1ff270: {
                    _eq: item.optionId
                  }
                }
              ]
            }
          })
        }
      }
    });
  };
}

export const IMG_URL_MUTATION = gql`
mutation ImagePresignedUrl($imgMd5Base64: String!, $imageSuffix: MediaFormat!) {
  imagePresignedUrl(
    imageSuffix: $imageSuffix
    imgMd5Base64: $imgMd5Base64
    acl: PRIVATE
  ) {
    downloadUrl
    uploadUrl
    contentType
    imageId
    uploadHeaders
  }
}
`
export const ADD_IMG_MUTATION = gql`
mutation ($objects: [ud_pictrue_3710c5_insert_input!]!) {
  insert_ud_pictrue_3710c5(objects: $objects) {
    affected_rows
  }
}
`;

export function useAddImgMutation() {
  const [addImg] = useMutation(ADD_IMG_MUTATION);
  return (productId: string, pictureId: string) => {
    return addImg({
      variables: {
        objects: [
          {
            ud_product_product_69f500: productId,
            pictrue_id: pictureId,
            sort_order: '1',
            is_active: true,
            type: '1'
          }
        ]
      }
    });
  };
}

export function useAddDetailImgMutation() {
  const [addImg] = useMutation(ADD_IMG_MUTATION);
  return (detailImaList:any) => {
    return addImg({
      variables: {
        objects: detailImaList.map((item: { productId: string, pictureId: string }) => {
          return {
            ud_product_product_69f500: item.productId,
            pictrue_id: item.pictureId,
            sort_order: '1',
            is_active: true,
            type: '2'
          }
        })
      }
    });
  };
}


const DELETE_IMG_MUTATION = gql`
mutation ($where: ud_pictrue_3710c5_bool_exp!) {
  delete_ud_pictrue_3710c5(where: $where) {
    affected_rows
  }
}
`;


export function useDeleteImgMutation() {
  const [deleteImg] = useMutation(DELETE_IMG_MUTATION);
  return (deleteArr:any) => {
    return deleteImg({
      variables: {
        where: {
          _or: deleteArr.map((item: { productId: string, pictureId: string, type: string}) => {
            return {
              _and: [
                {
                  ud_product_product_69f500: {
                    _eq: item.productId
                  }
                },
                {
                  pictrue_id: {
                    _eq: item.pictureId
                  }
                },
                {
                  type: {
                    _eq: item.type
                  }
                }
              ]
            }
          })
        }
      }
    });
  };
}

const ADD_PRODUCT_SUBSCRIPTION = gql`
mutation ($objects: [ud_productsubscription_efb916_insert_input!]!) {
  insert_ud_productsubscription_efb916(objects: $objects) {
    affected_rows
  }
}
`;

export function useAddProductSubscriptionMutation() {
  const [addProductSubscription] = useMutation(ADD_PRODUCT_SUBSCRIPTION);
  return (addList:any) => {
    return addProductSubscription({
      variables: {
        objects: addList.map((item: { productId: string, subscriptionId: string }) => {
          return {
            ud_product_product_62a216: item.productId,
            ud_subscription_subscriptiontypes_2e57ba: item.subscriptionId
          }
        })
      }
    });
  };
}

const DELETE_SUBSCRIPTION_MUTATION = gql`
mutation ($where: ud_productsubscription_efb916_bool_exp!) {
  delete_ud_productsubscription_efb916(where: $where) {
    affected_rows
  }
}
`;

export function useDeleteSubscriptionMutation() {
  const [deleteSubscription] = useMutation(DELETE_SUBSCRIPTION_MUTATION);
  return (deleteArr:any) => {
    return deleteSubscription({
      variables: {
        where: {
          _or: deleteArr.map((item: { productId: string, subscriptionId: string }) => {
            return {
              _and: [
                {
                  ud_product_product_62a216: {
                    _eq: item.productId
                  }
                },
                {
                  ud_subscription_subscriptiontypes_2e57ba: {
                    _eq: item.subscriptionId
                  }
                }
              ]
            }
          })
        }
      }
    });
  };
}


const UPDATE_PRODUCT_MUTATION = gql`
mutation UpdateDetail($_set: ud_product_7f74c1_set_input, $pk_columns: ud_product_7f74c1_pk_columns_input!) {
  update_ud_product_7f74c1_by_pk(_set: $_set, pk_columns: $pk_columns) {
    id
  }
}
`;

export function useUpdateProductMutation() {
  const [updateProduct] = useMutation(UPDATE_PRODUCT_MUTATION);
  return (update:any) => {
    return updateProduct({
      variables: {
        _set: update._set,
        pk_columns: {
          id: update.id
        }
      }
    });
  };
}


