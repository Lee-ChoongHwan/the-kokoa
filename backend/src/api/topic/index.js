import Router from 'koa-router'
import topicCtrl from './topic.controller'

const app = new Router()

app.get('/boardName/:domain', topicCtrl.getBoardName)
app.get('/categories/:domain', topicCtrl.getCategories)
app.get('/read/:id', topicCtrl.getContent)
app.get('/list/widget', topicCtrl.getListToWidget)
app.post('/list', topicCtrl.getList)
app.post('/write', topicCtrl.createTopic)
app.post('/vote/topic', topicCtrl.createTopicVotes)
app.post('/vote/post', topicCtrl.createPostVotes)

module.exports = app