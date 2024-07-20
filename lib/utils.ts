import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Active, DataRef, Over } from '@dnd-kit/core';
import { ColumnDragData } from '@/components/kanban/board-column';
import { TaskDragData } from '@/components/kanban/task-card';
import  CryptoJS from 'crypto-js'
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';
import { id } from 'date-fns/locale';


type DraggableData = ColumnDragData | TaskDragData;

// 定义差异类型
type Difference = {
  field: string;
  oldValue: any;
  newValue: any;
};

const ImgSchema = z.object({
  id: z.number(),
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

// 比较两个对象的函数
export function compareObjects(obj1: z.infer<typeof formSchema>, obj2: z.infer<typeof formSchema>): Difference[] {
  const differences: Difference[] = [];

  // 遍历formSchema的每个字段
  Object.keys(formSchema.shape).forEach((key) => {
    const value1 = obj1[key as keyof typeof obj1];
    const value2 = obj2[key as keyof typeof obj2];
  
    // 对于数组类型，比较长度和内部元素
    if (Array.isArray(value1) && Array.isArray(value2)) {
      if (value1.length !== value2.length) {
        differences.push({ field: key, oldValue: value1, newValue: value2 });
      } else {
        // 比较数组内部元素
        value1.forEach((item, index) => {
          if (JSON.stringify(item) !== JSON.stringify(value2[index])) {
            differences.push({ field: key, oldValue: value1, newValue: value2 });
          }
        });
      }
    } else if (value1 !== value2) {
      // 对于非数组类型，直接比较值
      differences.push({ field: key, oldValue: value1, newValue: value2 });
    }
  });

  return differences;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Task') {
    return true;
  }

  return false;
}

// 步骤 1: 定义生成随机字符串的函数
function generateRandomString(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// 步骤 2: 创建工具方法
export function getRandomString(prefix: string = 'query=', length: number = 5): string {
  // 直接生成并返回随机字符串
  // 生成一个UUID
  const uniqueString = uuidv4();
  return `${prefix}${uniqueString}`;
}

export const md5Base64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      if (e?.target?.result) {
        const wordArray = CryptoJS.lib.WordArray.create(Buffer.from(e?.target?.result as string));
        const hash = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(wordArray));
        resolve(hash);
      } else {
        reject('');
      }
    };
    reader.onerror = () => {
      reject('');
    };
    reader.readAsArrayBuffer(file);
  });
};


export const requestBluetoothDevice = async () => {
  try {
    //@ts-ignore
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [
        '0000fee7-0000-1000-8000-00805f9b34fb',
        '0000ff00-0000-1000-8000-00805f9b34fb',
        '0000ff10-0000-1000-8000-00805f9b34fb',
        '0000ff80-0000-1000-8000-00805f9b34fb',
        '49535343-fe7d-4ae5-8fa9-9fafd205e455',
      ]
    });
    console.log('Authorized:', device);

    // 连接GATT服务器
    const server = await device.gatt.connect();
    console.log('GATT Server:', server);

    // 获取打印服务
    const service = await server.getPrimaryService('49535343-fe7d-4ae5-8fa9-9fafd205e455'); // 使用一个有效的服务UUID
    console.log('Service:', service);

    // 获取打印特征
    const characteristic = await service.getCharacteristic('49535343-8841-43f4-a8d4-ecbe34729bb3'); // 这里需要替换为实际的特征UUID
    console.log('Characteristic:', characteristic);
    //存到localsotrage
    localStorage.setItem('characteristic', JSON.stringify(characteristic));
    // 检查特征属性
    console.log('Characteristic Properties:', characteristic.properties);
  } catch (error) {
    console.error('Bluetooth error:', error);
  }
};