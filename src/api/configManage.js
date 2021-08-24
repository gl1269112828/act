import request from '@/utils/request'

export function getAutomatedConfiguration(data) { return request({ url: '/api/v1/pages/pageSearch', method: 'post', data }) }
export function addOrEditAutomatedConfiguration(data) { return request({ url: '/api/v1/pages/createOrEdit', method: 'post', data }) }
export function getConfigTable(data) { return request({ url: '/api/v1/pagetableconfigs/pageSearch', method: 'post', data }) }
export function addOrEditAutomatedConfigTable(data) { return request({ url: '/api/v1/pagetableconfigs/createOrEdit', method: 'post', data }) }

export function getPageDetail(data) { return request({ url: `/api/v1/pages/getPageDetail?key=${data}`, method: 'get' }) }

