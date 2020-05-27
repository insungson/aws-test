import React, { useCallback, useEffect, useState } from 'react';
import { Input, AutoComplete } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { LOAD_AUTOPLACE_REQUEST, FIND_PLACE_REQUEST } from '../reducers/post';
import MapImage from './mapImage';


const Map = () => {
  const { mapLocation } = useSelector(state => state.post);
  const dispatch = useDispatch();

  const onSearch = useCallback((e) => {
    dispatch({
      type: FIND_PLACE_REQUEST,
      data: e,
    });
  }, []);

  // autocomplete가 안되는 이유는 input.search에서 onChange가 지원되지 않기 때문이다
  // 위의 onSearch에서 autocomplete 를 받은것을 배열에 넣고, if문의  include로 확인 후 배열에 있으면 place로 검색
  // useEffect(() => {
  //   const autotimer = setTimeout(() => {
  //     dispatch({
  //       type: LOAD_AUTOPLACE_REQUEST,
  //       data: text,
  //     });
  //   }, 500);
  //   return () => clearTimeout(autotimer);
  // }, [text]);

  return (
    <>
      <div>
        <Input.Search
          enterButton
          style={{ verticalAlign: 'middle', width: 600 }}
          onSearch={onSearch}
        />
      </div>
      <div>
        <MapImage location={mapLocation} />
      </div>
    </>
  );
};

export default Map;