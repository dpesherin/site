export class UserModel
{
    id
    login
    active
    email
    name
    lastname
    pass
    date_create

    constructor(data = {})
    {
        Object.assign(this, data)
    }
}