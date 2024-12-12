import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

function LivePlayer(props) {
  // eslint-disable-next-line react/prop-types
  const { videoUrl, fullScreen = false, live = false } = props;
  const playerDom = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const playHandler = () => {
    setLoading(false);
  };

  const errorHandler = () => {
    setLoading(false);
    setError(true);
  };
  useEffect(() => {
    let player;
    if (playerDom && playerDom.current) {
      player = playerDom.current;
      setLoading(true); // 默认加载
      setError(false);
      if (videoUrl === '' || !videoUrl) {
        setLoading(false); // 没有url直接结束loading
      }
      player.addEventListener('play', playHandler);
      player.addEventListener('error', errorHandler);
    }
    return () => {
      player.removeEventListener('play', playHandler);
      player.removeEventListener('error', errorHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl]);
  return (
    <VideoBox>
      {loading ? (
        <div className="spin-container">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} />} />
          <span style={{ color: '#fff' }}>视频加载中...</span>
        </div>
      ) : (
        ''
      )}
      {error ? (
        <div className="spin-container">
          <span style={{ color: '#fff' }}>视频播放失败...</span>
        </div>
      ) : (
        ''
      )}
      <live-player
        ref={playerDom}
        video-url={videoUrl}
        live={live}
        stretch="true"
        hasaudio="false"
        fluent="true"
        autoplay="true"
        hide-big-play-button="true"
        alt="无画面"
        aspect={fullScreen ? 'fullscreen' : ''}
      />
    </VideoBox>
  );
}

export default LivePlayer;
const VideoBox = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;

  .spin-container {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #000000;
  }
`;
