import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { ADD_MAP_LOCATION, CLOSE_MAP } from '../reducers/post';

const MapImage = ({ location }) => { // location에는 lat,lng,image,placename 이 들어가야 한다
  const dispatch = useDispatch();
  const { placeNearBys } = useSelector(state => state.post);

  const center1 = location.lat ? { lat: location.lat, lng: location.lng } : { lat: 37.540705, lng: 126.956764 };
  const createInfoWindow = (map) => {
    const testPlace = { ...placeNearBys };
    console.log('나오는지 체크', testPlace);

    const addPlace = () => {
      dispatch({
        type: ADD_MAP_LOCATION,
        data: location.name,
      });
    };

    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div class='map_info_wrapper'><div class='img_wrapper'><img src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=250&photoreference=${location.image}&key=AIzaSyCddFzczTKqicDNJ_kpdRc8laJr9JopSwI"/></div>
      <div class='property_content_wrap'>
      <div class='property_title'>
      <b>${location.name}</b>
      </div>
      <div class='property_price'>
      <button class="button button2" onclick="${addPlace()}">등록</button>
      </div>
      </div></div>`,
      position: { lat: location.lat, lng: location.lng },
    });
    infoWindow.open(map);
  };

  const onMapLoad = (map) => {
    let marker;
    let placeNearData = { ...placeNearBys }; //리덕스는얕은 복사를 사용
    if (placeNearBys.length !== 0) {

      console.log('placeNearBys', placeNearBys[0].data);
      placeNearBys[0].data.forEach((a) => {
        console.log('식당정보',a);
        let div = document.createElement('div');
        div.textContent = a.name;
        div.setAttribute('style',
          'box-shadow: 0px 2px 10px 1px rgba(0,0,0,0.5);'
        );
        const infoWindow = new window.google.maps.InfoWindow({
          content: div,
          position: { lat: a.geometry.location.lat, lng: a.geometry.location.lng },
        });

        infoWindow.open(map);
      });


    } else {
      marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.name,
      });
      const data1 = { map, placeNearData };
      console.log('data', data1);
      marker.addListener('click', (e) => {
        console.log('뭘가르킬까?', e, data1);
        createInfoWindow(map);
      });
    }

  };

  const onScriptLoad = () => {
    const map = new window.google.maps.Map(
      document.getElementById('map_id'), {
        zoom: 13,
        center: center1,
      },
    );
    onMapLoad(map);
  };

  useEffect(() => {
    if (!window.google) {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = 'https://maps.google.com/maps/api/js?key=AIzaSyCddFzczTKqicDNJ_kpdRc8laJr9JopSwI';
      const x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
      s.addEventListener('load', () => {
        onScriptLoad();
      });
    } else {
      onScriptLoad();
    }
  }, [location, placeNearBys]); // 이렇게 넣어야 계속 하부함수로 값을 이어갈 수 있다

  return (
    <div style={{ width: 600, height: 600 }} id="map_id" />
  );
};

MapImage.propTypes = {
  location: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
  }),
};

export default MapImage;
