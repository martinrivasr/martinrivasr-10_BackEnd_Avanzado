
export function changeLocale(req, res, next){
    const locale = req.params.locale

    // poner una cookie en la respuesta
    res.cookie('nodepop-locale', locale,{
        maxAge: 1000 * 60 * 60 * 24 * 30

    })
    // redirigir a la pagina en la que estaba
    res.redirect('back')
}