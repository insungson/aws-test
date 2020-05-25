import { Select, Button } from 'antd';
import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { REQUEST_PLACE_NEARBY, CLOSE_MAP } from '../reducers/post';

const SearchNearButton = () => {
  const [value, setValue] = useState('cafe');
  const dispatch = useDispatch();
  const { mapLocation, mapOpen } = useSelector(state => state.post);

  const onChangeValue = useCallback((e) => {
    setValue(e);
  }, []);

  const onSubmit = useCallback(() => {
    const mapData = mapLocation;
    const placeType = value;
    dispatch({
      type: REQUEST_PLACE_NEARBY,
      location: mapData,
      placeType,
    });
  }, [mapLocation, value]);

  const onCloseMap = useCallback(() => {
    dispatch({
      type: CLOSE_MAP,
    });
  }, [mapOpen === true]);

  return (
    <>
      <Select defaultValue="cafe" style={{ width: 90 }} onChange={onChangeValue}>
        <Select.Option value="cafe">카페</Select.Option>
        <Select.Option value="restaurant">식당</Select.Option>
        <Select.Option value="bar">술집</Select.Option>
      </Select>
      <Button onClick={onSubmit}>주변검색</Button>
      {mapOpen && <Button onClick={onCloseMap}>지도닫기</Button>}
    </>
  );
};

export default SearchNearButton;