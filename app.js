import {getPartials, setHeaderInfo} from "./scripts/shared.js";
import {get, post} from "./scripts/requester.js";
import {getLogin, getRegister, logout, postLogin, postRegister} from "./scripts/auth-handlers.js";

const app = Sammy('body', function () {
    this.use('Handlebars', 'hbs');

    this.get('#/home', function (context) {
        setHeaderInfo(context);
        const partials = getPartials();
        this.loadPartials(partials)
            .partial('./views/home.hbs');
    });

    this.get('#/register', getRegister);
    this.post('#/register', postRegister);

    this.get('#/login', getLogin);
    this.post('#/login', postLogin);

    this.get('#/logout', logout);

    this.get('#/create', function (context) {
        setHeaderInfo(context);
        this.loadPartials(getPartials())
            .partial('./views/causes/create.hbs')
    });
    this.post('#/create', function (context) {
        const { cause, donors, pictureUrl, neededFunds, description, collectedFunds } = context.params;
        if (cause && pictureUrl && neededFunds && description){
            post('Kinvey', 'appdata', 'causes', {
                cause,
                donors,
                pictureUrl,
                neededFunds,
                description,
                collectedFunds: 0
            }).then(() => {
                context.redirect('#/dashboard')
            }).catch(console.error)
        }
    });

    this.get('#/dashboard', function (context) {
        setHeaderInfo(context);
        get('Kinvey', 'appdata', 'causes')
            .then((causes) => {
                if (causes.length !== 0){
                    context.causes = causes;
                    console.log(causes);
                    this.loadPartials(getPartials())
                        .partial('./views/causes/dashboard.hbs')
                }else {
                    context.causes = causes;
                    this.loadPartials(getPartials())
                        .partial('./views/causes/dashboardNoCauses.hbs')
                }
            })
    });
    this.get('/cause/:id', function (context) {
        const id = context.params.id;

        setHeaderInfo(context);

        get('Kinvey', 'appdata', `causes/${id}`)
            .then((cause) => {
                cause.isCreator = sessionStorage.getItem('userId') === cause._acl.creator;
                context.cause = cause;
                this.loadPartials(getPartials())
                    .partial('../views/causes/details.hbs')
            }).catch(console.error)
    })

});

app.run('#/home');