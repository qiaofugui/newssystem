import axios from "axios";

import { store } from "../redux/store";

// axios.defaults.baseURL = 'http://0.0.0.0:3001'
// axios.defaults.baseURL = 'http://news.qiaofugui.cn:3001'
// axios.defaults.baseURL = 'https://news-rear-glitch.glitch.me'
axios.defaults.baseURL = 'https://news-rear-deploy.onrender.com'

// axios.defaults.headers

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  store.dispatch({
    type: 'change_loading',
    payload: true
  })
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  store.dispatch({
    type: 'change_loading',
    payload: false
  })
  return response;
}, function (error) {
  // 对响应错误做点什么
  store.dispatch({
    type: 'change_loading',
    payload: false
  })
  return Promise.reject(error);
});