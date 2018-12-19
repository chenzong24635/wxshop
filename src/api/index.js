import {wxRequest, uploadImage, uploadVideo} from '../utils/wxRequest'
import {API_HOST} from '../utils/constant'

const host = API_HOST
const apiRoot = 'https://' + host + '/api/'

//盒子列表
export const boxs = (lat, lng, page, pagesize) => wxRequest({query: {lat: lat, lng: lng, page: page, pagesize: pagesize}, showLoading: true}, apiRoot + 'box')

//产品列表
export const products = (boxid, page, pagesize) => wxRequest({query: {boxid: boxid, page: page, pagesize: pagesize}, showLoading: true}, apiRoot + 'products')

