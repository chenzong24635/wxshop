import wepy from 'wepy';
import util from './util';
import tip from './tip'
import {USER_SPECICAL_INFO, SYSTEM_INFO, API_KEY} from './constant'

const TIMESTAMP = util.getCurrentTime()

const wxRequest = async(params = {}, url) => {
    if (params.showLoading)
        tip.loading()
    if (!params.retry) params.retry = 1
    let specialInfo = wepy.getStorageSync(USER_SPECICAL_INFO || {})
    let systemInfo = wepy.getStorageSync(SYSTEM_INFO || {})
    let data = params.query || {}
    data.appkey = API_KEY
    data.time = TIMESTAMP
    data.agent = 'miniapp'
    data.device = ''
    if (specialInfo.token && specialInfo.token !== '') {
        data.token = specialInfo.token
    } else if (params.needLogin && params.retry <= 3) {
        let r = await setTimeout(() => {
            params.retry++
            return wxRequest(params, url)
        }, 1000)
        return r
    }
    if (specialInfo.ip) {
        data.ip = specialInfo.ip
    }
    if (specialInfo.areas) {
        data.areas = specialInfo.areas
    }
    if (systemInfo.model) {
        data.device = systemInfo.model + '|' + systemInfo.system
    }
    
    let res = await wepy.request({
        url: url,
        method: params.method || 'GET',
        data: data,
        header: { 'Content-Type': 'application/json' },
    })
    if (params.showLoading)
        tip.loaded()
    if (res.data) {
        return res.data
    } else {
        tip.error('数据读取失败')
        return null
    }
}

const uploadImage = async(path, url) => {
    let specialInfo = wepy.getStorageSync(USER_SPECICAL_INFO || {})
    let res = await wepy.uploadFile({
        url: url,
        filePath: path,
        name: 'file',
        formData: {
            appkey: API_KEY,
            token: specialInfo.token,
            _method: 'post'
        }
    })

    if (res.data && !res.data.error) {
        return JSON.parse(res.data)
    } else {
        tip.error('上传失败')
        return false
    }
    return false
}
const uploadVideo = async(path, url) => {
    tip.loading('视频上传中')
    let res = await wepy.uploadFile({
        url: url,
        filePath: path,
        name: 'file',
        formData: {
            appkey: API_KEY,
            filetype: 'video',
            _method: 'post'
        }
    })
    tip.loaded()

    if (res.data && !res.data.error) {
        return JSON.parse(res.data)
    } else {
        tip.error('上传失败')
        return false
    }
    return false
}


module.exports = {
    wxRequest,
    uploadImage,
    uploadVideo
}
