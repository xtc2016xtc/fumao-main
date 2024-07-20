import React, { useEffect, useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import PinterOrder from '@/components/pinterOrder';
const BluetoothComponent = (
  props: any
) => {
  const [device, setDevice] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);
  const handleCharacteristicReady = (characteristic: any) => {
    setCharacteristic(characteristic);
  };
  const { selectData } = props;
  const connectToDevice = async (device: any) => {
    try {
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(
        '49535343-fe7d-4ae5-8fa9-9fafd205e455'
      );
      const characteristic = await service.getCharacteristic(
        '49535343-8841-43f4-a8d4-ecbe34729bb3'
      );

      // 通知父组件特征已准备好
      handleCharacteristicReady(characteristic);

      // 存储设备和特征信息到localStorage
      localStorage.setItem('bluetoothDeviceId', device.id);
      localStorage.setItem('characteristicUUID', characteristic.uuid);
    } catch (error) {
      console.error('Bluetooth error:', error);
    }
  };

  const requestBluetoothDevice = async () => {
    try {
      const storedDeviceId = localStorage.getItem('bluetoothDeviceId');
      const storedCharacteristicUUID =
        localStorage.getItem('characteristicUUID');

      if (storedDeviceId && storedCharacteristicUUID) {
        // 尝试重新连接存储的设备
        //@ts-ignore
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ namePrefix: 'HM-A300' }],
          optionalServices: [
            '0000fee7-0000-1000-8000-00805f9b34fb',
            '0000ff00-0000-1000-8000-00805f9b34fb',
            '0000ff10-0000-1000-8000-00805f9b34fb',
            '0000ff80-0000-1000-8000-00805f9b34fb',
            '49535343-fe7d-4ae5-8fa9-9fafd205e455'
          ]
        });
        setDevice(device);

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(
          '49535343-fe7d-4ae5-8fa9-9fafd205e455'
        );
        const characteristic = await service.getCharacteristic(
          storedCharacteristicUUID
        );

        // 通知父组件特征已准备好
        handleCharacteristicReady(characteristic);
      } else {
        // 请求用户选择设备
        //@ts-ignore
        const device = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [
            '0000fee7-0000-1000-8000-00805f9b34fb',
            '0000ff00-0000-1000-8000-00805f9b34fb',
            '0000ff10-0000-1000-8000-00805f9b34fb',
            '0000ff80-0000-1000-8000-00805f9b34fb',
            '49535343-fe7d-4ae5-8fa9-9fafd205e455'
          ]
        });
        setDevice(device);
        await connectToDevice(device);
      }
    } catch (error) {
      console.error('Bluetooth error:', error);
    }
  };

  //  打印数据
  const printData = async () => {
    if (characteristic) {
      console.log(selectData,'selectData')
    } else {
      console.error('Characteristic not available');
    }
  };

  return (
    <>
      <div className='cursor-pointer'>
          <div className={cn(buttonVariants({ variant: 'default' }))}>
            {
              device ? (
                <div
              className={`w-[80px] text-center`}
              onClick={() => printData()}
            >
              <span>打印</span>
              {/* <PinterOrder 
            characteristic = {characteristic}
            /> */}
            </div>
              ) : (
                <div onClick={requestBluetoothDevice} className="w-[80px] text-center">
                  连接打印机
                </div>
              )
            }
          </div>
      </div>
    </>
  );
};

export default BluetoothComponent;
