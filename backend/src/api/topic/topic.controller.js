import { getUser } from '../../lib/user'
import createTopic, { createTopicCounts } from '../../database/topic/createTopic'
import getTopic from '../../database/topic/getTopic'

exports.getList = async ctx => {
  /*const { type, page } = ctx.params
  const { ...query } = ctx.request.query
  const page = query.page || 1
  const limit = query.limit || 20



  const columns = {}
  if (query.boardName) columns.boardName = query.boardName
  if (query.category) columns.category = query.category
  if (query.isBest) columns.isBest = query.isBest

  console.log(columns)*/



  ctx.body = 'a'
}

exports.getContent = async ctx => {
  const { id } = ctx.params
  if (id < 1) return
  const topic = await getTopic(id)
  if (!topic) return ctx.body = { status: 'fail' }
  ctx.body = topic
}

exports.createTopic = async ctx => {
  const user = await getUser(ctx.get('x-access-token'))
  if (!user) return
  let {
    boardDomain,
    category,
    title,
    content,
    isNotice
  } = ctx.request.body
  const ip = ctx.ip
  const header = ctx.header['user-agent']
  const isImage = false
  const topicId = await createTopic({
    userId: user.id,
    boardDomain,
    category,
    author: user.nickname,
    title,
    content,
    ip,
    header,
    isImage,
    isNotice
  })
  await createTopicCounts(topicId)
  ctx.body = { topicId, status: 'ok' }
}