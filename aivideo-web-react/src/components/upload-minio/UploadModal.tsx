import { CloudUploadOutlined, UploadOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { useReactive } from 'ahooks';
import { Button, Card, List, Modal, Progress, Space, Tag, Upload } from 'antd';
import axios from 'axios';
import pLimit from 'p-limit';

import uploadService, { TaskRecordItem } from '@/api/services/upload';

import cutFile from './cutFile';
import { convertFileSizeUnit, CHUNK_SIZE } from './fileUtil';
import { MerkleTree } from './MerkleTree';

import type { RcFile, UploadChangeParam } from 'antd/es/upload';

const limit = pLimit(3);

type UploadModalProps = {
  alarmTypeId: number;
  open: boolean;
  onCancel: () => void;
};

/** 分片上传时的 file 和上传地址 url */
type ChunkFileUrlType = {
  fileIdentifier: string;
  partNumber: number;
  file: Blob;
};

/** 文件数据类型 */
type FileTableDataType = {
  uid: string;
  name: string;
  size: number;
  unitSize: string;
  md5: string;
  md5Progress: number;
  progress: number;
  file: File;
  chunkCount: number;
  /** 当前文件分片集合 */
  chunkFileList: Blob[];
  /** 已上传的文件大小总和（计算进度条） */
  uploadedSize: number;
  /** 计算MD5中（加载中） | 等待上传 | 上传中  | 上传成功 | 上传失败 */
  status: 'preparation' | 'preupload' | 'uploading' | 'success' | 'error';
};

//  文件上传过程中的多种状态
const tagMap = {
  preparation: { color: 'gold', text: 'MD5计算中' },
  preupload: { color: 'purple', text: '等待上传' },
  uploading: { color: 'processing', text: '上传中' },
  success: { color: 'success', text: '上传成功' },
  error: { color: 'error', text: '上传失败' },
};

function UploadModal(props: UploadModalProps) {
  const queryClient = useQueryClient();
  const { open, onCancel, alarmTypeId } = props;
  const state = useReactive<{ dataSource: FileTableDataType[] }>({
    dataSource: [],
  });

  // 选择文件并计算 md5
  const selectFile = async (info: UploadChangeParam) => {
    const { file } = info;
    const chunkCount = Math.ceil((file.size ?? 0) / CHUNK_SIZE);
    // 展示给 table的数据，部分参数用于初始化
    const dataItem: FileTableDataType = {
      uid: file.uid,
      name: file.name,
      size: file.size ?? 0,
      unitSize: convertFileSizeUnit(file?.size),
      md5: '',
      md5Progress: 0,
      progress: 0,
      chunkCount,
      file: file as RcFile,
      status: 'preparation',
      chunkFileList: [],
      uploadedSize: 0,
    };
    state.dataSource.push(dataItem);
    const i = state.dataSource.findIndex((item) => item.uid === dataItem.uid);

    // 采用多线程计算和默克尔树计算树根
    const chunks = await cutFile(file as RcFile);
    const merkleTree = new MerkleTree(chunks.map((chunk) => chunk.hash));
    const md5 = merkleTree.getRootHash();
    // const index = state.dataSource.findIndex((item) => item.md5 === md5);
    // if (index !== -1) {
    //   message.error('文件MD5重复');
    //   state.dataSource
    // }
    const chunkFileList = chunks.map((chunk) => chunk.blob);
    // console.log(md5, chunkFileList)

    // 更新数据和状态
    state.dataSource[i] = {
      ...state.dataSource[i],
      md5,
      chunkFileList,
      status: 'preupload',
    };
  };

  // 查询文件状态并上传
  const onUpload = async () => {
    for (let i = 0; i < state.dataSource.length; i++) {
      // md5 未计算完成和正在上传的跳过（重复点击的情况）
      if (state.dataSource[i].md5 && state.dataSource[i].status === 'preupload') {
        // eslint-disable-next-line no-await-in-loop
        await uploadFile(i, state.dataSource[i]);
      }
    }
  };

  // 上传处理方法
  const uploadFile = async (index: number, item: FileTableDataType) => {
    console.log('上传文件', item);
    // 根据 md5 查询上传记录
    let taskInfo;
    taskInfo = await uploadService.taskInfo({ alarmTypeId,identifier: item.md5 });
    if (!taskInfo) {
      // 没有记录则初始化
      const initTaskData = {
        identifier: item.md5,
        fileName: item.name,
        totalSize: item.size,
        chunkSize: CHUNK_SIZE,
        alarmTypeId,
      };
      taskInfo = await uploadService.initTask(initTaskData);
    }
    const { finished, taskRecord } = taskInfo;
    if (finished) {
      //  上传成功
      state.dataSource[index].progress = 100;
      state.dataSource[index].status = 'success';
      return;
    }
    state.dataSource[index].status = 'uploading';

    // 返回需要上传分片和对应地址
    const needUploadFile = initSliceFile(item, taskRecord);
    console.log('需要上传的文件', needUploadFile);
    const needUploadSize = needUploadFile.reduce((pre, cur) => pre + cur.file.size, 0);
    state.dataSource[index].uploadedSize = item.size - needUploadSize;

    // // plimit 并发上传
    const uploadLimit = needUploadFile.map((n) =>
      limit(() => uploadChunkUrl(n, index, item.size, item.file.type)),
    );

    const results = await Promise.allSettled(uploadLimit);
    const errResults = results.filter((r) => r.status === 'rejected');

    if (errResults.length > 0) {
      console.warn(`${item.name} 上传失败的分片-----`, errResults);
      state.dataSource[index].status = 'error';
      return;
    }

    try {
      await uploadService.merge({ identifier: item.md5 });
      state.dataSource[index].status = 'success';
      state.dataSource[index].progress = 100;
    } catch (error) {
      state.dataSource[index].status = 'error';
    }
  };

  // 初始化分片操作并将分片文件和其上传地址一一对应
  const initSliceFile = (item: FileTableDataType, initData: TaskRecordItem) => {
    const needUploadFile: ChunkFileUrlType[] = [];
    //  只有上传中的分片文件才会有 initData 数据，用 {} 做兜底
    const { exitPartList, fileIdentifier } = initData || {};

    // 存放需要去上传的文件数据
    if ((exitPartList || []).length === 0) {
      // 若全都没有上传，先请求获取上传地址
      item.chunkFileList.forEach((item, index) => {
        needUploadFile.push({ fileIdentifier, partNumber: index + 1, file: item });
      });
      return needUploadFile;
    }

    // 存在上传的，对比 minio 已上传的 listParts（序号），将已上传的过滤掉，只上传未上传的文件
    item.chunkFileList.forEach((item, index) => {
      // listParts 索引是从 1 开始的
      const i = (exitPartList || []).findIndex((v) => index + 1 === v.partNumber);
      if (i === -1) {
        needUploadFile.push({ fileIdentifier, partNumber: index + 1, file: item });
      }
    });

    return needUploadFile;
  };

  // 根据分片上传地址将分片直传至 minio
  const uploadChunkUrl = async (
    chunkItem: ChunkFileUrlType,
    i: number,
    totalSize: number,
    type: string,
  ): Promise<void> => {
    const { fileIdentifier, partNumber, file } = chunkItem;
    const url = await uploadService.preSignUrl({
      alarmTypeId,
      identifier: fileIdentifier,
      partNumber,
    });
    if (!url) {
      return Promise.reject(new Error(`分片${partNumber}， 获取上传地址失败`));
    }
    try {
      const res = await axios.put(url, file, {
        headers: { 'Content-Type': type || 'application/octet-stream' },
      });
      if (res.status !== 200) {
        return await Promise.reject(new Error(`上传分片${partNumber}失败`));
      }
      const newUploaedSize = state.dataSource[i].uploadedSize + file.size;
      state.dataSource[i] = {
        ...state.dataSource[i],
        uploadedSize: newUploaedSize,
        progress: Math.floor((newUploaedSize / totalSize) * 100),
      };
      return await Promise.resolve();
    } catch (error) {
      return await Promise.reject(new Error(`上传分片${partNumber}失败`));
    }
  };

  const handleClose = () => {
    queryClient.refetchQueries(['getFileListByCategory']);
    onCancel();
  };

  const handleDeleteFile = (index: number) => {
    state.dataSource.splice(index, 1);
  };

  const handStopUpload = (index: number) => {
    state.dataSource[index].status = 'error';
    limit.clearQueue();
  };

  return (
    <Modal title="上传" open={open} width={800} footer={null} onCancel={handleClose} destroyOnClose>
      <Card
        size="small"
        title={
          <Space>
            <Upload beforeUpload={() => false} onChange={selectFile} showUploadList={false}>
              <Button type="primary" icon={<UploadOutlined />}>
                选择文件
              </Button>
            </Upload>
            <Button type="primary" icon={<CloudUploadOutlined />} onClick={onUpload}>
              上传文件
            </Button>
          </Space>
        }
      >
        <List
          size="small"
          dataSource={state.dataSource}
          renderItem={(item, index) => (
            <List.Item key={item.uid}>
              <List.Item.Meta
                title={
                  <div>
                    文件名: <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                  </div>
                }
                description={
                  <>
                    <Space size={30}>
                      <div>
                        大小: <span style={{ color: 'blue' }}>{item.unitSize}</span>
                      </div>
                      <div>
                        分片: <span style={{ color: 'blue' }}>{item.chunkFileList.length}</span>
                      </div>
                      <div>
                        md5:{' '}
                        <span style={{ color: 'red' }}>
                          {item.md5 || (!!item.md5Progress && `${item.md5Progress}%`)}
                        </span>
                      </div>
                    </Space>
                    {(item.status === 'uploading' || item.status === 'success') && (
                      <Progress size="small" percent={item.progress} />
                    )}
                  </>
                }
              />
              <Tag color={tagMap[item.status].color}>{tagMap[item.status].text}</Tag>
              {item.status === 'preupload' && (
                <Button type="link" danger onClick={() => handleDeleteFile(index)}>
                  移除
                </Button>
              )}
              {item.status === 'uploading' && (
                <Button type="link" danger onClick={() => handStopUpload(index)}>
                  暂停
                </Button>
              )}
            </List.Item>
          )}
        />
      </Card>
    </Modal>
  );
}

export default UploadModal;
