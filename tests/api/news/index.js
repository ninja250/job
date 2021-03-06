const test = require('ava')
const axios = require('axios')
const { _login, _news } = require('../../context')
var http

require('dotenv').config()
test.before(t => {
  return axios.post(`${process.env.API_URL}/api/v1/login`, _login).then(({status, data}) => {
    http = axios.create({
      baseURL: `${process.env.API_URL}/api/v1/`,
      headers: {
        'Authorization': `Bearer ${data.token}`
      }
    })
  })
})

test('ニュース一覧取得', async t => {
  const { status } = await http.get('/news')
  t.is(status, 200)
})

test('ニュース個別取得', async t => {
  const { data } = await http.get('/news')
  const [news] = data.news
  const { status } = await http.get(`/news/${news.id}`)
  t.is(status, 200)
})

test('ニュース登録', async t => {
  const { status } = await http.post(`/news`, _news)
  t.is(status, 200)
})

test('ニュース編集', async t => {
  const { data } = await http.get('/news')
  const [news] = data.news
  const { status } = await http.put(`/news/${news.id}`, _news)
  t.is(status, 200)
})

// test('ニュース削除', async t => {
//   const { data } = await http.get('/news')
//   const [news] = data.news
//   const { status } = await http.delete(`/news/${news.id}`)
//   t.is(status, 200)
// })
