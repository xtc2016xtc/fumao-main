'use client';
import { useQuery, useMutation } from '@apollo/client';
import {
  ADD_PRODUCT_MUTATION,
  ADD_CATEGORY_MUTATION,
  OPATOINS_MUTATION,
  useAddImgMutation,
  useAddDetailImgMutation,
  useAddProductSubscriptionMutation,
  useUpdateProductMutation,
  useDeleteCategoryMutation,
  useDeleteImgMutation,
  useDeleteSubscriptionMutation,
  useDeleteOptionsMutation
} from '@/graphql/good/mutations';
import { OPTIONS_QUERY } from '@/graphql/good/queries';
import * as z from 'zod';
import { useState, useEffect, use } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import OptionValueSelect from '@/components/option-value-select';
import { getRandomString, compareObjects } from '@/lib/utils';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from '@/components/ui/select';

import { Checkbox } from '@/components/ui/checkbox';
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../ui/use-toast';
import FileUpload from '../file-upload';
import { ca, da } from 'date-fns/locale';
import { add, min } from 'date-fns';
const ImgSchema = z.object({
  value: z.number(),
  url: z.string()
});

const formSchema = z.object({
  name: z.string().min(2, { message: '请输入商品名称' }),
  imgUrl: z.array(ImgSchema).max(1, { message: '最多只能上传一张主图' }),
  description: z.string().min(2, { message: '请输入商品详情描述' }),
  weight: z.coerce.number().nonnegative({ message: '商品重量需要大等于0' }),
  base_price: z.coerce.number().positive({ message: '商品价格需要大于0' }),
  subscription: z.array(
    z.object({
      label: z.string(),
      value: z.number()
    })
  ),
  category: z.array(
    z.object({
      label: z.string(),
      value: z.number()
    })
  ),
  optionValues: z.array(
    z.object({
      label: z.string(),
      value: z.number()
    })
  ),
  detailImgUrl: z.array(ImgSchema).min(1, { message: '至少上传一张详情图' })
});

type ProductFormValues = z.infer<typeof formSchema>;
type ProductFormValuesKeys =
  | 'imgUrl'
  | 'subscription'
  | 'category'
  | 'optionValues'
  | 'detailImgUrl';

