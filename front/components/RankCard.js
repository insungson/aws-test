import React, { useCallback } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Avatar, Card, Icon } from 'antd';
import Router from 'next/router';
import { LOAD_POST_REQUEST } from '../reducers/post';

import PostCardContent from './PostCardContent';

const RankCard = ({ post }) => {
  const dispatch = useDispatch();

  const onLoadPost = useCallback(() => {
    dispatch({
      type: LOAD_POST_REQUEST,
      data: post.id,
    });
    const timer = setTimeout(() => {
      Router.push(`/post/${post.id}`);
    }, 2000);
    return () => clearTimeout(timer);
  }, [post]);
  
  return (
    <>
      <a>
        <Card
          hoverable
          style={{ marginTop: 16 }}
          onClick={onLoadPost}
        >
          <Card.Meta 
            avatar={(
              <Link
                href={{ pathname: '/user', query: { id: post.User.id }}}
                as={`/user/${post.User.id}`}
              >
                <a><Avatar>{post.User.nickname[0]}</Avatar></a>
              </Link>
            )}
            title={post.User.nickname}
            description={<PostCardContent postData={post.content} />}
          />
          <div style={{ color: "red" }}>장소: {post.place}</div>
          <div>{post && post.Likers.length}명이 이글을 좋아합니다</div> 
        </Card>
      </a>
    </>
  );
};

RankCard.porpTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    place: PropTypes.string,
  }).isRequired,
};

export default RankCard;