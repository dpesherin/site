export class Menu
{
    _defaultItems = []

    constructor(type="main", userData={}){
        if(type === "main"){
            this._defaultItems = [
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
        }else{
            this._defaultItems = [
                {
                    href: "/personal/schedule",
                    name: "Расписание фотосессий"
                },
                {
                    href: "/personal/archive",
                    name: "Архив фотографий"
                }
            ]
            if(userData.role === "admin"){
                this._defaultItems.push({
                    href: "/admin/applications",
                    name: "Заявки пользователей"
                })
            }
        }
    }

    buildMenu(){
        return this._defaultItems
    }
}