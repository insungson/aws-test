import React, {useCallback, useRef, useEffect} from 'react';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {GOOGLEDRIVE_UPLOAD_REQUEST, TEMPIMAGE_REMOVE_REQUEST} from '../reducers/post';


const GoogleDrive = () => {
  const dispatch = useDispatch();
  const { imageSec, imageSecRemove } = useSelector(state => state.post);
  //imageSecRemove = boolean값 몇 초뒤 삭제를 위한 state

  useEffect(() => {
    if(imageSec.length > 0) {
      setTimeout(() => {
        dispatch({
          type: TEMPIMAGE_REMOVE_REQUEST,
        });
      }, 5000);
    } else {}
  }, [imageSec, imageSecRemove]);

  const imageInput1 = useRef();

  const onClickImageSecUpload = useCallback(() => {
    imageInput1.current.click();
  }, [imageInput1.current]);

  const onChangeImage1 = useCallback((e) => {
    console.log(e.target.files);
    const imageFormData1 = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData1.append('image1', f);
    });
    dispatch({
      type: GOOGLEDRIVE_UPLOAD_REQUEST,
      data: imageFormData1,
    });
  }, []);

  return (
    <>
      <div>
        <input type="file" multiple hidden ref={imageInput1} onChange={onChangeImage1} />
        <Button onClick={onClickImageSecUpload}>이미지 구글드라이브 전송</Button>
      </div>
      <div>
        {imageSec.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={`http://api.travelers-places.com/ex/${v}`} style={{width: '100px'}} alt={v} />
          </div>
        ))}
      </div>
      <div>
        {imageSecRemove && <div style={{color: 'red'}}>미리보기용으로 잠시후 사라집니다</div>}
      </div>
    </>
  );
};

export default GoogleDrive;