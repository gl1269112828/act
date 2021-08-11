import request from '@/utils/request'

export function getAutomatedConfiguration(data) { return request({ url: '/api/v1/pages/pageSearch', method: 'post', data }) }
export function addOrEditAutomatedConfiguration(data) { return request({ url: '/api/v1/pages/createOrEdit', method: 'post', data }) }
