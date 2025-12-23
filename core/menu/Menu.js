export class Menu
{
    _defaultItems = [
        {
            href: "/#about",
            name: "О фотографе"
        },
        {
            href: "#",
            name: "Портфолио"
        },
        {
            href: "/#faq",
            name: "FAQ"
        },
        {
            href: "/#form",
            name: "Хочу фотосессию"
        }
    ]

    constructor(items = []){
        if(items.length > 0){
            this._defaultItems = items
        }
    }

    buildMenu(){
        return this._defaultItems
    }
}