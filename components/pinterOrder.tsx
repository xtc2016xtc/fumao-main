import React, { useEffect, useState, useRef } from 'react';
import { CPCL } from '@/lib/cpcl'; // 这里修改为实际的路径
import html2canvas from 'html2canvas';

interface Props {
  characteristic: any;
}
const PinterOrder: React.FC<Props> = (props) => {

  const componentRef = useRef();

  const characteristic = props.characteristic;
  // 每块的最大字节数
  const CHUNK_SIZE = 512;
  const delay = 50; // 每次写入之间的延迟时间（毫秒）
  //@ts-ignore
  async function sendInChunks(characteristic, data) {
    let offset = 0;

    while (offset < data.length) {
      // 获取当前块的数据
      const chunk = data.slice(offset, offset + CHUNK_SIZE);

      try {
        // 发送当前块数据
        await characteristic.writeValue(new Uint8Array(chunk));

        // 添加一些延迟，确保硬件设备有足够的时间处理数据
        await new Promise((resolve) => setTimeout(resolve, delay)); // 延迟 250 毫秒，可以根据需要调整

        // 更新偏移量
        offset += CHUNK_SIZE;
      } catch (error) {
        console.error('Error writing data:', error);
        // 根据需要处理错误，例如重新发送当前块或终止操作
      }
    }
  }

  const command = new CPCL();

  const width = 320;
  const height = (width / 4) * 3;
  //  打印数据
  const printData = async () => {
    if (characteristic) {
      try {
        // 检查特征是否可写
        //@ts-ignore
        if (
          //@ts-ignore
          characteristic.properties.write ||
          //@ts-ignore
          characteristic.properties.writeWithoutResponse
        ) {
          //@ts-ignore
          const canvas = await html2canvas(componentRef.current);
          const ctx = canvas.getContext('2d');
          
          //@ts-ignore
          const imageData = ctx.getImageData(0, 0, width, height);
          // const yzdImage = invertImageColors(imageData)
          const imgData = canvas.toDataURL('image/png');
          console.log(imageData.data, 'imageData.data', imgData, 'imgData');
          command.init();
          command.addCommand(`! 0 320 240 310 1`);
          command.addCommand(`PAGE-WIDTH 360`);
          command.setBitmap(0, 0, imageData);
          command.setPagePrint();

          //@ts-ignore
          const encodedData = command.getData();
          console.log(encodedData, 'encodedData');
          const unit8 = new Uint8Array(Array.from(encodedData as []));
          await sendInChunks(characteristic, unit8);
          //@ts-ignore
          console.log('Data sent to printer');
          // });
        } else {
          console.error('Characteristic is not writable');
        }
      } catch (error) {
        console.error('Failed to print data:', error);
      }
    } else {
      console.error('Characteristic not available');
    }
  };

  return (
    <div ref={componentRef} className="h-[240px] w-[320px] flex flex-row space-y-1 p-0 font-myfont text-black">
      <div className="flex-1">
        <div className="row-auto  flex">
          <div className=" justify-cente flex w-[160px] items-center rounded-sm p-1 font-bold">
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="font-bold">
            <span className="text-2xl font-bold">★</span>
            <span className="text-3xl font-bold">9423</span>
            <p className="font-alibaba">鲜粮工坊</p>
            <p>工坊加工厨房</p>
            <p className="mb-2 text-4xl font-bold whitespace-nowrap">牛肉餐牛</p>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="font-bold">生产日期：2024/3/26</div>
          <div className="font-bold">常温保存20天</div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col">
          </div>
          <div></div>
        </div>
      </div>

      <div className="flex-1 -translate-x-10">
        <div className="flex flex-col">
          {/* <span className='font-semibold'>∞明石路冠军服务站</span> */}
          <div className="text-left">
                <div className=" ">
                <p className="mt-2 text-lg font-bold">周期购订单3/20</p>
                </div>
                <p className='text-sm font-bold'>备注：不要打电话，直接放门口库文件</p>
              </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col font-bold text-sm">
            <span>孙*徐 130*****0397</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinterOrder;
