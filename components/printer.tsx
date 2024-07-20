import React from 'react';

interface PrinterProps {
  characteristic: any;
}

const Printer: React.FC<PrinterProps> = ({ characteristic }) => {
  const printData = async (data: string) => {
    if (characteristic) {
      try {
        if (characteristic.properties.write || characteristic.properties.writeWithoutResponse) {
          const encoder = new TextEncoder();
          const encodedData = encoder.encode(data);
          await characteristic.writeValue(encodedData);
          console.log('Data sent to printer');
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

  const zplData = `
    ^XA
    ^FO50,50^A0N,50,50^FD商品名称: 测试商品^FS
    ^FO50,150^A0N,50,50^FD价格: ¥100.00^FS
    ^FO50,250^B3N,N,100,Y,N^FD1234567890^FS
    ^XZ
  `;

  return (
    <div>
      <button onClick={() => printData(zplData)}>Print</button>
    </div>
  );
};

export default Printer;