interface ProductFormProps {
  initialData: any | null;
  categories: any;
  subscription: any;
}
interface ProductData {
  ud_product_7f74c1: Array<any>; // 根据实际情况替换 any 为更具体的类型
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  subscription
}) => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<any>([
    {
      label: '请选择订阅类型',
      options: subscription.map((subscript: { id: number; name: string }) => {
        return {
          label: subscript.name,
          value: subscript.id
        };
      })
    }
  ]);
  const updateId = Number(searchParams.get('update'));
  const title = updateId ? '更新商品' : '新增商品';
  const description = updateId ? '更新商品' : '新增一个商品';
  const toastMessage = updateId ? '商品已更新' : '商品已新增';
  const action = updateId ? '保存' : '新增';
  const [options, setOptions] = useState<any>([]);
  const [optionObj, setOptionObj] = useState<any>({});

  // 将 useQuery 钩子调用移动到组件的顶层
  const { data: optionsData } = useQuery(OPTIONS_QUERY);
  categories = [
    {
      label: '请选择分类',
      options: categories.map((category: { id: number; name: string }) => {
        return {
          label: category.name,
          value: category.id
        };
      })
    }
  ];

  useEffect(() => {
    if (optionsData) {
      setOptions(
        optionsData?.ud_productoptions_fe330c.map((option: any) => {
          return {
            label: option.name,
            options: option.option_values.map((value: any) => {
              return {
                label: value.label,
                value: value.id
              };
            })
          };
        })
      );
    }
  }, [optionsData]);

  const addImage = useAddImgMutation();
  const addDetailImg = useAddDetailImgMutation();
  const updateProduct = useUpdateProductMutation();
  const deleteCategory = useDeleteCategoryMutation();
  const deleteImg = useDeleteImgMutation();
  const addSubscription = useAddProductSubscriptionMutation();
  const deleteSubscription = useDeleteSubscriptionMutation();
  const deleteOptions = useDeleteOptionsMutation();
  const [addProduct, {}] = useMutation(ADD_PRODUCT_MUTATION);
  const [addOption, {}] = useMutation(OPATOINS_MUTATION);
  const [addCategory, {}] = useMutation(ADD_CATEGORY_MUTATION);

  const defaultValues = initialData
    ? initialData
    : {
        name: '',
        description: '',
        base_price: 0,
        imgUrl: [],
        category: [],
        optionValues: [],
        detailImgUrl: [],
        subscription: [],
        weight: 0
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  // 从form对象中解构出setValue和watch方法
  const { setValue, watch } = form;
  // 使用watch方法监控category字段的值
  const watchedCategory = watch('category') || [];
  const condition = watchedCategory.some((category) =>
    category.label.includes('可订阅产品')
  );

  useEffect(() => {
    if (!condition) {
      // 如果不满足条件，清除`subscription`字段的数据
      setValue('subscription', []);
    }
  }, [condition, setValue]);

  // 使用watch方法监控subscription字段的值
  const watchedSubscription = form.watch('subscription') || [];
  const condition2 =
    subscription.filter((o: any) =>
      watchedSubscription.some((s: any) => s.label == o.name)
    ).length > 0;

  useEffect(() => {
    if (!condition) {
      // 如果不满足条件，清除`optionValues`字段的数据
      setValue('optionValues', []);
    }
  }, [condition, setValue]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      console.log('data', data, 'initialData', initialData);
      

      setLoading(true);
      if (initialData) {
        console.log('initialData', initialData);
        await updateProduct({
          _set: {
            name: data.name,
            description: data.description,
            base_price: data.base_price,
            weight: data.weight
          },
          id: updateId
        });
        const diffData = compareObjects(initialData, data as any);
         console.log('diffData', diffData);
        //对比 initialData 和 data，如果有不同则更新
        [
          'imgUrl',
          'subscription',
          'category',
          'optionValues',
          'detailImgUrl'
        ].forEach(async (key) => {
          const changeData = diffData.find(
            (diff: any) => diff.field == (key as ProductFormValuesKeys)
          );
          if (changeData) {
            console.log('changeData', changeData);
            const addData = changeData.newValue.filter((category: any) => {
              return !changeData.oldValue.some((newCategory: any) =>{
                return (newCategory.value == category.value)
              })
            })
            const deleteData = changeData.oldValue.filter((category: any) => {
              return !changeData.newValue.some((oldCategory: any) => {
                return ( oldCategory.value == category.value)
            })
          })
          console.log('deleteData', deleteData, 'addData', addData);
            if (deleteData.length > 0) {
              switch (key) {
                case 'category':
                  await deleteCategory(
                    deleteData.map((category: any) => {
                      return {
                        categoryId: category.value,
                        productId: updateId
                      };
                    })
                  );
                  break;
                case 'subscription':
                  await deleteSubscription(
                    deleteData.map((subscription: any) => {
                      return {
                        subscriptionId: subscription.value,
                        productId: updateId
                      };
                    })
                  )
                  break;
                case 'optionValues':
                  await deleteOptions(
                    deleteData.map((option: any) => {
                      return {
                        optionId: option.value,
                        productId: updateId
                      };
                    })
                  )
                  break;
                case 'detailImgUrl':
                  deleteImg(deleteData.map((img:any) => {
                    return {
                      productId: updateId,
                      pictureId:img.value.toString(),
                      type:'2'
                    }
                  }));
                  break;
                case 'imgUrl':
                  deleteImg(deleteData.map((img:any) => {
                    return {
                      productId: updateId,
                      pictureId:img.value.toString(),
                      type:'1'
                    }
                  }));
                  break;
                default:
                  break;
              }
            }
            if (addData.length > 0) {
              switch (key) {
                case 'category':
                  await addCategory({
                    variables: {
                      objects: addData.map((category:any) => {
                        return {
                          ud_product_id_product_f44425:updateId,
                          ud_category_id_categories_c2e4c1: category.value
                        };
                      })
                    }
                  });
                  break;
                case 'subscription':
                  addSubscription(
                    addData.map((subscription:any) => {
                      return {
                        productId:updateId,
                        subscriptionId: subscription.value
                      };
                    })
                  )
                  break;
                case 'optionValues':
                  addOption({
                    variables: {
                      objects: addData.map((optionValue:any) => {
                        return {
                          ud_product_product_06d780: updateId,
                          ud_value_optionvalues_1ff270: optionValue.value
                        };
                      })
                    }
                  })
                  break;
                case 'detailImgUrl':
                  addDetailImg(
                    addData.map((img:any) => {
                      return {
                        productId:updateId,
                        pictureId: img.value.toString()
                      };
                    })
                  );
                  break;
                case 'imgUrl':
                  await addImage(updateId as any, addData[0].value.toString());
                  break;
                default:
                  break;
              }
            }
          }
        });
        toast({
          title: toastMessage,
          description: 'Success'
        });
        setLoading(false);
        const newRouterPath = getRandomString();
        router.push(`/dashboard/good?${newRouterPath}&page=1&limit=10`);
      } else {
        addProduct({
          variables: {
            objects: [
              {
                name: data.name,
                description: data.description,
                base_price: data.base_price,
                is_active: false,
                weight: data.weight
              }
            ]
          }
        }).then(async (response) => {
          const productId =
            response.data.insert_ud_product_7f74c1.returning[0].id;
          await addImage(productId, data.imgUrl[0].value.toString());
          await addDetailImg(
            data.detailImgUrl.map((img) => {
              return {
                productId,
                pictureId: img.value.toString()
              };
            })
          );
          addSubscription(
            data.subscription.map((subscription) => {
              return {
                productId,
                subscriptionId: subscription.value
              };
            })
          );
          addOption({
            variables: {
              objects: data.optionValues.map((optionValue) => {
                return {
                  ud_product_product_06d780: productId,
                  ud_value_optionvalues_1ff270: optionValue.value
                };
              })
            }
          }).then(() => {
            addCategory({
              variables: {
                objects: data.category.map((category) => {
                  return {
                    ud_product_id_product_f44425: productId,
                    ud_category_id_categories_c2e4c1: category.value
                  };
                })
              }
            }).then(() => {
              toast({
                title: toastMessage,
                description: 'Success'
              });
              setLoading(false);
              const newRouterPath = getRandomString();
              router.push(`/dashboard/good?${newRouterPath}&page=1&limit=10`);
            });
          });
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {/* {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )} */}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="imgUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>商品主图</FormLabel>
                <FormControl>
                  <FileUpload
                    defaultValue={field.value}
                    value={field.value}
                    onChange={field.onChange}
                    onRemove={field.onChange}
                    name="imgUrl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名称</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="请输入商品名称"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="请输入商品描述"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="base_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>基础价格</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>分类</FormLabel>
                  <FormControl>
                    <OptionValueSelect
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                      options={categories}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {watchedCategory.some((category) =>
              category.label.includes('可订阅产品')
            ) && (
              <FormField
                control={form.control}
                name="subscription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>订阅类型</FormLabel>
                    <FormControl>
                      <OptionValueSelect
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        options={subscriptionData}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {subscription.filter((o: any) =>
              watchedSubscription.some((s: any) => s.label == o.name)
            ).length > 0 && (
              <FormField
                control={form.control}
                name="optionValues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>规格值</FormLabel>
                    <FormControl>
                      <OptionValueSelect
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        options={options.filter((option: any) => {
                          // 使用Set来检查是否存在，提高效率
                          const watchedLabels = new Set(
                            watchedSubscription.map((watched) => watched.label)
                          );
                          // 筛选出订阅中包含的选项
                          const validOptions = new Set(
                            subscription
                              .filter(
                                (sub: any) => watchedLabels.has(sub.name) // 确保订阅的name在watchedLabels中
                              )
                              .flatMap((sub: any) => sub.options)
                              .map((o: any) => o)
                          ); // 将选项的label映射到一个新的Set中
                          return validOptions.has(option.label); // 检查当前选项是否在有效选项的Set中
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>重量(g)</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="detailImgUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>商品详情图</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value}
                    defaultValue={field.value}
                    onChange={field.onChange}
                    onRemove={field.onChange}
                    name="detailImgUrl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
