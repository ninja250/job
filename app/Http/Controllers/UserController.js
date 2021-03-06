const UserService = require('../../Service/UserService')
const CompanyService = require('../../Service/CompanyService')
const UserContext = require('../Contexts/UserContext')
const HttpService = require('../../Service/HttpService')
const AuthService = require('../../Service/AuthService')
const Validator = use('Validator')

class UserController {
  constructor () {
    this.userService = new UserService()
    this.userContext = new UserContext()
    this.companyService = new CompanyService()
    this.httpService = new HttpService()
    this.authService = new AuthService()
  }

  * me (req, res) {
    const loginUser = yield req.auth.getUser()
    const context = this.userContext.returnMeContext(loginUser)
    return this.httpService.success(res, { me: context })
  }

  * index (req, res) {
    const loginUser = yield req.auth.getUser()
    const users = yield this.userService.fetchUsersFromUser(loginUser)
    return this.httpService.success(res, { users })
  }

  * show (req, res) {
    const id = req.param('id')
    const loginUser = yield req.auth.getUser()
    const isContain = yield this.companyService.contains(loginUser, id)
    if (!isContain) {
      return this.httpService.failed(res, { error: 'Forbidden' }, 403)
    }
    const user = yield this.userService.getById(id)
    return this.httpService.success(res, { user })
  }

  * store (req, res) {
    const loginUser = yield req.auth.getUser()
    const company = yield this.companyService.getCompanyFromUser(loginUser)
    const rules = this.userContext.storeRules()
    const context = this.userContext.storeContext(req)
    const validation = yield Validator.validateAll(context, rules)
    if (validation.fails()) {
      return this.httpService.failed(res, { error: validation.messages() }, 403)
    }
    const user = yield this.userService.store(company, context)
    return this.httpService.success(res, { user })
  }

  * update (req, res) {
    const id = req.param('id')
    const loginUser = yield req.auth.getUser()
    const rules = this.userContext.updateRules()
    const context = this.userContext.updateContext(req)
    const validation = yield Validator.validateAll(context, rules)
    const isContain = yield this.companyService.contains(loginUser, id)
    if (!isContain) {
      return this.httpService.failed(res, { error: 'Forbidden' }, 403)
    }
    if (validation.fails()) {
      return this.httpService.failed(res, { error: validation.messages() }, 403)
    }
    const user = yield this.userService.update(id, context)
    return this.httpService.success(res, { user })
  }

  * destroy (req, res) {
    const id = req.param('id')
    const loginUser = yield req.auth.getUser()
    const isContain = yield this.companyService.contains(loginUser, id)
    if (!isContain) {
      return this.httpService.failed(res, { error: 'Forbidden' }, 403)
    }
    const user = yield this.userService.getById(id)
    yield user.delete()
    return this.httpService.success(res)
  }

  * passwordUpdate (req, res) {
    const loginUser = yield req.auth.getUser()
    const id = loginUser.id
    const rules = this.userContext.passwordUpdateRules()
    const context = this.userContext.passwordUpdateContext(req)
    const validation = yield Validator.validateAll(context, rules)
    if (validation.fails()) {
      return this.httpService.failed(res, { error: validation.messages() }, 403)
    }
    const isValid = yield this.authService.passwordCheck(req, loginUser.email, context.password)
    if (!isValid) {
      return this.httpService.failed(res, { error: 'Password does not match' }, 403)
    }
    const user = yield this.userService.update(id, { password: context.newPassword })
    return this.httpService.success(res, { user })
  }
}

module.exports = UserController
