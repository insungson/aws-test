import produce from 'immer';

export const initialState = {
  mainPosts: [], // 화면에 보일 포스트들
  imagePaths: [], // 미리보기 이미지 경로
  addPostErrorReason: '', // 포스트 업로드 실패 사유
  isAddingPost: false, // 포스트 업로드 중
  postAdded: false, // 포스트 업로드 성공
  isAddingComment: false,
  addCommentErrorReason: '',
  commentAdded: false,
  singlePost: null, //게시글1개를 자세히 볼 수 있는 경우
  hasMorePost: false, //게시글 인피니트 스크롤링의 유무
  mapLocation: {}, //위치정보 (lat,lng,image,name)
  placeNearBys: [], // 근처위치정보
  mapPlacename: '',//PosrForm 에서 나온 place 이름
  mapOpen: false, // 지도컴포넌트 열기닫기
  imageSec: [], //구글드라이브 미리보기용
  imageSecRemove: false, //구글드라이브용
};

//구글드라이브용 액션명령어
export const GOOGLEDRIVE_UPLOAD_REQUEST = 'GOOGLEDRIVE_UPLOAD_REQUEST';
export const GOOGLEDRIVE_UPLOAD_SUCCESS = 'GOOGLEDRIVE_UPLOAD_SUCCESS';
export const GOOGLEDRIVE_UPLOAD_FAILURE = 'GOOGLEDRIVE_UPLOAD_FAILURE';

export const TEMPIMAGE_REMOVE_REQUEST = 'TEMPIMAGE_REMOVE_REQUEST';
export const TEMPIMAGE_REMOVE_SUCCESS = 'TEMPIMAGE_REMOVE_SUCCESS';
export const TEMPIMAGE_REMOVE_FAILURE = 'TEMPIMAGE_REMOVE_FAILURE';
//

export const REQUEST_PLACE_NEARBY = 'REQUEST_PLACE_NEARBY';
export const SUCCESS_PLACE_NEARBY = 'SUCCESS_PLACE_NEARBY';
export const FAILURE_PLACE_NEARBY = 'FAILURE_PLACE_NEARBY';

export const FIND_PLACE_REQUEST = 'FIND_PLACE_REQUEST';
export const FIND_PLACE_SUCCESS = 'FIND_PLACE_SUCCESS';
export const FIND_PLACE_FAILURE = 'FIND_PLACE_FAILURE';

export const CLOSE_MAP = 'CLOSE_MAP';
export const ADD_PLACE = 'ADD_PLACE';
export const ADD_MAP_LOCATION = 'ADD_MAP_LOCATION';
export const REMOVE_PLACE ='REMOVE_PLACE';

export const LOAD_AUTOPLACE_REQUEST = 'LOAD_AUTOPLACE_REQUEST';
export const LOAD_AUTOPLACE_SUCCESS = 'LOAD_AUTOPLACE_SUCCESS';
export const LOAD_AUTOPLACE_FAILURE = 'LOAD_AUTOPLACE_FAILURE';

