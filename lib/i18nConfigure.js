import { I18n } from 'i18n'
import path from 'node:path'
import { __dirname } from '../routes/imageRoutes.js'


const i18n = new I18n({
    locales:['es', 'en'],
    directory: path.join(__dirname, '..', 'locales'),
    defaultLocale:'es',
    autoReload: true,
    syncFiles: true,
    cookie:'nodepop-locale',
})

export default i18n
