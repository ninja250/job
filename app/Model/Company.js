'use strict'

const Lucid = use('Lucid')

class Company extends Lucid {
  static get deleteTimestamp () {
    return 'deleted_at'
  }
  users () {
    return this.hasMany('App/Model/User')
  }
  news () {
    return this.hasMany('App/Model/News')
  }
  groups () {
    return this.hasMany('App/Model/Group')
  }
}

module.exports = Company
