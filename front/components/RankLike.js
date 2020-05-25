import React from 'react';
import { useSelector } from 'react-redux';
import RankCard from './RankCard';
import { Card } from 'antd';

const RankLike = () => {
  const { mainPosts } = useSelector(state => state.post);
  console.log('mainpost', mainPosts);
  let likePost = [];
  mainPosts.forEach((v) => {
    if (v.Likers.length !== 0) {
      likePost.push(v);
    }
  });
  likePost.sort((a, b) => b.Likers.length - a.Likers.length);

  return (
    <>
      <div>
        {(likePost.length !== 0) && (
          <Card
            title={"좋아요 TOP 5"}
            style={{ color: 'blue', font: 'normal small-caps 120%/120% fantasy' }}
          >
            {likePost.slice(0, 4).map((v) => {
              return (
                <RankCard key={v.id} post={v} />
              );
            })}
          </Card>
        )}
      </div>  
    </>
  );
};

export default RankLike;