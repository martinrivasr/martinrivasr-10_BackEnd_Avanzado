

export function logout(req, res, next) {
    req.session.regenerate(err => {
      if (err) return next(err)
      res.redirect('/')
    })
  }

  