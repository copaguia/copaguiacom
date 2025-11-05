export interface PostInterface {
    id: string;
  userId: string;
  username: string;
  imageUrl: string;
  caption: string;
  timestamp: any; 
  likesCount?: number;
  commentsCount?: number;
}
