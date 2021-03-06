import once from './once'
import config from "../bottle/bottle";
import * as models from "../models";

export function sync(constructor) {
    // throw new Error("deprecated")
    constructor.prototype.get = once(async function () {
        let result = {
            // id: Math.ceil(Math.random()*100),
            name: "A".repeat(Math.ceil(Math.random() * 10))
        }
        return result
    })

    constructor.prototype.reload = once(async function () {
        let result = await this.get()
        for (let eachPropName of Object.keys(result)) {
            this[eachPropName] = result[eachPropName]
        }

        this.isLoaded = true
    })

    constructor.prototype.loaded = once(async function () {
        if (!this.isLoaded) {
            await this.reload()
        }
        return this
    })

    let result = function (...args) {
        let instance = new constructor(...args)
        instance.isLoaded = false
        return instance
    }
    result.scalars = constructor.scalars

    return result
}

export function scalar(target, name, descriptor) {
    //положить все скалярные поля в статический массив
    target.constructor.scalars = target.constructor.scalars || []
    target.constructor.scalars.push(name)

    //обозначить скарярность в дескрипторе свойства -  не работает
    // descriptor.scalar= true
}

export function object(target, name, descriptor) {
    //положить все скалярные поля в статический массив
    target.constructor.objects = target.constructor.objects || []
    target.constructor.objects.push(name)
}

export function collection(target, name, descriptor) {
    target.constructor.collections = target.constructor.collections || []
    target.constructor.collections.push(name)

    let capitalizedName = name[0].toUpperCase() + name.slice(1)
    /*
    Object.defineProperty(
        target,
        "get" + capitalizedName,
        {
            value: once(async function (...args) {
                let result = []
                return result
            })
        }
    )

conflicts with reloadWitnessRequests
    Object.defineProperty(
        target,
        "reload" + capitalizedName,
        {
            configurable: true,
            value: once(async function (...args) {
                this[name] = this["get" + capitalizedName](...args)
                return this[name]
            })
        }
    )

 // ненадежная шляпа. будет конфликтовать с loadedSubordinates() если разкомитить
    Object.defineProperty(
        target,
        "loaded" + capitalizedName,
        {
            configurable: true,
            get: once(async function (...args) {
                if (this[name] == undefined) {
                    await this["reload" + capitalizedName](...args)
                }
                return this[name]
            })
        }
    )
    */
}