export const LOAD_MAIN_POSTS_REQUEST = 'LOAD_MAIN_POSTS_REQUEST';
export const LOAD_MAIN_POSTS_SUCCESS = 'LOAD_MAIN_POSTS_SUCCESS';
export const LOAD_MAIN_POSTS_FAILURE = 'LOAD_MAIN_POSTS_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const LOAD_COMMENTS_REQUEST = 'LOAD_COMMENTS_REQUEST';
export const LOAD_COMMENTS_SUCCESS = 'LOAD_COMMENTS_SUCCESS';
export const LOAD_COMMENTS_FAILURE = 'LOAD_COMMENTS_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export default (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case UPLOAD_IMAGES_REQUEST: {
        break;
      }
      case UPLOAD_IMAGES_SUCCESS: {
        action.data.forEach((p) => {
          draft.imagePaths.push(p);
        });
        break;
      }
      case UPLOAD_IMAGES_FAILURE: {
        break;
      }
      case REMOVE_IMAGE: {
        const index = draft.imagePaths.findIndex((v, i) => i === action.index);
        draft.imagePaths.splice(index, 1);
        break;
      }
      case ADD_POST_REQUEST: {
        draft.isAddingPost = true;
        draft.addingPostErrorReason = '';
        draft.postAdded = false;
        break;
      }
      case ADD_POST_SUCCESS: {
        draft.isAddingPost = false;
        draft.mainPosts.unshift(action.data);
        draft.postAdded = true;
        draft.imagePaths = [];
        break;
      }
      case ADD_POST_FAILURE: {
        draft.isAddingPost = false;
        draft.addPostErrorReason = action.error;
        break;
      }
      case ADD_COMMENT_REQUEST: {
        draft.isAddingComment = true;
        draft.addCommentErrorReason = '';
        draft.commentAdded = false;
        break;
      }
      case ADD_COMMENT_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
        draft.mainPosts[postIndex].Comments.push(action.data.comment);
        draft.isAddingComment = false;
        draft.commentAdded = true;
        break;
      }
      case ADD_COMMENT_FAILURE: {
        draft.isAddingComment = false;
        draft.addingPostErrorReason = action.error;
        break;
      }
      case LOAD_COMMENTS_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
        draft.mainPosts[postIndex].Comments = action.data.comments;
        break;
      }
      case LOAD_MAIN_POSTS_REQUEST:
      case LOAD_HASHTAG_POSTS_REQUEST:
      case LOAD_USER_POSTS_REQUEST: {
        draft.mainPosts = !action.lastId ? [] : draft.mainPosts;
        draft.hasMorePost = action.lastId ? draft.hasMorePost : true;
        break;
      }
      case LOAD_MAIN_POSTS_SUCCESS:
      case LOAD_HASHTAG_POSTS_SUCCESS:
      case LOAD_USER_POSTS_SUCCESS: {
        action.data.forEach((d) => {
          draft.mainPosts.push(d);
        });
        draft.hasMorePost = action.data.length === 10;
        break;
      }
      case LOAD_MAIN_POSTS_FAILURE:
      case LOAD_HASHTAG_POSTS_FAILURE:
      case LOAD_USER_POSTS_FAILURE: {
        break;
      }
      case LIKE_POST_REQUEST: {
        break;
      }
      case LIKE_POST_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
        draft.mainPosts[postIndex].Likers.unshift({ id: action.data.userId });
        break;
      }
      case LIKE_POST_FAILURE: {
        break;
      }
      case UNLIKE_POST_REQUEST: {
        break;
      }
      case UNLIKE_POST_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
        const likeIndex = draft.mainPosts[postIndex].Likers.findIndex(v => v.id === action.data.userId);
        draft.mainPosts[postIndex].Likers.splice(likeIndex, 1);
        break;
      }
      case UNLIKE_POST_FAILURE: {
        break;
      }
      case RETWEET_REQUEST: {
        break;
      }
      case RETWEET_SUCCESS: {
        draft.mainPosts.unshift(action.data);
        break;
      }
      case RETWEET_FAILURE: {
        break;
      }
      case REMOVE_POST_REQUEST: {
        break;
      }
      case REMOVE_POST_SUCCESS: {
        const index = draft.mainPosts.findIndex(v => v.id === action.data);
        draft.mainPosts.splice(index, 1);
        break;
      }
      case REMOVE_POST_FAILURE: {
        break;
      }
      case LOAD_POST_SUCCESS: {
        draft.singlePost = action.data;
        break;
      }   
      case LOAD_AUTOPLACE_REQUEST: {
        draft.autoOptions = [];
        break;
      }
      case LOAD_AUTOPLACE_SUCCESS: {
        action.data.forEach((v) => {
          draft.autoOptions.push({ value: v.terms[0].value });
        });
        break;
      }
      case LOAD_AUTOPLACE_FAILURE: {
        break;
      }
      case ADD_MAP_LOCATION: {
        draft.mapPlacename = action.data;
        break;
      }
      case CLOSE_MAP: {
        draft.mapOpen = false;
        break;
      }
      case REMOVE_PLACE: {
        draft.mapPlacename = '';
        break;
      }
      case ADD_PLACE: {
        draft.mapOpen = true;
        break;
      }
      case FIND_PLACE_REQUEST: {
        draft.mapLocation = {};
        draft.placeNearBys = [];
        break;
      }
      case FIND_PLACE_SUCCESS: {
        const placegoogle = action.data;
        draft.mapLocation.lat = placegoogle.geometry.location.lat;
        draft.mapLocation.lng = placegoogle.geometry.location.lng;
        draft.mapLocation.name = placegoogle.name;
        draft.mapLocation.image = placegoogle.photos[0].photo_reference;
        break;
      }
      case FIND_PLACE_FAILURE: {
        break;
      }
      case REQUEST_PLACE_NEARBY: {
        draft.mapOpen = true;
        draft.placeNearBys = [];
        break;
      }
      case SUCCESS_PLACE_NEARBY: {
        draft.placeNearBys.push(action.data);
        break;
      }
      case FAILURE_PLACE_NEARBY: {
        draft.mapOpen = false;
        break;
      }
      case GOOGLEDRIVE_UPLOAD_REQUEST: {
        break;
      }
      case GOOGLEDRIVE_UPLOAD_SUCCESS: {
        draft.imageSec.push(action.data);
        draft.imageSecRemove = true;
        break;
      }
      case GOOGLEDRIVE_UPLOAD_FAILURE: {
        break;
      }
      case TEMPIMAGE_REMOVE_REQUEST: {
        draft.imageSec = [];
        draft.imageSecRemove = false;
        break;
      }
      case TEMPIMAGE_REMOVE_SUCCESS: {
        break;
      }
      case TEMPIMAGE_REMOVE_FAILURE: {
        break;
      }
      default: {
        break;
      }
    }
  });
};
