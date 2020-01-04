import {container} from '../plugins/bottle'
import _ from 'lodash'
import jsonToFormData from 'json-form-data'
import {KopnikApiError} from "../KopnikError";


export default async function fetchApi(url, options = {}) {
    const defaultOptions = {
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': !options.method || options.method.toUpperCase() == 'GET' ? 'text/plain' : 'application/x-www-form-urlencoded;charset=UTF-8',
            }
        },
        cookieOptions = container.cookieService.cookie ? {headers: {Cookie: container.cookieService.cookie}} : {}

    options = _.merge({}, defaultOptions, cookieOptions, options)
    if (options.body && options.headers['Content-Type'] === 'application/x-www-form-urlencoded;charset=UTF-8') {
        options.body = jsonToFormData(options.body)
    }
    // container.logger.warn(options)
    // console.log(container.config.api.path)
    let fullUrl = `${container.config.api.path}/${url}`.replace(/\w+\/\.\.\//, '')

    try {
        var response = await fetch(fullUrl, options)
        // Пропал 4G
    } catch (err) {
        throw new KopnikApiError(err.message, null, fullUrl)
    }
    // Не найдена страница или синтаксическая ошибка в веб-сервисе
    if (!response.ok) {
        throw new KopnikApiError(response.statusText, response.status, fullUrl)
    }

    let cookie = response.headers.get('set-cookie')
    if (cookie) {
        cookie = cookie.match(/(\w+=(\w|\d)+)/)[0]
        container.cookieService.cookie = cookie
    }
    // container.logger.warn(cookie, response.headers)
    let result
    switch (response.headers.get('Content-Type')) {
        case 'application/json':
            // result = await response.text()
            result = await response.json()
            // Не авторизован/Нет такого пользователя
            if (result.error) {
                throw new KopnikApiError(result.error.error_msg, result.error.error_code, fullUrl)
            }
            break
        default:
            result = await response.text()
    }

    return result.response
}
