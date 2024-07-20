// hooks/useCPCL.js
import { useState, useCallback } from 'react';
import { CPCL } from '@/lib/cpcl'; // 这里修改为实际的路径

const useCPCL = ({ mode = 'CPCL', maxWidth = 540, size = 24 } = {}) => {
  const [cpclInstance, setCpclInstance] = useState(new CPCL({ mode, maxWidth, size }));

  const init = useCallback(() => {
    cpclInstance.init();
    setCpclInstance(cpclInstance);
  }, [cpclInstance]);
  //@ts-ignore
  const addCommand = useCallback((content) => {
    cpclInstance.addCommand(content);
    setCpclInstance(cpclInstance);
  }, [cpclInstance]);
  //@ts-ignore
  const setBitmap = useCallback((x, y, res) => {
    cpclInstance.setBitmap(x, y, res);
    setCpclInstance(cpclInstance);
  }, [cpclInstance]);
  //@ts-ignore
  const pushCode = useCallback((content) => {
    cpclInstance.pushCode(content);
    setCpclInstance(cpclInstance);
  }, [cpclInstance]);

  const setPagePrint = useCallback(() => {
    cpclInstance.setPagePrint();
    setCpclInstance(cpclInstance);
  }, [cpclInstance]);

  const getData = useCallback(() => {
    return cpclInstance.getData();
  }, [cpclInstance]);
  //@ts-ignore
  const batchAddCommand = useCallback((content, position, maxWidth) => {
    cpclInstance.batchAddCommand(content, position, maxWidth);
    setCpclInstance(cpclInstance);
  }, [cpclInstance]);

  return {
    init,
    addCommand,
    setBitmap,
    pushCode,
    setPagePrint,
    getData,
    batchAddCommand,
    cpclInstance
  };
};

export default useCPCL;