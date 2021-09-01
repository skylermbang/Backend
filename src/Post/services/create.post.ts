import moment from '../../Infrastructures/utils/moment'
import { Post } from '@prisma/client'
import { prisma } from '../../Infrastructures/utils/prisma'
import { CreatePostValidator } from '../validators'

export default async (requestObject: CreatePostValidator) => {
  const Post = prisma.post

  type PostType = Omit<Post, 'createdAt'> & {
    createdAt: Date | string
  }

  const post: PostType = await Post.create({
    data: requestObject,
    include: { user: true }
  })

  post.createdAt = moment(post.createdAt as Date)

  return post
}
