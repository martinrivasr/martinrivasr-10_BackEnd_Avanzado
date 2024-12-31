import session from 'express-session';
import MongoStore from 'connect-mongo';

const INACTIVITY_EXPIRATION_2_DAYS = 1000 * 60 * 60 * 24 * 2;

export const middleware = session({
  name: 'nodeapp-session',
  secret: 'lkblnlknñnñknjbl,bkhzvygfcaojñbkjb',
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: INACTIVITY_EXPIRATION_2_DAYS },
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/nodepop',
  })
});

export function useSessionInViews(req, res, next) {
  res.locals.session = req.session
  console.log('usuario logado en sessioninviews', res.locals.session)
  next()
}

export function isLogged(req, res, next) {
  console.log('entro a islogget')
  if (!req.session.userID) {
    res.redirect('/login')
    return
  }
  next()
}