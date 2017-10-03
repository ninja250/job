
const UserService = require('../../Service/UserService')
const CompanyService = require('../../Service/CompanyService')
const CompanyContext = require('../Contexts/CompanyContext')
const Validator = use('Validator')

class CompanyController {
  constructor () {
    this.userService = new UserService()
    this.companyService = new CompanyService()
    this.companyContext = new CompanyContext()
  }

  * show (req, res) {
    const loginUser = yield req.auth.getUser()
    const company = yield this.companyService.getCompanyFromUser(loginUser)
    if (company) {
      res.json({
        success: true,
        company
      })
    } else {
      res.json({
        success: false,
        company
      })
    }
  }

  * store (req, res) {

  }

  * update (req, res) {
    const loginUser = yield req.auth.getUser()
    const { id } = yield this.companyService.getCompanyFromUser(loginUser)
    const rules = this.companyContext.storeRules()
    const context = this.companyContext.storeContext(req)
    const validation = yield Validator.validateAll(context, rules)
    if (validation.fails()) {
      res.json({
        success: false,
        error: validation.messages()
      })
      return
    }
    const company = yield this.companyService.update(id, context)
    res.json({
      success: true,
      company
    })
  }

  * destroy (req, res) {
    const loginUser = yield req.auth.getUser()
    const company = yield this.companyService.getCompanyFromUser(loginUser)
    if (company) {
      yield company.delete()
      res.json({success: true})
    } else {
      res.json({success: false})
    }
  }
}

module.exports = CompanyController
