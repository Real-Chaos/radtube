const bcrypt = require('bcrypt')
const prisma = require('../models/prismaClient')


const authController = {
  async registerUser(req, res) {
    const {email, username, password} = req.body

  
    try {

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await prisma.user.create({
        data: {email, username, password: hashedPassword}
      })

      res.redirect('/login')
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = authController