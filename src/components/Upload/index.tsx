import { BASE_URL } from '@/utils/constants';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Image, message } from 'antd';
import { useRef, useState } from 'react';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  readonly?: boolean;
}

const Upload: React.FC<Props> = (props) => {
  const fileUploadClass = useEmotionCss(({ token }) => ({
    width: 200,
    height: 80,
    borderRadius: token.borderRadius,
    backgroundColor: '#fafafa',
    border: '1px dashed #d9d9d9',
    transition: 'border-color .3s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#1677ff;',
    },
  }));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageURL, setImageURL] = useState<string>();
  const [propsValue, setPropsValue] = useState(props.value);

  return (
    <div style={{ width: 200, height: 80, position: 'relative' }}>
      {propsValue ? (
        <>
          {!props.readonly && (
            <div
              onClick={() => setPropsValue('')}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                zIndex: 99,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <CloseOutlined style={{ fontSize: 20 }} />
            </div>
          )}
          <Image width={200} height={80} src={imageURL ?? propsValue} />
        </>
      ) : (
        <div className={fileUploadClass} onClick={() => fileInputRef.current?.click()}>
          <PlusOutlined style={{ fontSize: '30px' }} />
          <span>上传图片</span>
        </div>
      )}
      <input
        ref={fileInputRef}
        style={{ display: 'none' }}
        type="file"
        onChange={async (e) => {
          const formData = new FormData();
          formData.append('images', e.target.files![0]);
          const res = await fetch(BASE_URL + '/upload', { method: 'post', body: formData }).then(
            (res) => res.json(),
          );
          if (res.code === 201) {
            message.success('图片上传成功');
            const url = 'http://192.168.101.5:3000' + res.data[0].url;
            setImageURL(url);
            setPropsValue(url);
            props?.onChange?.(url);
          }
        }}
      />
    </div>
  );
};
export default Upload;
