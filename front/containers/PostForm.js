import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST, REMOVE_IMAGE, UPLOAD_IMAGES_REQUEST, ADD_PLACE, CLOSE_MAP, REMOVE_PLACE, REQUEST_PLACE_NEARBY } from '../reducers/post';
import Map from './map';
import SearchNearButton from './SearchNearButton';

const PostForm = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [mapTermError, setMapTermError] = useState(true);
  const { imagePaths, isAddingPost, postAdded, mapPlacename, mapOpen } = useSelector(state => state.post);
  const imageInput = useRef();

  useEffect(() => {
    if (postAdded) {
      setText('');
      dispatch({
        type: REMOVE_PLACE,
      });
    }
  }, [postAdded]);

  useEffect(() => {
    if (mapPlacename) {
      setMapTermError(false);
      const timer = setTimeout(() => {
        dispatch({
          type: CLOSE_MAP,
        });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [mapPlacename]);

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요.');
    }
    if (!mapPlacename) {
      return alert('위치를 등록하세요');
    }
    const formData = new FormData();
    imagePaths.forEach((i) => {
      formData.append('image', i);
    });
    formData.append('content', text);
    formData.append('place', mapPlacename);

    dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [text, imagePaths,mapPlacename]);

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const onChangeImages = useCallback((e) => {
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onRemoveImage = useCallback(index => () => {
    dispatch({
      type: REMOVE_IMAGE,
      index,
    });
  }, []);

  const addLocation = useCallback(() => {
    dispatch({
      type: ADD_PLACE, // mapOpen 을 true로 바꿈
    });
  }, []);

  const removeLocation = useCallback(() => {
    dispatch({
      type: REMOVE_PLACE, // mapPlacename 의 지역이름을 없애줌
    });
  }, []);

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onSubmit={onSubmitForm}>
      <div>
        {mapPlacename && <SearchNearButton />}
        <div style={{ color: 'red' }}>{mapPlacename}</div>
        {mapOpen ? <Map /> : mapPlacename ? <Button onClick={removeLocation} danger="true">삭제</Button> : <Button type="primary" onClick={addLocation}>위치등록</Button>}
        {mapTermError && <div style={{ color: 'red' }}>위치등록 후 글을 게시해 주세요</div>}
      </div>
      <Input.TextArea maxLength={140} placeholder="글을 적어주세요" value={text} onChange={onChangeText} />
      <div>
        <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit" loading={isAddingPost}>게시글등록</Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={v} style={{ width: '200px' }} alt={v} />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
