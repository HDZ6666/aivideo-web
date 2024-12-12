import { PlusOutlined } from '@ant-design/icons';
import { Upload, UploadFile, Image } from 'antd';
import { useState, useImperativeHandle, forwardRef, useMemo } from 'react';

import SnapshotModal from './snapshot-modal';

import { baseApiUrl } from '#/enum';

interface SnapshotSelectProps {
  value?: string;
  onChange?: (url: string) => void;
}

const SnapshotSelect = forwardRef(({ value, onChange }: SnapshotSelectProps, ref) => {
  const [snapshotModalShow, setSnapshotModalShow] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const setSnapShot = onChange || (() => {});
  useImperativeHandle(ref, () => ({
    handleChooseDevice,
  }));

  const fileList: UploadFile[] = useMemo(() => {
    return value
      ? [
          {
            uid: '-1',
            name: '快照1',
            status: 'done',
            url: `${baseApiUrl}${value}`,
          },
        ]
      : [];
  }, [value]);

  const handlePreview = async () => {
    if (fileList?.length === 0) return;
    setPreviewImage(fileList[0].url!);
    setPreviewOpen(true);
  };

  const handleRemove = () => {
    onChange && onChange('');
    setPreviewOpen(false);
    setPreviewImage('');
  };

  const handleChooseDevice = () => {
    setSnapshotModalShow(true);
  };

  const UploadButton = (
    <button
      style={{ border: 0, background: 'none', width: '100%', height: '100%' }}
      type="button"
      onClick={handleChooseDevice}
    >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>选择历史快照</div>
    </button>
  );

  return (
    <div>
      <Upload
        listType="picture-card"
        openFileDialogOnClick={false}
        fileList={fileList}
        onPreview={handlePreview}
        onRemove={handleRemove}
      >
        {fileList.length >= 1 ? null : UploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible: any) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
      <SnapshotModal
        show={snapshotModalShow}
        setShow={setSnapshotModalShow}
        setSnapShot={setSnapShot}
      />
    </div>
  );
});

export default SnapshotSelect;
