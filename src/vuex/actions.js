import shop from '../api/shop'
import * as types from './mutation-types'

export const increment = ({ commit }, product) => {
    commit(types.ADD_NUMBER, 1)
}