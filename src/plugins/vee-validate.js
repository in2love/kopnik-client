import {required, email, max, min, size, numeric, length, digits, min_value, max_value,} from "vee-validate/dist/rules";
import { extend } from "vee-validate";

import i18n from "./i18n"

extend("required", {
    ...required,
});

extend("max", {
    ...max,
});
extend("min_value", {
    ...min_value,
});
extend("max_value", {
    ...max_value,
});

extend("email", {
    ...email,
});

extend("length", {
    ...length,
});
extend("numeric", {
    ...numeric,
});

import { localize } from 'vee-validate';
import en from 'vee-validate/dist/locale/en.json';
import ru from 'vee-validate/dist/locale/ru.json';

// Install English and Arabic messages.
localize({
    en,
    ru
})

// названия полей берутся из vue-i18n секция "profile"
let names= {}
for (let [eachLocale, eachLocaleMessages] of Object.entries(i18n.messages)){
    names[eachLocale]= {names: eachLocaleMessages.profile}
}
localize(names)

localize('ru');
